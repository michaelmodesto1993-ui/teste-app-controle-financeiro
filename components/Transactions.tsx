import React from 'react';
import { Account, Transaction, TransactionType } from '../types.ts';
import { formatCurrency, formatDateReadable } from '../utils/helpers.ts';
import { IncomeIcon, ExpenseIcon } from './icons.tsx';
import { getBankColor } from '../utils/bankStyles.ts';

interface TransactionsProps {
    accounts: Account[];
    transactions: Transaction[];
    limit?: number;
}

const Transactions: React.FC<TransactionsProps> = ({ accounts, transactions, limit }) => {
    const getAccountName = (accountId: string) => {
        const account = accounts.find(a => a.id === accountId);
        return account ? account.name : 'N/A';
    };
    
    const getAccountColor = (accountId: string) => {
        const account = accounts.find(a => a.id === accountId);
        return account ? getBankColor(account.name) : getBankColor('default');
    };

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const transactionsToShow = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-lg h-full">
            <h3 className="font-bold mb-4">Últimas Transações</h3>
            {transactionsToShow.length > 0 ? (
                <ul className="space-y-4">
                    {transactionsToShow.map(t => (
                        <li key={t.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full mr-4 ${t.type === TransactionType.INCOME ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'}`}>
                                    {t.type === TransactionType.INCOME ? <IncomeIcon className="w-5 h-5" /> : <ExpenseIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <div className="text-sm text-text-secondary flex items-center">
                                         <span 
                                            className="w-2 h-2 rounded-full mr-2" 
                                            style={{ backgroundColor: getAccountColor(t.accountId) }}
                                        ></span>
                                        <span>{getAccountName(t.accountId)} &middot; {formatDateReadable(t.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`font-bold text-lg ${t.type === TransactionType.INCOME ? 'text-income' : 'text-expense'}`}>
                                {t.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(t.amount)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-secondary">Nenhuma transação recente.</p>
            )}
        </div>
    );
};

export default Transactions;
