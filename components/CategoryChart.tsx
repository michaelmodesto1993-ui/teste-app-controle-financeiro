import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { Transaction, TransactionType, TransactionCategory } from '../types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatCurrency } from '../utils/helpers.ts';

interface CategoryChartProps {
    transactions: Transaction[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);

    // Fix: Explicitly type the accumulator in reduce to ensure type safety.
    const expensesByCategory = expenses.reduce((acc: Record<string, number>, transaction) => {
        const category = transaction.category || TransactionCategory.OTHER;
        acc[category] = (acc[category] || 0) + transaction.amount;
        return acc;
    }, {});

    // Fix: Add type assertion to Object.entries to ensure amounts are treated as numbers, resolving potential type inference issues.
    const sortedCategories = (Object.entries(expensesByCategory) as [string, number][])
        // Fix: Use destructuring in sort for clarity and robust type inference.
        .sort(([, amountA], [, amountB]) => amountB - amountA)
        .slice(0, 5); // show top 5

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg h-full min-h-[384px]">
            <h3 className="font-bold mb-4">Top 5 Despesas por Categoria</h3>
            {sortedCategories.length > 0 ? (
                <div className="space-y-4">
                    {sortedCategories.map(([category, amount], index) => {
                        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                        return (
                            <div key={category}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-text-secondary">{category}</span>
                                    <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2.5">
                                    <div 
                                        className="h-2.5 rounded-full" 
                                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                    <p>Nenhuma despesa registrada para exibir no gráfico.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryChart;