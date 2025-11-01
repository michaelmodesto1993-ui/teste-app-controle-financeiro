import React from 'react';
import { formatCurrency } from '../utils/helpers.ts';
import { TransactionType } from '../types.ts';

interface YearlySummaryChartProps {
    data: { month: number; income: number; expense: number }[];
}

const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const YearlySummaryChart: React.FC<YearlySummaryChartProps> = ({ data }) => {
    const maxAmount = Math.max(...data.map(d => d.income), ...data.map(d => d.expense), 1); // Use 1 to avoid division by zero

    const hasData = data.some(d => d.income > 0 || d.expense > 0);

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg">
            <h3 className="font-bold mb-6">Resumo Anual</h3>
            {hasData ? (
                <>
                    <div className="flex justify-end space-x-4 mb-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-income rounded-sm mr-2"></div>
                            <span className="text-sm text-text-secondary">Receitas</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-expense rounded-sm mr-2"></div>
                            <span className="text-sm text-text-secondary">Despesas</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-2 sm:gap-x-4 h-64 items-end">
                        {data.map(({ month, income, expense }) => {
                            const incomeHeight = (income / maxAmount) * 100;
                            const expenseHeight = (expense / maxAmount) * 100;

                            return (
                                <div key={month} className="text-center flex flex-col items-center justify-end h-full">
                                    <div className="flex items-end h-full w-full justify-center space-x-1">
                                         <div className="group relative w-1/2">
                                            <div
                                                className="bg-income rounded-t-sm w-full transition-all duration-300 ease-in-out hover:opacity-80"
                                                style={{ height: `${incomeHeight}%` }}
                                            />
                                            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-surface-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2">
                                                {formatCurrency(income)}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-dark"></div>
                                            </div>
                                        </div>
                                         <div className="group relative w-1/2">
                                            <div
                                                className="bg-expense rounded-t-sm w-full transition-all duration-300 ease-in-out hover:opacity-80"
                                                style={{ height: `${expenseHeight}%` }}
                                            />
                                            <div className="absolute bottom-full mb-2 w-max max-w-xs bg-surface-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none left-1/2 -translate-x-1/2">
                                                {formatCurrency(expense)}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-dark"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-secondary mt-2">{monthLabels[month]}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-64 text-text-secondary">
                    <p>Nenhuma transação registrada para este ano.</p>
                </div>
            )}
        </div>
    );
};

export default YearlySummaryChart;
