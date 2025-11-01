import React, { useState } from 'react';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import DashboardView from './DashboardView.tsx';
import AccountsPage from './AccountsPage.tsx';
import TransactionsPage from './TransactionsPage.tsx';
import SettingsPage from './SettingsPage.tsx';
import { User, Account, Transaction } from '../types.ts';

type Page = 'dashboard' | 'accounts' | 'transactions' | 'settings';

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
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const [activePage, setActivePage] = useState<Page>('dashboard');

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
            case 'accounts':
                return <AccountsPage accounts={props.accounts} onAddAccount={props.onAddAccount} onUpdateAccount={props.onUpdateAccount} onDeleteAccount={props.onDeleteAccount} />;
            case 'transactions':
                return <TransactionsPage transactions={props.transactions} accounts={props.accounts} onAddTransaction={props.onAddTransaction} onUpdateTransaction={props.onUpdateTransaction} onDeleteTransaction={props.onDeleteTransaction} />;
            case 'settings':
                return <SettingsPage />;
            default:
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
        }
    };

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={props.onLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={props.user} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
