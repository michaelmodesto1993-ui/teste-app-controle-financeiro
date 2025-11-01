import React, { useState } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Transaction, Account, TransactionType, TransactionCategory } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency, formatDate, formatDateReadable } from '../utils/helpers.ts';
// Fix: Add file extension to import to ensure module resolution.
import { PlusIcon, EditIcon, TrashIcon, IncomeIcon, ExpenseIcon } from './icons.tsx';

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

    const openModal = (transaction: Transaction | null = null) => {
        setCurrentTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTransaction(null);
    };

    const handleSave = (formData: Omit<Transaction, 'id'|'userId'>) => {
        if (currentTransaction) {
            onUpdateTransaction({ ...formData, id: currentTransaction.id, userId: currentTransaction.userId });
        } else {
            onAddTransaction(formData);
        }
        closeModal();
    };

    const getAccountName = (accountId: string) => accounts.find(a => a.id === accountId)?.name || 'N/A';
    const getAccountCurrency = (accountId: string) => accounts.find(a => a.id === accountId)?.currency;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Todas as Transações</h2>
                <button onClick={() => openModal()} className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Transação
                </button>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <ul className="divide-y divide-border">
                    {transactions.map(t => (
                        <li key={t.id} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full mr-4 ${t.type === TransactionType.INCOME ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}>
                                    {t.type === TransactionType.INCOME ? <IncomeIcon className="w-5 h-5" /> : <ExpenseIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-text-secondary">{getAccountName(t.accountId)} &middot; {t.category} &middot; {formatDateReadable(t.date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-income' : 'text-expense'}`}>
                                    {t.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(t.amount, getAccountCurrency(t.accountId))}
                                </span>
                                <button onClick={() => openModal(t)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="w-5 h-5" /></button>
                                <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-expense hover:text-expense/80"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && <TransactionModal transaction={currentTransaction} accounts={accounts} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

const TransactionModal: React.FC<{
    transaction: Transaction | null;
    accounts: Account[];
    onSave: (data: Omit<Transaction, 'id' | 'userId'>) => void;
    onClose: () => void;
}> = ({ transaction, accounts, onSave, onClose }) => {
    const [type, setType] = useState(transaction?.type || TransactionType.EXPENSE);
    const [description, setDescription] = useState(transaction?.description || '');
    const [amount, setAmount] = useState(transaction?.amount || 0);
    const [date, setDate] = useState(transaction ? formatDate(transaction.date) : formatDate(new Date().toISOString()));
    const [accountId, setAccountId] = useState(transaction?.accountId || (accounts.length > 0 ? accounts[0].id : ''));
    const [category, setCategory] = useState(transaction?.category || TransactionCategory.OTHER);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ type, description, amount, date: new Date(date).toISOString(), accountId, category });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">{transaction ? 'Editar Transação' : 'Adicionar Transação'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-sm font-bold mb-2">Tipo</label>
                            <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="p-2 w-full rounded bg-background border border-border">
                                <option value={TransactionType.EXPENSE}>Despesa</option>
                                <option value={TransactionType.INCOME}>Receita</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-text-secondary text-sm font-bold mb-2">Valor</label>
                            <input id="amount" type="number" step="0.01" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="p-2 w-full rounded bg-background border border-border" required />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="description" className="block text-text-secondary text-sm font-bold mb-2">Descrição</label>
                        <input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label htmlFor="date" className="block text-text-secondary text-sm font-bold mb-2">Data</label>
                            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required />
                        </div>
                        <div>
                            <label htmlFor="accountId" className="block text-text-secondary text-sm font-bold mb-2">Conta</label>
                            <select id="accountId" value={accountId} onChange={e => setAccountId(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required>
                                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-text-secondary text-sm font-bold mb-2">Categoria</label>
                             <select id="category" value={category} onChange={e => setCategory(e.target.value as TransactionCategory)} className="p-2 w-full rounded bg-background border border-border" required>
                                {Object.values(TransactionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
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
