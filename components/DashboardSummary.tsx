import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, TransactionType } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';

interface DashboardSummaryProps {
    transactions: Transaction[];
    accounts: Account[];
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ transactions, accounts }) => {
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalInitialBalance = accounts.reduce((sum, acc) => sum + acc.initialBalance, 0);
    const netBalance = totalInitialBalance + totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard title="Saldo Total" amount={netBalance} color={netBalance >= 0 ? 'text-income' : 'text-expense'} />
            <SummaryCard title="Total de Receitas" amount={totalIncome} color="text-income" />
            <SummaryCard title="Total de Despesas" amount={totalExpense} color="text-expense" />
        </div>
    );
};

interface SummaryCardProps {
    title: string;
    amount: number;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, color }) => (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h4 className="text-sm text-text-secondary font-medium">{title}</h4>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{formatCurrency(amount)}</p>
    </div>
);

export default DashboardSummary;
