import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';

interface DashboardSummaryProps {
    accounts: Account[];
    transactions: Transaction[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ accounts, transactions }) => {
    const totalInitialBalance = accounts.reduce((sum, acc) => sum + acc.initialBalance, 0);

    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalInitialBalance + totalIncome - totalExpense;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = monthlyTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netMonthly = monthlyIncome - monthlyExpense;
    
    // Assuming BRL for summary, as multi-currency logic is not defined.
    // A more robust solution would handle currency conversion.

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h4 className="text-sm text-text-secondary font-medium">Saldo Total</h4>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h4 className="text-sm text-text-secondary font-medium">Receitas (Mês)</h4>
                <p className="text-2xl font-bold mt-1 text-income">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h4 className="text-sm text-text-secondary font-medium">Despesas (Mês)</h4>
                <p className="text-2xl font-bold mt-1 text-expense">{formatCurrency(monthlyExpense)}</p>
            </div>
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h4 className="text-sm text-text-secondary font-medium">Balanço (Mês)</h4>
                <p className={`text-2xl font-bold mt-1 ${netMonthly >= 0 ? 'text-income' : 'text-expense'}`}>{formatCurrency(netMonthly)}</p>
            </div>
        </div>
    );
};

export default DashboardSummary;
