import React, { useState } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, AccountType, Transaction, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';
// Fix: Add file extension to import to ensure module resolution.
import { PlusIcon, EditIcon, TrashIcon } from './icons.tsx';
// DEFINITIVE FIX: Corrected the import path to go up one directory level.
import { bankList } from '../utils/banks.ts';
import { getBankColor } from '../utils/bankStyles.ts';

interface AccountsPageProps {
    accounts: Account[];
    transactions: Transaction[];
    onAddAccount: (account: Omit<Account, 'id' | 'userId'>) => void;
    onUpdateAccount: (account: Account) => void;
    onDeleteAccount: (accountId: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, transactions, onAddAccount, onUpdateAccount, onDeleteAccount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

    const calculateAvailableCredit = (account: Account) => {
        if (account.type !== AccountType.CREDIT_CARD || !account.limit) {
            return { used: 0, available: 0 };
        }
        const unpaidExpenses = transactions
            .filter(t => t.accountId === account.id && t.type === TransactionType.EXPENSE && !t.isPaid)
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            used: unpaidExpenses,
            available: account.limit - unpaidExpenses
        };
    };
    
    const getProgressColor = (percentage: number): string => {
        if (percentage >= 100) return 'bg-expense';
        if (percentage >= 80) return 'bg-expense';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-income';
    };

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

    const openDeleteModal = (account: Account) => {
        setAccountToDelete(account);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAccountToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (accountToDelete) {
            onDeleteAccount(accountToDelete.id);
        }
        closeDeleteModal();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <button onClick={() => openModal()} className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Conta
                </button>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <ul className="divide-y divide-border">
                    {accounts.map(acc => {
                        const bankColor = getBankColor(acc.name);
                        const isCheckingType = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.INVESTMENT].includes(acc.type);

                        return (
                            <li key={acc.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                {isCheckingType ? (
                                    <div className="flex-1 flex items-center">
                                         <span className="w-3 h-3 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: bankColor }}></span>
                                        <div>
                                            <p className="font-semibold">{acc.name} <span className="text-sm text-text-secondary">({acc.type})</span></p>
                                            <p className="text-sm text-text-secondary">
                                                Saldo Inicial: {formatCurrency(acc.initialBalance, acc.currency)}
                                            </p>
                                        </div>
                                    </div>
                                ) : ( // Credit Card
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                             <div className="flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-4 flex-shrink-0" style={{ backgroundColor: bankColor }}></span>
                                                <div>
                                                    <p className="font-semibold">{acc.name} <span className="text-sm text-text-secondary">({acc.type})</span></p>
                                                    <p className="text-sm text-text-secondary">
                                                        Fatura: <span className="font-medium text-expense">{formatCurrency(calculateAvailableCredit(acc).used, acc.currency)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-text-secondary">Limite</p>
                                                <p className="font-semibold">{formatCurrency(acc.limit || 0, acc.currency)}</p>
                                            </div>
                                        </div>
                                        
                                        {(() => {
                                            const { used, available } = calculateAvailableCredit(acc);
                                            const limit = acc.limit || 0;
                                            const usedPercentage = limit > 0 ? (used / limit) * 100 : 0;
                                            const progressColorClass = getProgressColor(usedPercentage);

                                            return (
                                                <>
                                                    <div className="w-full bg-background rounded-full h-2.5 mb-1">
                                                        <div
                                                            className={`${progressColorClass} h-2.5 rounded-full transition-all duration-300`}
                                                            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-text-secondary">
                                                        <span>{usedPercentage.toFixed(1)}% usado</span>
                                                        {available < 0 ? (
                                                            <span className="text-expense font-bold">
                                                                Limite ultrapassado em {formatCurrency(Math.abs(available), acc.currency)}
                                                            </span>
                                                        ) : (
                                                            <span>Disponível: <span className="text-income font-medium">{formatCurrency(available, acc.currency)}</span></span>
                                                        )}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                                <div className="flex items-center space-x-2 self-end sm:self-center">
                                    <button onClick={() => openModal(acc)} className="p-2 text-text-secondary hover:text-white"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => openDeleteModal(acc)} className="p-2 text-expense hover:text-expense/80"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </li>
                        )
                    })}
                     {accounts.length === 0 && (
                        <p className="text-text-secondary text-center py-4">Nenhuma conta cadastrada.</p>
                    )}
                </ul>
            </div>
            {isModalOpen && <AccountModal account={currentAccount} onSave={handleSave} onClose={closeModal} />}
            {isDeleteModalOpen && accountToDelete && (
                <ConfirmationModal
                    accountName={accountToDelete.name}
                    onConfirm={handleConfirmDelete}
                    onClose={closeDeleteModal}
                />
            )}
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
    const [type, setType] = useState<AccountType>(account?.type || AccountType.CHECKING);
    const [initialBalance, setInitialBalance] = useState(account?.initialBalance || 0);
    const [currency, setCurrency] = useState(account?.currency || 'BRL');
    const [closingDay, setClosingDay] = useState(account?.closingDay || 1);
    const [dueDay, setDueDay] = useState(account?.dueDay || 1);
    const [limit, setLimit] = useState(account?.limit || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const accountNameToSave = name === 'Outro' ? customName : name;
        if (!accountNameToSave) {
             // Simple validation to prevent saving an empty custom name
            return;
        }

        const dataToSave: Omit<Account, 'id' | 'userId'> = {
            name: accountNameToSave,
            type,
            initialBalance: type === AccountType.CREDIT_CARD ? 0 : initialBalance,
            currency,
        };

        if (type === AccountType.CREDIT_CARD) {
            dataToSave.closingDay = closingDay;
            dataToSave.dueDay = dueDay;
            dataToSave.limit = limit;
        }

        onSave(dataToSave);
    };

    const showBalanceField = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.INVESTMENT].includes(type);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md overflow-y-auto max-h-full">
                <h3 className="text-lg font-bold mb-4">{account ? 'Editar Conta' : 'Adicionar Conta'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="accountType">Tipo da Conta</label>
                        <select id="accountType" value={type} onChange={e => setType(e.target.value as AccountType)} className="p-2 w-full rounded bg-background border border-border" required>
                            {Object.values(AccountType).map(accType => <option key={accType} value={accType}>{accType}</option>)}
                        </select>
                    </div>

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
                    
                    {type === AccountType.CREDIT_CARD && (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="closingDay">Dia Fechamento</label>
                                    <input id="closingDay" type="number" min="1" max="31" value={closingDay} onChange={e => setClosingDay(parseInt(e.target.value) || 1)} className="p-2 w-full rounded bg-background border border-border" required />
                                </div>
                                <div>
                                    <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="dueDay">Dia Vencimento</label>
                                    <input id="dueDay" type="number" min="1" max="31" value={dueDay} onChange={e => setDueDay(parseInt(e.target.value) || 1)} className="p-2 w-full rounded bg-background border border-border" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                 <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="limit">Limite do Cartão</label>
                                 <input id="limit" type="number" step="0.01" value={limit} onChange={e => setLimit(parseFloat(e.target.value) || 0)} className="p-2 w-full rounded bg-background border border-border" required />
                            </div>
                        </>
                    )}

                    {showBalanceField && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="initialBalance">Saldo Inicial</label>
                                <input id="initialBalance" type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(parseFloat(e.target.value) || 0)} className="p-2 w-full rounded bg-background border border-border" required />
                            </div>
                            <div>
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="currency">Moeda</label>
                                <select id="currency" value={currency} onChange={e => setCurrency(e.target.value as 'BRL' | 'USD' | 'EUR')} className="p-2 w-full rounded bg-background border border-border" required>
                                    <option value="BRL">BRL</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>
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

const ConfirmationModal: React.FC<{
    accountName: string;
    onConfirm: () => void;
    onClose: () => void;
}> = ({ accountName, onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
                <p className="text-text-secondary mb-6">
                    Tem certeza que deseja excluir a conta <span className="font-bold text-text-primary">"{accountName}"</span>?
                    <br />
                    <span className="font-bold text-expense">Todas as transações associadas também serão excluídas permanentemente.</span> Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-surface-dark text-text-secondary hover:bg-border">
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} className="py-2 px-4 rounded bg-expense text-white hover:bg-expense/80">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;