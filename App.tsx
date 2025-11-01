import React, { useState, useEffect } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import Dashboard from './components/Dashboard.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, ThemeName, TransactionType, TransactionCategory, RecurrenceType, AccountType } from './types.ts';
// Fix: Add file extension to import to ensure module resolution.
import useLocalStorage from './hooks/useLocalStorage.ts';
// Fix: Add file extension to import to ensure module resolution.
import { initialAccounts, initialTransactions } from './utils/initialData.ts';
// Fix: Add file extension to import to ensure module resolution.
import { applyTheme } from './utils/themes.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatDate, calculateCreditCardDueDate } from './utils/helpers.ts';
// Fix: Add file extension to import to ensure module resolution.
import SplashScreen from './components/SplashScreen.tsx';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    // State is now managed globally for a single-user experience, persisting to localStorage.
    const [accounts, setAccounts] = useLocalStorage<Account[]>('mairfim-accounts', initialAccounts);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('mairfim-transactions', initialTransactions);
    const [theme, setTheme] = useLocalStorage<ThemeName>('mairfim-theme', 'dark');
    const [investmentPercentage, setInvestmentPercentage] = useLocalStorage<number>('mairfim-investmentPercentage', 20);
    const [creditCardAlertThreshold, setCreditCardAlertThreshold] = useLocalStorage<number>('mairfim-creditCardAlertThreshold', 80);

    // Effect to hide the splash screen after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    // Effect to apply the theme whenever it changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleAddAccount = (account: Omit<Account, 'id' | 'userId'>) => {
        const newAccount: Account = {
            ...account,
            id: `acc-${Date.now()}`,
            userId: 'local-user' // Static user ID for a single-user app
        };
        setAccounts([...accounts, newAccount]);
    };

    const handleUpdateAccount = (updatedAccount: Account) => {
        setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    };

    const handleDeleteAccount = (accountId: string) => {
        // Also delete associated transactions
        setTransactions(transactions.filter(t => t.accountId !== accountId));
        setAccounts(accounts.filter(acc => acc.id !== accountId));
    };

    const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
        const account = accounts.find(a => a.id === transaction.accountId);

        // --- Handle Installments ---
        if (transaction.recurrenceType === RecurrenceType.INSTALLMENT && transaction.installmentTotal && transaction.installmentTotal > 0) {
            const transactionsToAdd: Transaction[] = [];
            const installmentAmount = transaction.amount / transaction.installmentTotal;
            // For installments, `transaction.date` from the modal is always the purchase date
            const purchaseDate = new Date(transaction.date + 'T00:00:00'); 
            
            // If it's a credit card, calculate due dates for each installment
            if (account && account.type === AccountType.CREDIT_CARD && account.closingDay && account.dueDay) {
                const firstDueDate = calculateCreditCardDueDate(purchaseDate, account.closingDay, account.dueDay);
                
                for (let i = 0; i < transaction.installmentTotal; i++) {
                    const installmentDueDate = new Date(firstDueDate);
                    installmentDueDate.setMonth(firstDueDate.getMonth() + i);

                    const newInstallment: Transaction = {
                        ...transaction,
                        id: `t-${Date.now()}-${i}`,
                        userId: 'local-user',
                        amount: installmentAmount,
                        date: formatDate(installmentDueDate.toISOString()), // Calculated Due Date
                        purchaseDate: formatDate(purchaseDate.toISOString()), // Original Purchase Date
                        description: `${transaction.description} (${i + 1}/${transaction.installmentTotal})`,
                        installmentCurrent: i + 1,
                        isPaid: false, // All installments on credit card are initially unpaid
                    };
                    transactionsToAdd.push(newInstallment);
                }
            } else { // Handle installments for non-credit card accounts (legacy behavior)
                for (let i = 0; i < transaction.installmentTotal; i++) {
                    const installmentDate = new Date(purchaseDate);
                    installmentDate.setMonth(purchaseDate.getMonth() + i);
                    
                    const newInstallment: Transaction = {
                        ...transaction,
                        id: `t-${Date.now()}-${i}`,
                        userId: 'local-user',
                        amount: installmentAmount,
                        date: formatDate(installmentDate.toISOString()),
                        description: `${transaction.description} (${i + 1}/${transaction.installmentTotal})`,
                        installmentCurrent: i + 1,
                        isPaid: i === 0 ? transaction.isPaid : false,
                    };
                    transactionsToAdd.push(newInstallment);
                }
            }
            setTransactions(prev => [...prev, ...transactionsToAdd]);
            return; // Exit after handling installments
        }

        // --- Handle single transactions (and auto-investment) ---
        const newTransaction: Transaction = {
            ...transaction,
            id: `t-${Date.now()}`,
            userId: 'local-user'
        };

        // For new credit card expenses, they are always unpaid initially.
        if (account?.type === AccountType.CREDIT_CARD && newTransaction.type === TransactionType.EXPENSE) {
            newTransaction.isPaid = false;
        }
        
        const transactionsToAdd = [newTransaction];

        // Automatic investment logic
        if (newTransaction.type === TransactionType.INCOME && investmentPercentage > 0) {
            const investmentAmount = newTransaction.amount * (investmentPercentage / 100);
            const investmentTransaction: Transaction = {
                id: `t-inv-${Date.now()}`,
                userId: 'local-user',
                accountId: newTransaction.accountId,
                type: TransactionType.EXPENSE,
                description: `Investimento Automático (${newTransaction.description})`,
                amount: investmentAmount,
                date: newTransaction.date,
                category: TransactionCategory.INVESTMENTS,
                isPaid: true,
            };
            transactionsToAdd.push(investmentTransaction);
        }
        
        setTransactions(prevTransactions => [...prevTransactions, ...transactionsToAdd]);
    };

    const handleUpdateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    const handleDeleteTransaction = (transactionId: string) => {
        setTransactions(transactions.filter(t => t.id !== transactionId));
    };

    const handleClearAllTransactions = () => {
        setTransactions([]);
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <div className="animate-fadeIn">
            <Dashboard
                accounts={accounts}
                transactions={transactions}
                onAddAccount={handleAddAccount}
                onUpdateAccount={handleUpdateAccount}
                onDeleteAccount={handleDeleteAccount}
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                theme={theme}
                onThemeChange={setTheme}
                investmentPercentage={investmentPercentage}
                onInvestmentPercentageChange={setInvestmentPercentage}
                creditCardAlertThreshold={creditCardAlertThreshold}
                onCreditCardAlertThresholdChange={setCreditCardAlertThreshold}
                onClearAllTransactions={handleClearAllTransactions}
            />
        </div>
    );
};

export default App;