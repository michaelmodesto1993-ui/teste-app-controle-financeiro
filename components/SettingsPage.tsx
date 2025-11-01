import React, { useState } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { ThemeName } from '../types.ts';

interface SettingsPageProps {
    theme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
    investmentPercentage: number;
    onInvestmentPercentageChange: (percentage: number) => void;
    creditCardAlertThreshold: number;
    onCreditCardAlertThresholdChange: (percentage: number) => void;
    onClearAllTransactions: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
    theme,
    onThemeChange,
    investmentPercentage,
    onInvestmentPercentageChange,
    creditCardAlertThreshold,
    onCreditCardAlertThresholdChange,
    onClearAllTransactions,
}) => {
    const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

    return (
        <div className="space-y-8 max-w-3xl">
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

            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h3 className="font-bold mb-2">Alerta de Limite do Cartão de Crédito</h3>
                <p className="text-text-secondary text-sm mb-4">
                    Receba uma notificação quando o total da sua fatura atingir uma certa porcentagem do limite total do cartão.
                </p>
                <div className="flex items-center space-x-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={creditCardAlertThreshold}
                        onChange={(e) => onCreditCardAlertThresholdChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                    />
                     <span className="font-semibold w-16 text-center">{creditCardAlertThreshold}%</span>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg border border-expense/50">
                <h3 className="font-bold mb-2 text-expense">Zona de Perigo</h3>
                <p className="text-text-secondary text-sm mb-4">
                    A ação abaixo é irreversível. Tenha certeza do que está fazendo.
                </p>
                <button
                    onClick={() => setIsClearDataModalOpen(true)}
                    className="bg-expense text-white font-bold py-2 px-4 rounded hover:bg-expense/80 transition-colors"
                >
                    Limpar Todas as Transações
                </button>
            </div>

            {isClearDataModalOpen && (
                <ConfirmationModal
                    onConfirm={() => {
                        onClearAllTransactions();
                        setIsClearDataModalOpen(false);
                    }}
                    onClose={() => setIsClearDataModalOpen(false)}
                />
            )}
        </div>
    );
};

const ConfirmationModal: React.FC<{
    onConfirm: () => void;
    onClose: () => void;
}> = ({ onConfirm, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-lg p-8 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Confirmar Limpeza de Dados</h3>
                <p className="text-text-secondary mb-6">
                    Você tem certeza que deseja excluir <span className="font-bold text-expense">TODAS</span> as suas transações?
                    <br />
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-surface-dark text-text-secondary hover:bg-border">
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} className="py-2 px-4 rounded bg-expense text-white hover:bg-expense/80">
                        Sim, Excluir Tudo
                    </button>
                </div>
            </div>
        </div>
    );
};


export default SettingsPage;