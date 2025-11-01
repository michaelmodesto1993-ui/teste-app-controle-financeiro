import React, { useState } from 'react';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import useLocalStorage from './hooks/useLocalStorage.ts';
import { initialUsers, initialAccounts, initialTransactions } from './utils/initialData.ts';
import { User, Account, Transaction } from './types.ts';

const App: React.FC = () => {
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', initialAccounts);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleAuthSuccess = (user: User) => {
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
            password: newUser.passwordPlain,
        };
        setUsers([...users, user]);
        return user;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };
    
    const userAccounts = currentUser ? accounts.filter(acc => acc.userId === currentUser.id) : [];
    const userTransactions = currentUser ? transactions.filter(tx => tx.userId === currentUser.id) : [];

    // Account handlers
    const handleAddAccount = (account: Omit<Account, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newAccount: Account = { ...account, id: `acc-${Date.now()}`, userId: currentUser.id };
        setAccounts([...accounts, newAccount]);
    };
    
    const handleUpdateAccount = (updatedAccount: Account) => {
        setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
    };
    
    const handleDeleteAccount = (accountId: string) => {
        setAccounts(accounts.filter(acc => acc.id !== accountId));
        // Also delete related transactions
        setTransactions(transactions.filter(tx => tx.accountId !== accountId));
    };

    // Transaction handlers
    const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'userId'>) => {
        if (!currentUser) return;
        const newTransaction: Transaction = { ...transaction, id: `txn-${Date.now()}`, userId: currentUser.id };
        setTransactions([...transactions, newTransaction]);
    };

    const handleUpdateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(transactions.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx));
    };

    const handleDeleteTransaction = (transactionId: string) => {
        setTransactions(transactions.filter(tx => tx.id !== transactionId));
    };


    if (!currentUser) {
        return <Login onAuthSuccess={handleAuthSuccess} onRegister={handleRegister} users={users} />;
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
        />
    );
};

export default App;
