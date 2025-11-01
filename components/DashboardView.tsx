import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import AccountsSummary from './AccountsSummary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import CategoryChart from './CategoryChart.tsx';
// Fix: Add file extension to import to ensure module resolution.
import DashboardSummary from './DashboardSummary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import ErrorBoundary from './ErrorBoundary.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Transactions from './Transactions.tsx';

interface DashboardViewProps {
    accounts: Account[];
    transactions: Transaction[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ accounts, transactions }) => {
    return (
        <div className="space-y-6">
            <DashboardSummary transactions={transactions} accounts={accounts} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountsSummary accounts={accounts} transactions={transactions} />
                <ErrorBoundary>
                    <CategoryChart transactions={transactions} />
                </ErrorBoundary>
            </div>
            <Transactions transactions={transactions} accounts={accounts} limit={5} />
        </div>
    );
};

export default DashboardView;
