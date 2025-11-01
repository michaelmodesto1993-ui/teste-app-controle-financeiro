import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, TransactionType, AccountType } from '../types.ts';
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

    const calculateCreditCardInfo = (accountId: string, limit: number) => {
        const unpaidExpenses = transactions
            .filter(t => t.accountId === accountId && t.type === TransactionType.EXPENSE && !t.isPaid)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            invoice: unpaidExpenses,
            available: limit - unpaidExpenses,
        };
    };
    
    const getProgressColor = (percentage: number): string => {
        if (percentage >= 100) return 'bg-expense';
        if (percentage >= 80) return 'bg-expense';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-income';
    };


    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg h-full">
            <h3 className="font-bold mb-4">Saldo das Contas</h3>
            {accounts.length > 0 ? (
                <ul className="space-y-4">
                    {accounts.map(account => {
                        if (account.type === AccountType.CHECKING) {
                            const balance = calculateBalance(account.id, account.initialBalance);
                            return (
                                <li key={account.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{account.name}</p>
                                        <p className="text-sm text-text-secondary">{account.type}</p>
                                    </div>
                                    <span className={`font-bold text-lg ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                                        {formatCurrency(balance, account.currency)}
                                    </span>
                                </li>
                            );
                        } else { // It's a Credit Card
                            const { invoice, available } = calculateCreditCardInfo(account.id, account.limit || 0);
                            const limit = account.limit || 0;
                            const usedPercentage = limit > 0 ? (invoice / limit) * 100 : 0;
                            const progressColorClass = getProgressColor(usedPercentage);

                            return (
                                <li key={account.id}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-semibold">{account.name}</p>
                                            <p className="text-sm text-text-secondary">{account.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-expense">{formatCurrency(invoice, account.currency)}</p>
                                            <p className="text-xs text-text-secondary">Fatura atual</p>
                                        </div>
                                    </div>
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
                                                Limite ultrapassado em {formatCurrency(Math.abs(available), account.currency)}
                                            </span>
                                        ) : (
                                            <span>Disponível: <span className="text-income font-medium">{formatCurrency(available, account.currency)}</span></span>
                                        )}
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ul>
            ) : (
                <p className="text-text-secondary">Nenhuma conta cadastrada.</p>
            )}
        </div>
    );
};

export default AccountsSummary;