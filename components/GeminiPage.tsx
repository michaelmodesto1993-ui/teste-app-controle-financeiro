import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Content } from '@google/genai';
import { Account, Transaction, TransactionCategory, TransactionType } from '../types.ts';
import { GeminiIcon, SendIcon } from './icons.tsx';
import { formatCurrency } from '../utils/helpers.ts';
import ReactMarkdown from 'react-markdown';

// Define the props for the GeminiPage component
interface GeminiPageProps {
    accounts: Account[];
    transactions: Transaction[];
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
    // The other props are available but not used in this implementation for brevity.
    // onUpdateTransaction, onDeleteTransaction, onAddAccount, onUpdateAccount, onDeleteAccount
}

const GeminiPage: React.FC<GeminiPageProps> = (props) => {
    const [messages, setMessages] = useState<Content[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Automatically scroll to the bottom of the chat view when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        // Hierarchical API key retrieval
        const userApiKey = localStorage.getItem('mairfim-gemini-api-key');
        const buildApiKey = process.env.API_KEY;
        const apiKey = userApiKey || buildApiKey;

        if (!apiKey) {
            setError("Chave de API não configurada. Por favor, adicione sua chave na página de Configurações.");
            return;
        }

        const userMessage: Content = { role: 'user', parts: [{ text: input }] };
        const currentMessages = [...messages, userMessage];
        
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            // Initialize with the determined API key
            const ai = new GoogleGenAI({ apiKey });

            const systemInstruction = `
                Você é MAIRFIM AI, um assistente financeiro inteligente integrado ao aplicativo de finanças pessoais MAIRFIM.
                Sua principal função é ajudar os usuários a gerenciar suas finanças de forma conversacional e eficiente.
                - Seja amigável, prestativo e direto.
                - Utilize as funções disponíveis para adicionar transações quando solicitado.
                - Sempre confirme as ações antes de executá-las, resumindo o que será feito.
                - Baseie suas respostas e análises nos dados atuais de contas e transações fornecidos.
                - Data atual: ${new Date().toLocaleDateString('pt-BR')}.
                - Peça esclarecimentos se um comando for ambíguo.
                - Não invente informações. Se não souber algo, diga que não tem essa informação.
                - Use markdown para formatar suas respostas, especialmente para listas e ênfase.

                Contexto de dados do usuário (use os IDs para as funções):
                Contas: ${JSON.stringify(props.accounts)}
                Últimas Transações: ${JSON.stringify(props.transactions.slice(-20))}
            `;
            
            // Function declarations for Gemini
            const addTransactionDeclaration: FunctionDeclaration = {
                name: 'addTransaction',
                parameters: {
                    type: Type.OBJECT,
                    description: 'Adiciona uma nova transação (receita ou despesa). Use a data atual se não for especificada.',
                    properties: {
                        accountId: { type: Type.STRING, description: 'O ID da conta para associar a transação. Peça ao usuário se não estiver claro.' },
                        type: { type: Type.STRING, enum: Object.values(TransactionType), description: 'O tipo da transação (Receita ou Despesa).' },
                        description: { type: Type.STRING, description: 'A descrição da transação.' },
                        amount: { type: Type.NUMBER, description: 'O valor da transação.' },
                        date: { type: Type.STRING, description: `A data da transação (formato YYYY-MM-DD). Use ${new Date().toISOString().split('T')[0]} se não for especificado.` },
                        category: { type: Type.STRING, enum: Object.values(TransactionCategory), description: 'A categoria da transação.' },
                    },
                    required: ['accountId', 'type', 'description', 'amount', 'date', 'category'],
                },
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: currentMessages,
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: [addTransactionDeclaration] }],
                },
            });
            
            let modelResponseMessage: Content;

            if (response.functionCalls && response.functionCalls.length > 0) {
                const fc = response.functionCalls[0];
                let confirmationText = 'Não consegui executar a função solicitada.';
                if (fc.name === 'addTransaction') {
                    const args = fc.args as Omit<Transaction, 'id' | 'userId'>;
                    props.onAddTransaction(args);
                    confirmationText = `Transação "${args.description}" de ${formatCurrency(args.amount)} adicionada com sucesso!`;
                }
                modelResponseMessage = { role: 'model', parts: [{ text: confirmationText }] };
            } else {
                modelResponseMessage = { role: 'model', parts: [{ text: response.text }] };
            }
            
            setMessages(prev => [...prev, modelResponseMessage]);

        } catch (e) {
            console.error("Error calling Gemini API:", e);
            const errorMessage = "Desculpe, não consegui processar sua solicitação. Pode ter ocorrido um erro de conexão ou com a chave da API.";
            setError(errorMessage);
            const errorResponseMessage: Content = { role: 'model', parts: [{ text: errorMessage }] };
            setMessages(prev => [...prev, errorResponseMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-150px)] bg-surface rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                        <GeminiIcon className="w-16 h-16 mb-4" />
                        <h2 className="text-2xl font-bold text-text-primary">MAIRFIM AI</h2>
                        <p className="max-w-md mt-2">Sou seu assistente financeiro. Peça-me para adicionar transações, analisar seus gastos ou tirar dúvidas sobre suas finanças.</p>
                        <p className="text-xs mt-4 max-w-md">Ex: "Adicione uma despesa de 50 reais para o almoço de hoje na conta do Nubank, categoria alimentação."</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface-dark'}`}>
                           <ReactMarkdown className="prose prose-sm prose-invert max-w-none">
                               {msg.parts[0].text || ''}
                           </ReactMarkdown>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-surface-dark">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:0s]"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border">
                 {error && <p className="text-expense text-center text-sm mb-2">{error}</p>}
                <div className="flex items-center bg-surface-dark rounded-lg p-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Converse com o MAIRFIM AI..."
                        className="flex-1 bg-transparent p-2 outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="p-2 bg-primary rounded-md text-white transition-colors disabled:bg-surface disabled:text-text-secondary">
                        {isLoading ? (
                             <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <SendIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeminiPage;