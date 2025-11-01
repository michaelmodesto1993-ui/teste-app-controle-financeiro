import React from 'react';
import { MenuIcon } from './icons.tsx';
import { Account, Transaction } from '../types.ts';

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
    onMenuClick: () => void;
    accounts: Account[];
    transactions: Transaction[];
    creditCardAlertThreshold: number;
}

const Header: React.FC<HeaderProps> = ({ title, children, onMenuClick }) => {
    return (
        <header className="relative flex justify-between items-center p-4 sm:px-8 mb-6 pb-4 border-b border-border">
            <div className="flex items-center">
                 <button onClick={onMenuClick} className="lg:hidden mr-4 p-2 text-text-secondary rounded-full hover:bg-surface-dark">
                    <MenuIcon className="w-6 h-6" />
                 </button>
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
                {children}
            </div>
        </header>
    );
};

export default Header;