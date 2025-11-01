import React from 'react';
import { DashboardIcon, AccountsIcon, TransactionsIcon, SettingsIcon, ReportsIcon } from './icons.tsx';
import { Logo } from './Logo.tsx';

type View = 'dashboard' | 'accounts' | 'transactions' | 'settings' | 'reports';

interface SidebarProps {
    currentView: View;
    onViewChange: (view: View) => void;
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'accounts', label: 'Contas', icon: AccountsIcon },
        { id: 'transactions', label: 'Transações', icon: TransactionsIcon },
        { id: 'reports', label: 'Relatórios', icon: ReportsIcon },
        { id: 'settings', label: 'Configurações', icon: SettingsIcon },
    ];

    return (
        <aside className={`w-64 bg-surface flex flex-col h-screen fixed z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="p-4 border-b border-border flex items-center space-x-2">
                <Logo size={40} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-expense to-income bg-clip-text text-transparent">
                    MAIRFIM
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as View)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                            currentView === item.id
                                ? 'bg-primary/20 text-primary font-semibold'
                                : 'text-text-secondary hover:bg-surface-dark hover:text-text-primary'
                        }`}
                    >
                        <item.icon className="w-6 h-6 mr-3" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;