import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import DashboardSummary from './DashboardSummary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import AccountsSummary from './AccountsSummary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import CategoryChart from './CategoryChart.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Transactions from './Transactions.tsx';
// Fix: Add file extension to import to ensure module resolution.
import ExpensesByAccount from './ExpensesByAccount.tsx';
// Fix: Add file extension to import to ensure module resolution.
import ErrorBoundary from './ErrorBoundary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import IncomeChart from './IncomeChart.tsx';

interface DashboardViewProps {
    accounts: Account[];
    transactions: Transaction[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ accounts, transactions }) => {
    return (
        <div className="space-y-6">
            <DashboardSummary accounts={accounts} transactions={transactions} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Transactions accounts={accounts} transactions={transactions} limit={5} />
                </div>
                <div>
                    <AccountsSummary accounts={accounts} transactions={transactions} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ErrorBoundary>
                    <IncomeChart transactions={transactions} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <CategoryChart transactions={transactions} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <ExpensesByAccount accounts={accounts} transactions={transactions} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default DashboardView;