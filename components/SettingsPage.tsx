import React, { useState } from 'react';
import { ThemeName } from '../types.ts';
import { TrashIcon } from './icons.tsx';

interface SettingsPageProps {
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
    investmentPercentage: number;
    onInvestmentPercentageChange: (percentage: number) => void;
    creditCardAlertThreshold: number;
    onCreditCardAlertThresholdChange: (percentage: number) => void;
    onClearAllTransactions: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
    theme,
    onThemeChange,
    investmentPercentage,
    onInvestmentPercentageChange,
    creditCardAlertThreshold,
    onCreditCardAlertThresholdChange,
    onClearAllTransactions,
}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('mairfim-gemini-api-key') || '');

    const handleConfirmDelete = () => {
        onClearAllTransactions();
        setIsDeleteModalOpen(false);
    };

    const handleApiKeySave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('mairfim-gemini-api-key', apiKey.trim());
            alert('Chave de API salva com sucesso!');
        } else {
            // If the input is empty, treat it as a removal.
            handleApiKeyRemove();
        }
    };

    const handleApiKeyRemove = () => {
        localStorage.removeItem('mairfim-gemini-api-key');
        setApiKey('');
        alert('Chave de API personalizada removida. O aplicativo voltará a usar a chave padrão.');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Aparência</h3>
                <div className="space-y-2">
                    <label className="block text-text-secondary text-sm font-bold mb-2">Tema do Aplicativo</label>
                    <div className="flex space-x-4">
                        {(['dark', 'light', 'synthwave'] as ThemeName[]).map(themeName => (
                            <button
                                key={themeName}
                                onClick={() => onThemeChange(themeName)}
                                className={`py-2 px-4 rounded capitalize w-full transition-colors ${
                                    theme === themeName ? 'bg-primary text-white font-bold' : 'bg-surface-dark hover:bg-border'
                                }`}
                            >
                                {themeName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Chave de API da IA</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-text-secondary text-sm font-bold mb-2">
                           Chave de API do Google GenAI
                        </label>
                        <p className="text-xs text-text-secondary mb-2">
                           O aplicativo possui uma chave de API padrão. Se a IA parar de funcionar, você pode colar uma nova chave (obtida no Google AI Studio) aqui para restaurar a funcionalidade.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                id="apiKey"
                                type="password"
                                placeholder="Cole sua nova chave de API aqui"
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                className="flex-1 p-2 rounded bg-background border border-border"
                            />
                            <button onClick={handleApiKeySave} className="py-2 px-4 rounded bg-primary text-white hover:bg-primary-dark">
                                Salvar
                            </button>
                            <button onClick={handleApiKeyRemove} className="py-2 px-4 rounded bg-surface-dark text-text-secondary hover:bg-border">
                                Usar Padrão
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Automação</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="investmentPercentage" className="block text-text-secondary text-sm font-bold mb-2">
                            Porcentagem para Investimento Automático ({investmentPercentage}%)
                        </label>
                        <p className="text-xs text-text-secondary mb-2">
                            Ao receber uma receita, este percentual será automaticamente movido para a categoria "Investimentos".
                        </p>
                        <input
                            id="investmentPercentage"
                            type="range"
                            min="0"
                            max="100"
                            value={investmentPercentage}
                            onChange={e => onInvestmentPercentageChange(Number(e.target.value))}
                            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                     <div>
                        <label htmlFor="creditCardAlertThreshold" className="block text-text-secondary text-sm font-bold mb-2">
                            Alerta de Limite do Cartão de Crédito ({creditCardAlertThreshold}%)
                        </label>
                         <p className="text-xs text-text-secondary mb-2">
                            Receba uma notificação quando o uso do limite do seu cartão de crédito atingir este percentual.
                        </p>
                        <input
                            id="creditCardAlertThreshold"
                            type="range"
                            min="0"
                            max="100"
                            value={creditCardAlertThreshold}
                            onChange={e => onCreditCardAlertThresholdChange(Number(e.target.value))}
                             className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>
            </div>

             <div className="bg-surface p-6 rounded-lg shadow-lg border border-expense/50">
                <h3 className="text-xl font-bold mb-4 text-expense">Zona de Perigo</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold">Limpar Todas as Transações</h4>
                         <p className="text-sm text-text-secondary mt-1 mb-3">
                            Esta ação removerá permanentemente todas as suas transações. Suas contas não serão afetadas. Esta ação não pode ser desfeita.
                        </p>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-expense text-white font-bold py-2 px-4 rounded hover:bg-expense/80 transition-colors flex items-center"
                        >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Limpar Transações
                        </button>
                    </div>
                </div>
            </div>
            
            {isDeleteModalOpen && (
                 <ConfirmationModal
                    onConfirm={handleConfirmDelete}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

const ConfirmationModal: React.FC<{
    onConfirm: () => void;
    onClose: () => void;
}> = ({ onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Confirmar Ação</h3>
                <p className="text-text-secondary mb-6">
                    Tem certeza que deseja excluir <span className="font-bold text-expense">TODAS</span> as suas transações?
                    <br />
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-surface-dark text-text-secondary hover:bg-border">
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} className="py-2 px-4 rounded bg-expense text-white hover:bg-expense/80">
                        Excluir Tudo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;