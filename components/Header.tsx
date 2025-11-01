import React from 'react';
import { User } from '../types.ts';

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    return (
        <header className="h-16 bg-surface border-b border-border flex items-center justify-end px-6">
            <div>
                <span className="font-semibold">{user.name}</span>
            </div>
        </header>
    );
};

export default Header;
