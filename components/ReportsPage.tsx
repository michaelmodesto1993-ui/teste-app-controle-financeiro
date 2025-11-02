import React, { useState, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as XLSX from 'xlsx';
import { Transaction, Account, TransactionType } from '../types.ts';
import { formatCurrency, formatMonthYear, formatDateReadable } from '../utils/helpers.ts';
import { IncomeIcon, ExpenseIcon, ExportIcon } from './icons.tsx';
import YearlySummaryChart from './YearlySummaryChart.tsx';
import { getBankColor } from '../utils/bankStyles.ts';

interface ReportsPageProps {
    transactions: Transaction[];
    accounts: Account[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ transactions, accounts }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };
    
    const handlePrevYear = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(newDate.getFullYear() - 1);
            return newDate;
        });
    };

    const handleNextYear = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(newDate.getFullYear() + 1);
            return newDate;
        });
    };

    const getAccount = (accountId: string) => accounts.find(a => a.id === accountId);

    const { monthlyTransactions, summary, yearlySummaryData } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Yearly data calculation
        const monthsData = Array.from({ length: 12 }, (_, i) => ({ month: i, income: 0, expense: 0 }));
        transactions
            .filter(t => new Date(t.date + 'T00:00:00').getFullYear() === year)
            .forEach(t => {
                const transactionMonth = new Date(t.date + 'T00:00:00').getMonth();
                if (t.type === TransactionType.INCOME) {
                    monthsData[transactionMonth].income += t.amount;
                } else if (t.type === TransactionType.EXPENSE) {
                    monthsData[transactionMonth].expense += t.amount;
                }
            });

        // Monthly data calculation
        const filtered = transactions.filter(t => {
            const transactionDate = new Date(t.date + 'T00:00:00');
            return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
        });

        const income = filtered.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const expense = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);

        return {
            monthlyTransactions: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            summary: {
                income,
                expense,
                balance: income - expense,
            },
            yearlySummaryData: monthsData,
        };
    }, [currentDate, transactions]);

    const handleExport = async (format: 'xlsx' | 'csv') => {
        if (monthlyTransactions.length === 0) return;

        const dataToExport = monthlyTransactions.map(t => {
            const account = getAccount(t.accountId);
            return {
                'Data Vencimento': t.date,
                'Data Compra': t.purchaseDate || '',
                'Descrição': t.description,
                'Conta': account ? account.name : 'N/A',
                'Tipo Conta': account ? account.type : 'N/A',
                'Categoria': t.category,
                'Tipo': t.type,
                'Valor': t.type === TransactionType.EXPENSE ? -t.amount : t.amount,
                'Moeda': account ? account.currency : 'BRL',
                'Status': t.type === TransactionType.EXPENSE ? (t.isPaid ? 'Pago' : 'Pendente') : ''
            };
        });
        
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transações');

        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const fileName = `MAIRFIM_Relatorio_${year}-${month}.${format}`;
        
        if (Capacitor.isNativePlatform()) {
            try {
                const base64 = XLSX.write(wb, { bookType: format as any, type: 'base64' });
                await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: Directory.Documents,
                    recursive: true
                });
                alert(`Relatório salvo em Documentos: ${fileName}`);
            } catch (e) {
                console.error('Error saving file', e);
                alert('Erro ao salvar o arquivo.');
            }
        } else {
            XLSX.writeFile(wb, fileName);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface p-4 rounded-lg shadow-lg">
                <button onClick={handlePrevYear} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&lt;</button>
                <h3 className="text-xl font-bold">{currentDate.getFullYear()}</h3>
                <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&gt;</button>
            </div>

            <YearlySummaryChart data={yearlySummaryData} />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-lg shadow-lg">
                <div className="flex items-center w-full sm:w-auto justify-between">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&lt;</button>
                    <h3 className="text-xl font-bold mx-4">{formatMonthYear(currentDate)}</h3>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-surface-dark transition-colors">&gt;</button>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button onClick={() => handleExport('xlsx')} disabled={monthlyTransactions.length === 0} className="flex flex-1 justify-center items-center text-sm py-2 px-3 rounded bg-surface-dark text-text-secondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed">
                        <ExportIcon className="w-4 h-4 mr-2" />
                        Excel
                    </button>
                     <button onClick={() => handleExport('csv')} disabled={monthlyTransactions.length === 0} className="flex flex-1 justify-center items-center text-sm py-2 px-3 rounded bg-surface-dark text-text-secondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed">
                        <ExportIcon className="w-4 h-4 mr-2" />
                        CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-lg shadow-lg">
                    <h4 className="text-sm text-text-secondary font-medium">Receitas no Mês</h4>
                    <p className="text-2xl font-bold mt-1 text-income">{formatCurrency(summary.income)}</p>
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-lg">
                    <h4 className="text-sm text-text-secondary font-medium">Despesas no Mês</h4>
                    <p className="text-2xl font-bold mt-1 text-expense">{formatCurrency(summary.expense)}</p>
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-lg">
                    <h4 className="text-sm text-text-secondary font-medium">Balanço do Mês</h4>
                    <p className={`text-2xl font-bold mt-1 ${summary.balance >= 0 ? 'text-income' : 'text-expense'}`}>{formatCurrency(summary.balance)}</p>
                </div>
            </div>

            <div className="bg-surface p-2 sm:p-6 rounded-lg shadow-lg">
                <h3 className="font-bold mb-4 px-4 pt-4 sm:p-0">Transações do Mês</h3>
                {monthlyTransactions.length > 0 ? (
                    <ul className="divide-y divide-border">
                        {monthlyTransactions.map(t => {
                            const account = getAccount(t.accountId);
                            const bankColor = account ? getBankColor(account.name) : getBankColor('default');
                            return (
                            <li key={t.id} className={`py-3 px-2 sm:px-0 flex flex-col sm:flex-row justify-between sm:items-center gap-2 ${t.isPaid ? 'opacity-50' : ''}`}>
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-full mr-4 ${t.type === TransactionType.INCOME ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}>
                                        {t.type === TransactionType.INCOME ? <IncomeIcon className="w-5 h-5" /> : <ExpenseIcon className="w-5 h-5" />}
                                    </div>
                                    <div className={`${t.isPaid ? 'line-through' : ''}`}>
                                        <p className="font-semibold">{t.description}</p>
                                        <p className="text-sm text-text-secondary flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: bankColor }}></span>
                                            <span className="truncate">{account ? `${account.name} (${account.type})` : 'N/A'}</span>
                                            <span className="mx-1">&middot;</span>
                                            <span>{formatDateReadable(t.date)}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-bold self-end sm:self-center ${t.isPaid ? 'line-through' : ''} ${t.type === TransactionType.INCOME ? 'text-income' : 'text-expense'}`}>
                                    {t.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(t.amount, account?.currency)}
                                </span>
                            </li>
                        )})}
                    </ul>
                ) : (
                    <p className="text-text-secondary text-center py-4">Nenhuma transação registrada para este mês.</p>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;