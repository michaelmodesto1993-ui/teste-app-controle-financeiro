import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';

interface AccountsSummaryProps {
    accounts: Account[];
    transactions: Transaction[];
}

const AccountsSummary: React.FC<AccountsSummaryProps> = ({ accounts, transactions }) => {
    const calculateBalance = (accountId: string, initialBalance: number) => {
        const accountTransactions = transactions.filter(t => t.accountId === accountId);
        const income = accountTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = accountTransactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return initialBalance + income - expense;
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg h-full">
            <h3 className="font-bold mb-4">Saldo das Contas</h3>
            {accounts.length > 0 ? (
                <ul className="space-y-4">
                    {accounts.map(account => {
                        const balance = calculateBalance(account.id, account.initialBalance);
                        return (
                            <li key={account.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{account.name}</p>
                                    <p className="text-sm text-text-secondary">Saldo Atual</p>
                                </div>
                                <span className={`font-bold text-lg ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                                    {formatCurrency(balance, account.currency)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-text-secondary">Nenhuma conta cadastrada.</p>
            )}
        </div>
    );
};

export default AccountsSummary;
