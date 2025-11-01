import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Transaction, Account, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency, formatDateReadable } from '../utils/helpers.ts';
// Fix: Add file extension to import to ensure module resolution.
import { IncomeIcon, ExpenseIcon } from './icons.tsx';

interface TransactionsProps {
    transactions: Transaction[];
    accounts: Account[];
    limit?: number;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, accounts, limit = 5 }) => {
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

    const getAccountDisplay = (accountId: string) => {
        const account = accounts.find(a => a.id === accountId);
        return account ? `${account.name} (${account.type})` : 'N/A';
    };
    const getAccountCurrency = (accountId: string) => accounts.find(a => a.id === accountId)?.currency;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg">
            <h3 className="font-bold mb-4">Últimas Transações</h3>
            {recentTransactions.length > 0 ? (
                <ul className="divide-y divide-border">
                    {recentTransactions.map(t => (
                        <li key={t.id} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full mr-4 ${t.type === TransactionType.INCOME ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}>
                                    {t.type === TransactionType.INCOME ? <IncomeIcon className="w-5 h-5" /> : <ExpenseIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-text-secondary">{getAccountDisplay(t.accountId)} &middot; {formatDateReadable(t.date)}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-income' : 'text-expense'}`}>
                                {t.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(t.amount, getAccountCurrency(t.accountId))}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-secondary">Nenhuma transação registrada ainda.</p>
            )}
        </div>
    );
};

export default Transactions;