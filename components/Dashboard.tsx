import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import DashboardView from './DashboardView.tsx';
import AccountsPage from './AccountsPage.tsx';
import TransactionsPage from './TransactionsPage.tsx';
import SettingsPage from './SettingsPage.tsx';
import ReportsPage from './ReportsPage.tsx';
import GeminiPage from './GeminiPage.tsx';
import Notifications from './Notifications.tsx';
import { Account, Transaction, ThemeName } from '../types.ts';

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
    onLogout: () => void; // Added for logout functionality
}

type View = 'dashboard' | 'accounts' | 'transactions' | 'settings' | 'reports' | 'gemini';

const Dashboard: React.FC<DashboardProps> = (props) => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const backButtonListener = CapacitorApp.addListener('backButton', () => {
            if (isSidebarOpen) {
                setIsSidebarOpen(false);
                return;
            }

            if (currentView !== 'dashboard') {
                handleViewChange('dashboard');
            } else {
                CapacitorApp.exitApp();
            }
        });

        return () => {
            backButtonListener.remove();
        };
    }, [currentView, isSidebarOpen]);

    const viewTitles: Record<View, string> = {
        dashboard: 'Dashboard',
        accounts: 'Contas',
        transactions: 'Transações',
        reports: 'Relatórios',
        gemini: 'MAIRFIM AI',
        settings: 'Configurações',
    };

    const handleViewChange = (view: View) => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on view change on mobile
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
            case 'accounts':
                return <AccountsPage 
                            accounts={props.accounts} 
                            transactions={props.transactions}
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
                            creditCardAlertThreshold={props.creditCardAlertThreshold}
                            onCreditCardAlertThresholdChange={props.onCreditCardAlertThresholdChange}
                            onClearAllTransactions={props.onClearAllTransactions}
                       />;
            case 'reports':
                return <ReportsPage accounts={props.accounts} transactions={props.transactions} />;
            case 'gemini':
                return <GeminiPage 
                            accounts={props.accounts} 
                            transactions={props.transactions} 
                            onAddTransaction={props.onAddTransaction}
                            onUpdateTransaction={props.onUpdateTransaction}
                            onDeleteTransaction={props.onDeleteTransaction}
                            onAddAccount={props.onAddAccount}
                            onUpdateAccount={props.onUpdateAccount}
                            onDeleteAccount={props.onDeleteAccount}
                        />;
            default:
                return <DashboardView accounts={props.accounts} transactions={props.transactions} />;
        }
    };
    
    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar currentView={currentView} onViewChange={handleViewChange} isOpen={isSidebarOpen} onLogout={props.onLogout} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out lg:ml-64`}>
                <Header 
                    title={viewTitles[currentView]} 
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    accounts={props.accounts}
                    transactions={props.transactions}
                    creditCardAlertThreshold={props.creditCardAlertThreshold}
                >
                    <Notifications 
                        accounts={props.accounts}
                        transactions={props.transactions}
                        creditCardAlertThreshold={props.creditCardAlertThreshold}
                        onUpdateTransaction={props.onUpdateTransaction}
                    />
                </Header>
                <main className="flex-1 overflow-y-auto p-4 sm:px-8 no-scrollbar">
                    {renderView()}
                </main>
            </div>
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
        </div>
    );
};

export default Dashboard;