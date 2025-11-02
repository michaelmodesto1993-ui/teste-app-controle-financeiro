import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Account, TransactionType, TransactionCategory, RecurrenceType, RecurrenceFrequency, AccountType } from '../types.ts';
import { formatCurrency, formatDate, formatDateReadable, formatMonthYear, calculateCreditCardDueDate } from '../utils/helpers.ts';
import { PlusIcon, EditIcon, TrashIcon, IncomeIcon, ExpenseIcon } from './icons.tsx';
import { getBankColor } from '../utils/bankStyles.ts';

interface TransactionsPageProps {
    transactions: Transaction[];
    accounts: Account[];
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, accounts, onAddTransaction, onUpdateTransaction, onDeleteTransaction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const monthlyTransactions = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return transactions.filter(t => {
            const transactionDate = new Date(t.date + 'T00:00:00');
            return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentDate, transactions]);

    const openModal = (transaction: Transaction | null = null) => {
        setCurrentTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTransaction(null);
    };

    const handleSave = (formData: Omit<Transaction, 'id' | 'userId'>) => {
        if (currentTransaction) {
            onUpdateTransaction({ ...formData, id: currentTransaction.id, userId: currentTransaction.userId });
        } else {
            onAddTransaction(formData);
        }
        closeModal();
    };

    const handleTogglePaid = (transaction: Transaction) => {
        if (transaction.type === TransactionType.EXPENSE) {
            onUpdateTransaction({ ...transaction, isPaid: !transaction.isPaid });
        }
    };
    
    const getAccount = (accountId: string) => accounts.find(a => a.id === accountId);
    
    const getCategoryDisplay = (transaction: Transaction) => {
        if (transaction.category === TransactionCategory.OTHER && transaction.customCategory) {
            return transaction.customCategory;
        }
        return transaction.category;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="flex items-center bg-surface p-2 rounded-lg shadow-lg w-full sm:w-64 justify-between">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&lt;</button>
                    <h3 className="font-bold text-lg mx-4 text-center">{formatMonthYear(currentDate)}</h3>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&gt;</button>
                </div>
                <button onClick={() => openModal()} className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors flex items-center w-full sm:w-auto justify-center" disabled={accounts.length === 0}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Transação
                </button>
            </div>
             {accounts.length === 0 && (
                <p className="text-center text-text-secondary bg-surface p-4 rounded-lg">
                    Você precisa <span className="font-bold">cadastrar uma conta</span> antes de adicionar transações.
                </p>
            )}
            <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-lg">
                <ul className="divide-y divide-border">
                    {monthlyTransactions.map(t => {
                        const account = getAccount(t.accountId);
                        const bankColor = account ? getBankColor(account.name) : getBankColor('default');

                        return (
                            <li key={t.id} className={`py-3 flex flex-col md:flex-row justify-between md:items-center gap-3 transition-opacity ${t.isPaid ? 'opacity-50' : ''}`}>
                                 <div className="flex items-center">
                                    <div className={`p-2 rounded-full mr-4 ${t.type === TransactionType.INCOME ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}>
                                        {t.type === TransactionType.INCOME ? <IncomeIcon className="w-5 h-5" /> : <ExpenseIcon className="w-5 h-5" />}
                                    </div>
                                    <div className={`${t.isPaid ? 'line-through' : ''}`}>
                                        <p className="font-semibold">{t.description}</p>
                                        <div className="text-sm text-text-secondary flex items-center flex-wrap">
                                            <div className="flex items-center mr-1">
                                                <span className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: bankColor }}></span>
                                                <span className="truncate">{account ? `${account.name} (${account.type})` : 'N/A'}</span>
                                            </div>
                                            <span>&middot; Venc: {formatDateReadable(t.date)}</span>
                                            <span className="mx-1">&middot;</span>
                                            <span>{getCategoryDisplay(t)}</span>
                                            {t.purchaseDate && <span className="ml-1">(Compra: {formatDateReadable(t.purchaseDate)})</span>}
                                        </div>
                                        {t.recurrenceType === RecurrenceType.RECURRING && (
                                            <p className="text-xs text-primary mt-1">{`Recorrência: ${t.recurrenceFrequency}`}</p>
                                        )}
                                        {t.recurrenceType === RecurrenceType.INSTALLMENT && (
                                            <p className="text-xs text-primary mt-1">{`Parcela: ${t.installmentCurrent} de ${t.installmentTotal}`}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-2 sm:space-x-4 pl-12 md:pl-0">
                                    <span className={`font-bold text-sm sm:text-base ${t.isPaid ? 'line-through' : ''} ${t.type === TransactionType.INCOME ? 'text-income' : 'text-expense'}`}>
                                        {t.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(t.amount, account?.currency)}
                                    </span>
                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                        {t.type === TransactionType.EXPENSE && (
                                            <div className="w-20 text-center">
                                                {!t.isPaid ? (
                                                    <button
                                                        onClick={() => handleTogglePaid(t)}
                                                        className="py-1 px-3 text-sm bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors"
                                                    >
                                                        Pagar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleTogglePaid(t)}
                                                        className="py-1 px-3 text-sm border border-income text-income font-bold rounded hover:bg-income/10 transition-colors"
                                                    >
                                                        Pago
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <button onClick={() => openModal(t)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-expense hover:text-expense/80"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                     {monthlyTransactions.length === 0 && (
                        <p className="text-text-secondary text-center py-4">Nenhuma transação registrada para este mês.</p>
                    )}
                </ul>
            </div>
            {isModalOpen && <TransactionModal transaction={currentTransaction} accounts={accounts} transactions={transactions} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

// Modal Component
const TransactionModal: React.FC<{
    transaction: Transaction | null;
    accounts: Account[];
    transactions: Transaction[];
    onSave: (data: Omit<Transaction, 'id' | 'userId'>) => void;
    onClose: () => void;
}> = ({ transaction, accounts, transactions, onSave, onClose }) => {
    const [accountId, setAccountId] = useState(transaction?.accountId || (accounts.length > 0 ? accounts[0].id : ''));
    const [type, setType] = useState<TransactionType>(transaction?.type || TransactionType.EXPENSE);
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState<string>(transaction ? String(transaction.amount) : '');
    
    // 'date' will be purchaseDate for CC expenses, and the actual date for others
    const [date, setDate] = useState(transaction ? formatDate(transaction.purchaseDate || transaction.date) : formatDate(new Date().toISOString()));
    const [dueDate, setDueDate] = useState<string | null>(transaction?.date ? formatDate(transaction.date) : null);
    
    const [category, setCategory] = useState<TransactionCategory>(transaction?.category || TransactionCategory.OTHER);
    const [customCategory, setCustomCategory] = useState(transaction?.customCategory || '');
    const [isPaid, setIsPaid] = useState<boolean>(transaction?.isPaid ?? true);
    
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(transaction?.recurrenceType || RecurrenceType.SINGLE);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(transaction?.recurrenceFrequency || RecurrenceFrequency.MONTHLY);
    const [installmentCurrent, setInstallmentCurrent] = useState<number>(transaction?.installmentCurrent || 1);
    const [installmentTotal, setInstallmentTotal] = useState<number>(transaction?.installmentTotal || 1);

    const selectedAccount = useMemo(() => accounts.find(a => a.id === accountId), [accountId, accounts]);
    const isCreditCardExpense = selectedAccount?.type === AccountType.CREDIT_CARD && type === TransactionType.EXPENSE;
    const isInstallment = recurrenceType === RecurrenceType.INSTALLMENT;

    const availableCredit = useMemo(() => {
        if (!selectedAccount || selectedAccount.type !== AccountType.CREDIT_CARD || !selectedAccount.limit) {
            return null;
        }
        // Exclude the current transaction being edited from the calculation
        const otherUnpaidExpenses = transactions
            .filter(t => 
                t.accountId === selectedAccount.id && 
                t.type === TransactionType.EXPENSE && 
                !t.isPaid &&
                t.id !== transaction?.id // Exclude self when editing
            )
            .reduce((sum, t) => sum + t.amount, 0);
            
        return selectedAccount.limit - otherUnpaidExpenses;
    }, [selectedAccount, transactions, transaction]);

    useEffect(() => {
        if (isCreditCardExpense && selectedAccount?.closingDay && selectedAccount?.dueDay) {
            const purchase = new Date(date + 'T00:00:00');
            const calculatedDueDate = calculateCreditCardDueDate(purchase, selectedAccount.closingDay, selectedAccount.dueDay);
            setDueDate(formatDate(calculatedDueDate));
        } else {
            setDueDate(null);
        }

        if (category !== TransactionCategory.OTHER) {
            setCustomCategory('');
        }
        if (transaction) {
            if (transaction.recurrenceType === RecurrenceType.INSTALLMENT) {
                setRecurrenceType(RecurrenceType.INSTALLMENT);
            }
        }
    }, [category, transaction, isCreditCardExpense, date, selectedAccount]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount.replace(',', '.')) || 0;
        if(!accountId || !description || numericAmount <= 0 || (category === TransactionCategory.OTHER && !customCategory)) {
            // Basic validation
            return;
        }
        
        const dataToSave: Omit<Transaction, 'id' | 'userId'> = {
            accountId, type, description, amount: numericAmount, 
            date: isCreditCardExpense && !isInstallment ? dueDate! : date,
            category, recurrenceType,
        };

        if (isCreditCardExpense) {
            dataToSave.purchaseDate = date;
            dataToSave.isPaid = false; // Credit card expenses are paid when the invoice is paid
        } else if (type === TransactionType.EXPENSE) {
            dataToSave.isPaid = isPaid;
        }

        if (category === TransactionCategory.OTHER) {
            dataToSave.customCategory = customCategory;
        }

        if (recurrenceType === RecurrenceType.RECURRING) {
            dataToSave.recurrenceFrequency = recurrenceFrequency;
        } else if (recurrenceType === RecurrenceType.INSTALLMENT) {
            dataToSave.installmentCurrent = installmentCurrent;
            dataToSave.installmentTotal = installmentTotal;
            // For installments, `date` from form is always purchase date. `App.tsx` handles due date calculation.
            dataToSave.date = date;
        }

        onSave(dataToSave);
    };

    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md my-8">
                <h3 className="text-lg font-bold mb-4">{transaction ? 'Editar Transação' : 'Adicionar Transação'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="accountId">Conta</label>
                        <select id="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required>
                           {accounts.map(acc => <option key={acc.id} value={acc.id}>{`${acc.name} (${acc.type})`}</option>)}
                        </select>
                    </div>
                    {isCreditCardExpense && availableCredit !== null && (
                        <div className="mb-4 bg-surface-dark p-3 rounded-lg text-sm">
                            <span className="text-text-secondary">Limite disponível: </span>
                            <span className={`font-semibold ${availableCredit > parseFloat(amount.replace(',', '.')) ? 'text-income' : 'text-expense'}`}>{formatCurrency(availableCredit)}</span>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2">Tipo</label>
                         <div className="flex">
                            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-1/2 py-2 px-4 rounded-l ${type === TransactionType.EXPENSE ? 'bg-primary text-white' : 'bg-surface-dark'}`}>Despesa</button>
                            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-1/2 py-2 px-4 rounded-r ${type === TransactionType.INCOME ? 'bg-primary text-white' : 'bg-surface-dark'}`}>Receita</button>
                         </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="description">Descrição</label>
                        <input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} className="p-2 w-full rounded bg-background border border-border" placeholder="Ex: Salário, Aluguel" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="recurrenceType">Tipo de Lançamento</label>
                        <select 
                            id="recurrenceType" 
                            value={recurrenceType} 
                            onChange={e => setRecurrenceType(e.target.value as RecurrenceType)} 
                            className="p-2 w-full rounded bg-background border border-border"
                            disabled={!!(transaction && transaction.recurrenceType === RecurrenceType.INSTALLMENT)}
                        >
                            {Object.values(RecurrenceType).map(rt => <option key={rt} value={rt}>{rt}</option>)}
                        </select>
                    </div>

                    {recurrenceType === RecurrenceType.RECURRING && (
                        <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="recurrenceFrequency">Frequência</label>
                            <select id="recurrenceFrequency" value={recurrenceFrequency} onChange={e => setRecurrenceFrequency(e.target.value as RecurrenceFrequency)} className="p-2 w-full rounded bg-background border border-border">
                                {Object.values(RecurrenceFrequency).map(rf => <option key={rf} value={rf}>{rf}</option>)}
                            </select>
                        </div>
                    )}

                    {isInstallment && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="installmentTotal">Total de Parcelas</label>
                                <input id="installmentTotal" type="number" min="1" value={installmentTotal} onChange={e => setInstallmentTotal(parseInt(e.target.value) || 1)} className="p-2 w-full rounded bg-background border border-border" disabled={!!transaction} />
                            </div>
                        </div>
                    )}

                     <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="amount">
                                {isInstallment ? 'Valor Total da Compra' : 'Valor'}
                           </label>
                           <input id="amount" type="number" step="0.01" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required />
                        </div>
                        <div>
                             <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="date">
                                {isCreditCardExpense ? 'Data da Compra' : 'Data'}
                             </label>
                             <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required />
                        </div>
                    </div>

                    {isCreditCardExpense && !isInstallment && dueDate && (
                        <div className="mb-4 bg-surface-dark p-3 rounded-lg">
                            <p className="text-sm text-text-secondary font-bold">Vencimento da Fatura</p>
                            <p className="font-semibold text-primary">{formatDateReadable(dueDate)}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="category">Categoria</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as TransactionCategory)} className="p-2 w-full rounded bg-background border border-border" required>
                           {Object.values(TransactionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                     {category === TransactionCategory.OTHER && (
                        <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="customCategory">Nome da Categoria Personalizada</label>
                            <input id="customCategory" type="text" value={customCategory} onChange={e => setCustomCategory(e.target.value)} className="p-2 w-full rounded bg-background border border-border" placeholder="Ex: Presente, Eletrónicos" required />
                        </div>
                    )}

                    {type === TransactionType.EXPENSE && !isCreditCardExpense && (
                        <div className="mb-4">
                             <label className="flex items-center">
                                <input type="checkbox" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="ml-2 text-sm text-text-secondary">Despesa Paga</span>
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-surface-dark text-text-secondary hover:bg-border">Cancelar</button>
                        <button type="submit" className="py-2 px-4 rounded bg-primary text-white hover:bg-primary-dark">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionsPage;