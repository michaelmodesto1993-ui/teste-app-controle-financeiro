import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { View } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { DashboardIcon, AccountsIcon, TransactionsIcon, SettingsIcon, LogoutIcon } from './icons.tsx';

interface SidebarProps {
    currentView: View;
    onNavigate: (view: View) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
    const navItems: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { view: 'accounts', label: 'Contas', icon: AccountsIcon },
        { view: 'transactions', label: 'Transações', icon: TransactionsIcon },
        { view: 'settings', label: 'Configurações', icon: SettingsIcon },
    ];

    return (
        <aside className="w-64 bg-surface flex flex-col border-r border-border">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <h1 className="text-xl font-bold">FinTrack</h1>
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul>
                    {navItems.map(({ view, label, icon: Icon }) => (
                        <li key={view}>
                            <button
                                onClick={() => onNavigate(view)}
                                className={`w-full flex items-center py-2 px-4 rounded transition-colors mb-2 ${
                                    currentView === view
                                        ? 'bg-primary/20 text-primary font-semibold'
                                        : 'hover:bg-surface-dark'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="px-4 py-6 border-t border-border">
                 <button
                    onClick={onLogout}
                    className="w-full flex items-center py-2 px-4 rounded transition-colors hover:bg-surface-dark"
                >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
