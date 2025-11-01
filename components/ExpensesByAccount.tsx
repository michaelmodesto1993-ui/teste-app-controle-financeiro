import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';

interface ExpensesByAccountProps {
    accounts: Account[];
    transactions: Transaction[];
}

const ExpensesByAccount: React.FC<ExpensesByAccountProps> = ({ accounts, transactions }) => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);

    const expensesByAccount = accounts.map(account => {
        const accountExpenses = expenses
            .filter(t => t.accountId === account.id)
            .reduce((sum, t) => sum + t.amount, 0);
        return { name: account.name, amount: accountExpenses };
    }).filter(a => a.amount > 0);
    
    const totalExpenses = expensesByAccount.reduce((sum, a) => sum + a.amount, 0);
    const colors = ['#f43f5e', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'];

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg h-full min-h-[384px]">
            <h3 className="font-bold mb-4">Despesas por Conta</h3>
            {expensesByAccount.length > 0 ? (
                <div className="space-y-4">
                    {expensesByAccount.map(({ name, amount }, index) => {
                        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                        return (
                            <div key={name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-text-secondary">{name}</span>
                                    <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full"
                                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                    <p>Nenhuma despesa registrada.</p>
                </div>
            )}
        </div>
    );
};

export default ExpensesByAccount;
