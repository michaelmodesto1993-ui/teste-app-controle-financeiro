import React, { useState, useEffect } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import Login from './components/Login.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Dashboard from './components/Dashboard.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { User, Account, Transaction, ThemeName, TransactionType, TransactionCategory } from './types.ts';
// Fix: Add file extension to import to ensure module resolution.
import useLocalStorage from './hooks/useLocalStorage.ts';
// Fix: Add file extension to import to ensure module resolution.
import { initialUsers, initialAccounts, initialTransactions } from './utils/initialData.ts';
// Fix: Add file extension to import to ensure module resolution.
import { applyTheme } from './utils/themes.ts';

const App: React.FC = () => {
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', initialAccounts);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', 'dark');
    const [investmentPercentage, setInvestmentPercentage] = useLocalStorage<number>('investmentPercentage', 20);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleRegister = (newUser: Omit<User, 'id' | 'password'> & { passwordPlain: string }): User | null => {
        if (users.some(u => u.email === newUser.email)) {
            return null;
        }
        const user: User = {
            id: `user-${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            password: newUser.passwordPlain, // Storing plain text as per login logic
        };
        setUsers([...users, user]);
        return user;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };
    
    // Memoize filtering to prevent re-renders, or handle inside components if performance becomes an issue.
    const userAccounts = currentUser ? accounts.filter(acc => acc.userId === currentUser.id) : [];
    const userTransactions = currentUser ? transactions.filter(t => t.userId === currentUser.id) : [];

    const handleAddAccount = (account: Omit<Account, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newAccount: Account = {
            ...account,
            id: `acc-${Date.now()}`,
            userId: currentUser.id
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
        if (!currentUser) return;
        const newTransaction: Transaction = {
            ...transaction,
            id: `t-${Date.now()}`,
            userId: currentUser.id
        };
        
        const transactionsToAdd = [newTransaction];

        if (newTransaction.type === TransactionType.INCOME && investmentPercentage > 0) {
            const investmentAmount = newTransaction.amount * (investmentPercentage / 100);
            const investmentTransaction: Transaction = {
                id: `t-inv-${Date.now()}`,
                userId: currentUser.id,
                accountId: newTransaction.accountId,
                type: TransactionType.EXPENSE,
                description: `Investimento Automático (${newTransaction.description})`,
                amount: investmentAmount,
                date: newTransaction.date,
                category: TransactionCategory.INVESTMENTS,
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

    if (!currentUser) {
        return <Login onAuthSuccess={handleLogin} onRegister={handleRegister} users={users} />;
    }

    return (
        <Dashboard
            user={currentUser}
            accounts={userAccounts}
            transactions={userTransactions}
            onLogout={handleLogout}
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
        />
    );
};

export default App;