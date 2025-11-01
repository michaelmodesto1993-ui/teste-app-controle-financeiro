import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { User, Account, Transaction, View } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import Sidebar from './Sidebar.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Header from './Header.tsx';
// Fix: Add file extension to import to ensure module resolution.
import DashboardView from './DashboardView.tsx';
// Fix: Add file extension to import to ensure module resolution.
import AccountsPage from './AccountsPage.tsx';
// Fix: Add file extension to import to ensure module resolution.
import TransactionsPage from './TransactionsPage.tsx';
// Fix: Add file extension to import to ensure module resolution.
import SettingsPage from './SettingsPage.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { ThemeName } from '../utils/themes.ts';

interface DashboardProps {
    user: User;
    accounts: Account[];
    transactions: Transaction[];
    view: View;
    theme: ThemeName;
    onNavigate: (view: View) => void;
    onLogout: () => void;
    onAddAccount: (account: Omit<Account, 'id' | 'userId'>) => void;
    onUpdateAccount: (account: Account) => void;
    onDeleteAccount: (accountId: string) => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
    onThemeChange: (themeName: ThemeName) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const {
        user,
        accounts,
        transactions,
        view,
        theme,
        onNavigate,
        onLogout,
        onAddAccount,
        onUpdateAccount,
        onDeleteAccount,
        onAddTransaction,
        onUpdateTransaction,
        onDeleteTransaction,
        onThemeChange,
    } = props;

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardView accounts={accounts} transactions={transactions} />;
            case 'accounts':
                return <AccountsPage accounts={accounts} onAddAccount={onAddAccount} onUpdateAccount={onUpdateAccount} onDeleteAccount={onDeleteAccount} />;
            case 'transactions':
                return <TransactionsPage transactions={transactions} accounts={accounts} onAddTransaction={onAddTransaction} onUpdateTransaction={onUpdateTransaction} onDeleteTransaction={onDeleteTransaction} />;
            case 'settings':
                return <SettingsPage currentTheme={theme} onThemeChange={onThemeChange} />;
            default:
                return <DashboardView accounts={accounts} transactions={transactions} />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar currentView={view} onNavigate={onNavigate} onLogout={onLogout} />
            <div className="flex-1 flex flex-col">
                <Header user={user} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
