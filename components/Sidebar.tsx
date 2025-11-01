import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { DashboardIcon, AccountsIcon, TransactionsIcon, LogoutIcon } from './icons.tsx';

type Page = 'dashboard' | 'accounts' | 'transactions' | 'settings';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'accounts', label: 'Contas', icon: AccountsIcon },
        { id: 'transactions', label: 'Transações', icon: TransactionsIcon },
    ];

    return (
        <aside className="w-64 bg-surface flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-border">
                <h1 className="text-xl font-bold">FinTrack Pro</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id as Page)}
                        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                            activePage === item.id
                                ? 'bg-primary text-white'
                                : 'hover:bg-surface-dark'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="px-4 py-6 border-t border-border">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-surface-dark text-text-secondary"
                >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
