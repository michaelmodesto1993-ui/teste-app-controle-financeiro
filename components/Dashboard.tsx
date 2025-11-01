import React, { useState } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { User, Account, Transaction, ThemeName, View } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import Sidebar from './Sidebar.tsx';
// Fix: Add file extension to import to ensure module resolution.
import DashboardView from './DashboardView.tsx';
// Fix: Add file extension to import to ensure module resolution.
import AccountsPage from './AccountsPage.tsx';
// Fix: Add file extension to import to ensure module resolution.
import TransactionsPage from './TransactionsPage.tsx';
// Fix: Add file extension to import to ensure module resolution.
import SettingsPage from './SettingsPage.tsx';

interface DashboardProps {
    user: User;
    accounts: Account[];
    transactions: Transaction[];
    onLogout: () => void;
    onAddAccount: (account: Omit<Account, 'id' | 'userId'>) => void;
    onUpdateAccount: (account: Account) => void;
    onDeleteAccount: (accountId: string) => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
    investmentPercentage: number;
    onInvestmentPercentageChange: (percentage: number) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const [currentView, setCurrentView] = useState<View>('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
            case 'accounts':
                return <AccountsPage 
                            accounts={props.accounts} 
                            onAddAccount={props.onAddAccount}
                            onUpdateAccount={props.onUpdateAccount}
                            onDeleteAccount={props.onDeleteAccount}
                        />;
            case 'transactions':
                return <TransactionsPage 
                            transactions={props.transactions}
                            accounts={props.accounts}
                            onAddTransaction={props.onAddTransaction}
                            onUpdateTransaction={props.onUpdateTransaction}
                            onDeleteTransaction={props.onDeleteTransaction}
                        />;
            case 'settings':
                return <SettingsPage 
                            theme={props.theme}
                            onThemeChange={props.onThemeChange}
                            investmentPercentage={props.investmentPercentage}
                            onInvestmentPercentageChange={props.onInvestmentPercentageChange}
                        />;
            default:
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar currentView={currentView} onNavigate={setCurrentView} onLogout={props.onLogout} />
            <main className="flex-1 p-6 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;
