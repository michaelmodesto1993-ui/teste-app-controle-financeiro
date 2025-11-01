import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { ThemeName } from '../types.ts';

interface SettingsPageProps {
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
    investmentPercentage: number;
    onInvestmentPercentageChange: (percentage: number) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
    theme,
    onThemeChange,
    investmentPercentage,
    onInvestmentPercentageChange,
}) => {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold">Configurações</h2>
            
            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="font-bold mb-4">Tema do Aplicativo</h3>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => onThemeChange('dark')} 
                        className={`py-2 px-4 rounded transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'bg-surface-dark'}`}
                    >
                        Escuro
                    </button>
                    <button 
                        onClick={() => onThemeChange('light')} 
                        className={`py-2 px-4 rounded transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'bg-surface-dark'}`}
                    >
                        Claro
                    </button>
                    <button 
                        onClick={() => onThemeChange('synthwave')} 
                        className={`py-2 px-4 rounded transition-colors ${theme === 'synthwave' ? 'bg-primary text-white' : 'bg-surface-dark'}`}
                    >
                        Synthwave
                    </button>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">Investimento Automático</h3>
                <p className="text-text-secondary text-sm mb-4">
                    Defina uma porcentagem de cada receita para ser automaticamente registrada como uma despesa de investimento.
                </p>
                <div className="flex items-center space-x-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={investmentPercentage}
                        onChange={(e) => onInvestmentPercentageChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                        style={{'--thumb-color': 'var(--color-primary)'} as React.CSSProperties} // Custom property for thumb color if using custom CSS
                    />
                     <span className="font-semibold w-16 text-center">{investmentPercentage}%</span>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
