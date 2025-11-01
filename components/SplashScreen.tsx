import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Logo } from './Logo.tsx';

const SplashScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background animate-fadeOut">
            <div className="flex flex-col items-center justify-center animate-fadeInUp">
                <Logo size={80} />
                <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-expense to-income bg-clip-text text-transparent mt-4">
                    MAIRFIM
                </h1>
            </div>
        </div>
    );
};

export default SplashScreen;