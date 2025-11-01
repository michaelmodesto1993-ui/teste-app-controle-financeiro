import React, { useState } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';
// Fix: Add file extension to import to ensure module resolution.
import { PlusIcon, EditIcon, TrashIcon } from './icons.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { bankList } from '../utils/banks.ts';

interface AccountsPageProps {
    accounts: Account[];
    onAddAccount: (account: Omit<Account, 'id' | 'userId'>) => void;
    onUpdateAccount: (account: Account) => void;
    onDeleteAccount: (accountId: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAddAccount, onUpdateAccount, onDeleteAccount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

    const openModal = (account: Account | null = null) => {
        setCurrentAccount(account);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAccount(null);
    };

    const handleSave = (formData: Omit<Account, 'id' | 'userId'>) => {
        if (currentAccount) {
            onUpdateAccount({ ...formData, id: currentAccount.id, userId: currentAccount.userId });
        } else {
            onAddAccount(formData);
        }
        closeModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gerenciar Contas</h2>
                <button onClick={() => openModal()} className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Conta
                </button>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <ul className="divide-y divide-border">
                    {accounts.map(acc => (
                        <li key={acc.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{acc.name}</p>
                                <p className="text-sm text-text-secondary">Saldo Inicial: {formatCurrency(acc.initialBalance, acc.currency)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => openModal(acc)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="w-5 h-5" /></button>
                                <button onClick={() => onDeleteAccount(acc.id)} className="p-2 text-expense hover:text-expense/80"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </li>
                    ))}
                     {accounts.length === 0 && (
                        <p className="text-text-secondary text-center py-4">Nenhuma conta cadastrada.</p>
                    )}
                </ul>
            </div>
            {isModalOpen && <AccountModal account={currentAccount} onSave={handleSave} onClose={closeModal} />}
        </div>
    );
};

const AccountModal: React.FC<{
    account: Account | null;
    onSave: (data: Omit<Account, 'id' | 'userId'>) => void;
    onClose: () => void;
}> = ({ account, onSave, onClose }) => {
    // Determine the initial state for the dropdown and custom name field
    const isStandardBank = account && bankList.includes(account.name);
    const initialName = isStandardBank ? account.name : (account ? 'Outro' : bankList[0]);
    const initialCustomName = account && !isStandardBank ? account.name : '';

    const [name, setName] = useState(initialName);
    const [customName, setCustomName] = useState(initialCustomName);
    const [initialBalance, setInitialBalance] = useState(account?.initialBalance || 0);
    const [currency, setCurrency] = useState(account?.currency || 'BRL');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const accountNameToSave = name === 'Outro' ? customName : name;
        if (!accountNameToSave) {
             // Simple validation to prevent saving an empty custom name
            return;
        }
        onSave({ name: accountNameToSave, initialBalance, currency });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">{account ? 'Editar Conta' : 'Adicionar Conta'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="accountName">Nome da Conta</label>
                        <select id="accountName" value={name} onChange={e => setName(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required>
                            {bankList.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                    </div>
                    {name === 'Outro' && (
                         <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="customAccountName">Nome Personalizado</label>
                            <input id="customAccountName" type="text" value={customName} onChange={e => setCustomName(e.target.value)} className="p-2 w-full rounded bg-background border border-border" placeholder="Ex: Carteira, Banco XPTO" required />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="initialBalance">Saldo Inicial</label>
                            <input id="initialBalance" type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(parseFloat(e.target.value) || 0)} className="p-2 w-full rounded bg-background border border-border" required />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="currency">Moeda</label>
                            <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="p-2 w-full rounded bg-background border border-border" required>
                                <option value="BRL">BRL</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
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

export default AccountsPage;