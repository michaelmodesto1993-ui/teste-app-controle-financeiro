import React, { useState, useEffect } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import Dashboard from './components/Dashboard.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { Account, Transaction, ThemeName, User } from './types.ts';
// Fix: Add file extension to import to ensure module resolution.
import useLocalStorage from './hooks/useLocalStorage.ts';
// Fix: Add file extension to import to ensure module resolution.
import { initialAccounts, initialTransactions, initialUsers } from './utils/initialData.ts';
// Fix: Add file extension to import to ensure module resolution.
import { applyTheme } from './utils/themes.ts';
// Fix: Add file extension to import to ensure module resolution.
import SplashScreen from './components/SplashScreen.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Login from './components/Login.tsx';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [users, setUsers] = useLocalStorage<User[]>('mairfim-users', initialUsers);
    const [accounts, setAccounts] = useLocalStorage<Account[]>('mairfim-accounts', initialAccounts);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('mairfim-transactions', initialTransactions);
    const [theme, setTheme] = useLocalStorage<ThemeName>('mairfim-theme', 'dark');
    const [investmentPercentage, setInvestmentPercentage] = useLocalStorage<number>('mairfim-investmentPercentage', 20);
    const [creditCardAlertThreshold, setCreditCardAlertThreshold] = useLocalStorage<number>('mairfim-creditCardAlertThreshold', 80);

    // Filter data based on the current user
    const userAccounts = accounts.filter(acc => acc.userId === currentUser?.id);
    const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

    // Effect to hide the splash screen and check for a remembered session
    useEffect(() => {
        const rememberedUserId = localStorage.getItem('rememberedUserId');
        if (rememberedUserId) {
            const rememberedUser = users.find(u => u.id === rememberedUserId);
            if (rememberedUser) {
                setCurrentUser(rememberedUser);
            }
        }
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [users]); // Depend on users to re-check if user list changes

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user);
    };

    const handleRegister = (newUser: Omit<User, 'id'>): User | null => {
        if (users.some(u => u.email === newUser.email)) {
            return null; // User already exists
        }
        const userWithId: User = {
            ...newUser,
            id: `user-${Date.now()}`
        };
        setUsers([...users, userWithId]);
        return userWithId;
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('rememberedUserId');
    };

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
        setTransactions(prev => [...prev, newTransaction]);
    };
    
    const handleUpdateTransaction = (updatedTransaction: Transaction) => {
        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };
    
    const handleDeleteTransaction = (transactionId: string) => {
        setTransactions(transactions.filter(t => t.id !== transactionId));
    };

    const handleClearAllTransactions = () => {
        if (!currentUser) return;
        setTransactions(transactions.filter(t => t.userId !== currentUser.id));
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <div className="animate-fadeIn">
            {!currentUser ? (
                <Login
                    users={users}
                    onAuthSuccess={handleAuthSuccess}
                    onRegister={handleRegister}
                />
            ) : (
                <Dashboard
                    accounts={userAccounts}
                    transactions={userTransactions}
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
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default App;