import React, { useState } from 'react';
import { Account, Transaction, ThemeName } from '../types.ts';

import Sidebar from './Sidebar.tsx';
import DashboardView from './DashboardView.tsx';
import AccountsPage from './AccountsPage.tsx';
import TransactionsPage from './TransactionsPage.tsx';
import SettingsPage from './SettingsPage.tsx';
import Header from './Header.tsx';
import Notifications from './Notifications.tsx';
import ReportsPage from './ReportsPage.tsx';

type View = 'dashboard' | 'accounts' | 'transactions' | 'settings' | 'reports';

const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard Geral',
    accounts: 'Minhas Contas',
    transactions: 'Minhas Transações',
    settings: 'Configurações',
    reports: 'Relatórios'
};

interface DashboardProps {
    accounts: Account[];
    transactions: Transaction[];
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
    creditCardAlertThreshold: number;
    onCreditCardAlertThresholdChange: (percentage: number) => void;
    onClearAllTransactions: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleViewChange = (view: View) => {
        setCurrentView(view);
        setSidebarOpen(false); // Close sidebar on mobile after navigation
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
            case 'accounts':
                return <AccountsPage accounts={props.accounts} transactions={props.transactions} onAddAccount={props.onAddAccount} onUpdateAccount={props.onUpdateAccount} onDeleteAccount={props.onDeleteAccount} />;
            case 'transactions':
                return <TransactionsPage transactions={props.transactions} accounts={props.accounts} onAddTransaction={props.onAddTransaction} onUpdateTransaction={props.onUpdateTransaction} onDeleteTransaction={props.onDeleteTransaction} />;
            case 'settings':
                return <SettingsPage theme={props.theme} onThemeChange={props.onThemeChange} investmentPercentage={props.investmentPercentage} onInvestmentPercentageChange={props.onInvestmentPercentageChange} creditCardAlertThreshold={props.creditCardAlertThreshold} onCreditCardAlertThresholdChange={props.onCreditCardAlertThresholdChange} onClearAllTransactions={props.onClearAllTransactions} />;
            case 'reports':
                return <ReportsPage transactions={props.transactions} accounts={props.accounts} />;
            default:
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
        }
    };
    
    return (
        <div className="flex bg-background text-text-primary min-h-screen">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            <Sidebar 
                currentView={currentView}
                onViewChange={handleViewChange}
                isOpen={isSidebarOpen}
            />
            
            <div className="flex-1 flex flex-col lg:ml-64">
                <Header 
                    title={viewTitles[currentView]}
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                    accounts={props.accounts}
                    transactions={props.transactions}
                    creditCardAlertThreshold={props.creditCardAlertThreshold}
                >
                    <Notifications transactions={props.transactions} onUpdateTransaction={props.onUpdateTransaction} accounts={props.accounts} creditCardAlertThreshold={props.creditCardAlertThreshold} />
                </Header>
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;