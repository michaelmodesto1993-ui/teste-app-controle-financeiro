import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Fix: Add file extension to import to ensure module resolution.
import Login from './components/Login.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Dashboard from './components/Dashboard.tsx';
// Fix: Add file extension to import to ensure module resolution.
import useLocalStorage from './hooks/useLocalStorage.ts';
// Fix: Add file extension to import to ensure module resolution.
import { initialUsers, initialAccounts, initialTransactions } from './utils/initialData.ts';
// Fix: Add file extension to import to ensure module resolution.
import { User, Account, Transaction, View } from './types.ts';
// Fix: Add file extension to import to ensure module resolution.
import { ThemeName, applyTheme } from './utils/themes.ts';

function App() {
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', initialAccounts);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [view, setView] = useLocalStorage<View>('view', 'dashboard');
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', 'dark');

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('dashboard');
    };

    const handleRegister = (newUserDto: Omit<User, 'id' | 'password'> & { passwordPlain: string }): User | null => {
        if (users.some(u => u.email === newUserDto.email)) {
            return null; // Email already exists
        }
        const newUser: User = {
            id: `user-${uuidv4()}`,
            name: newUserDto.name,
            email: newUserDto.email,
            password: newUserDto.passwordPlain, // Not hashing for this example
        };
        setUsers([...users, newUser]);
        return newUser;
    };
    
    // Filter data based on current user
    const userAccounts = accounts.filter(acc => acc.userId === currentUser?.id);
    const userTransactions = transactions.filter(txn => txn.userId === currentUser?.id);

    // CRUD for Accounts
    const handleAddAccount = (accountData: Omit<Account, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newAccount: Account = {
            ...accountData,
            id: `acc-${uuidv4()}`,
            userId: currentUser.id,
        };
        setAccounts([...accounts, newAccount]);
    };

    const handleUpdateAccount = (updatedAccount: Account) => {
        setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    };

    const handleDeleteAccount = (accountId: string) => {
        // Also delete associated transactions
        setTransactions(transactions.filter(txn => txn.accountId !== accountId));
        setAccounts(accounts.filter(acc => acc.id !== accountId));
    };

    // CRUD for Transactions
    const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newTransaction: Transaction = {
            ...transactionData,
            id: `txn-${uuidv4()}`,
            userId: currentUser.id,
        };
        setTransactions([...transactions, newTransaction]);
    };

    const handleUpdateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(transactions.map(txn => txn.id === updatedTransaction.id ? updatedTransaction : txn));
    };

    const handleDeleteTransaction = (transactionId: string) => {
        setTransactions(transactions.filter(txn => txn.id !== transactionId));
    };
    
    if (!currentUser) {
        return <Login onAuthSuccess={handleLogin} onRegister={handleRegister} users={users} />;
    }

    return (
        <Dashboard
            user={currentUser}
            accounts={userAccounts}
            transactions={userTransactions}
            view={view}
            theme={theme}
            onNavigate={setView}
            onLogout={handleLogout}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onThemeChange={setTheme}
        />
    );
}

export default App;
