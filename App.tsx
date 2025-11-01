import React, { useState, useEffect } from 'react';
// Fix: Add file extension to import to ensure module resolution.
import Login from './components/Login.tsx';
// Fix: Add file extension to import to ensure module resolution.
import Dashboard from './components/Dashboard.tsx';
// Fix: Add file extension to import to ensure module resolution.
import { User, Account, Transaction, ThemeName, TransactionType, TransactionCategory, RecurrenceType, AccountType } from './types.ts';
// Fix: Add file extension to import to ensure module resolution.
import useLocalStorage from './hooks/useLocalStorage.ts';
// Fix: Add file extension to import to ensure module resolution.
import { initialUsers, initialAccounts, initialTransactions } from './utils/initialData.ts';
// Fix: Add file extension to import to ensure module resolution.
import { applyTheme } from './utils/themes.ts';
// Fix: Add file extension to import to ensure module resolution.
import { formatDate, calculateCreditCardDueDate } from './utils/helpers.ts';

const App: React.FC = () => {
    // Global state, not user-specific
    const [users, setUsers] = useLocalStorage<User[]>('users', initialUsers);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);

    // User-specific state, managed with useState and useEffects for persistence
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [theme, setTheme] = useState<ThemeName>('dark');
    const [investmentPercentage, setInvestmentPercentage] = useState<number>(20);
    const [creditCardAlertThreshold, setCreditCardAlertThreshold] = useState<number>(80);


    // Effect to LOAD data when currentUser changes (e.g., on login/logout)
    useEffect(() => {
        if (currentUser) {
            // Load data from localStorage using user-specific keys
            const userAccounts = JSON.parse(localStorage.getItem(`accounts_${currentUser.id}`) || 'null');
            const userTransactions = JSON.parse(localStorage.getItem(`transactions_${currentUser.id}`) || 'null');
            const userTheme = JSON.parse(localStorage.getItem(`theme_${currentUser.id}`) || 'null');
            const userInvPerc = JSON.parse(localStorage.getItem(`investmentPercentage_${currentUser.id}`) || 'null');
            const userCreditAlert = JSON.parse(localStorage.getItem(`creditCardAlertThreshold_${currentUser.id}`) || 'null');

            // For the initial seed user 'user-1', load sample data if they have no data saved yet.
            if (currentUser.id === 'user-1' && userAccounts === null) {
                setAccounts(initialAccounts);
            } else {
                setAccounts(userAccounts || []);
            }

            if (currentUser.id === 'user-1' && userTransactions === null) {
                setTransactions(initialTransactions);
            } else {
                setTransactions(userTransactions || []);
            }
            
            setTheme(userTheme || 'dark');
            setInvestmentPercentage(userInvPerc ?? 20); // Use nullish coalescing to allow 0%
            setCreditCardAlertThreshold(userCreditAlert ?? 80);
        } else {
            // If no user is logged in, clear all user-specific state
            setAccounts([]);
            setTransactions([]);
            setTheme('dark');
            setInvestmentPercentage(20);
            setCreditCardAlertThreshold(80);
        }
    }, [currentUser]);

    // Effects to SAVE data to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`accounts_${currentUser.id}`, JSON.stringify(accounts));
        }
    }, [accounts, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`transactions_${currentUser.id}`, JSON.stringify(transactions));
        }
    }, [transactions, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`theme_${currentUser.id}`, JSON.stringify(theme));
        }
        applyTheme(theme); // Apply theme to the UI, but save it per-user
    }, [theme, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`investmentPercentage_${currentUser.id}`, JSON.stringify(investmentPercentage));
        }
    }, [investmentPercentage, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(`creditCardAlertThreshold_${currentUser.id}`, JSON.stringify(creditCardAlertThreshold));
        }
    }, [creditCardAlertThreshold, currentUser]);

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
                        userId: currentUser.id,
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
                        userId: currentUser.id,
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
            userId: currentUser.id
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
                userId: currentUser.id,
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

    if (!currentUser) {
        return <Login onAuthSuccess={handleLogin} onRegister={handleRegister} users={users} />;
    }

    return (
        <Dashboard
            user={currentUser}
            accounts={accounts}
            transactions={transactions}
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
            creditCardAlertThreshold={creditCardAlertThreshold}
            onCreditCardAlertThresholdChange={setCreditCardAlertThreshold}
        />
    );
};

export default App;