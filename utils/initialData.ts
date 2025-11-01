import { User, Account, Transaction, TransactionType, TransactionCategory } from '../types.ts';

export const initialUsers: User[] = [
    { id: 'user-1', name: 'Usuário Exemplo', email: 'user@example.com', password: 'password123' },
];

export const initialAccounts: Account[] = [
    { id: 'acc-1', userId: 'user-1', name: 'Carteira', initialBalance: 150.75, currency: 'BRL' },
    { id: 'acc-2', userId: 'user-1', name: 'Banco Principal', initialBalance: 2500.00, currency: 'BRL' },
    { id: 'acc-3', userId: 'user-1', name: 'Poupança', initialBalance: 10000.00, currency: 'BRL' },
];

export const initialTransactions: Transaction[] = [
    {
        id: 'txn-1',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.INCOME,
        description: 'Salário Mensal',
        amount: 5000,
        date: new Date('2023-10-05T12:00:00Z').toISOString(),
        category: TransactionCategory.SALARY,
    },
    {
        id: 'txn-2',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.EXPENSE,
        description: 'Aluguel',
        amount: 1200,
        date: new Date('2023-10-06T12:00:00Z').toISOString(),
        category: TransactionCategory.HOUSING,
    },
    {
        id: 'txn-3',
        userId: 'user-1',
        accountId: 'acc-1',
        type: TransactionType.EXPENSE,
        description: 'Almoço',
        amount: 25.50,
        date: new Date('2023-10-07T12:00:00Z').toISOString(),
        category: TransactionCategory.FOOD,
    },
    {
        id: 'txn-4',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.EXPENSE,
        description: 'Supermercado',
        amount: 350.45,
        date: new Date('2023-10-08T12:00:00Z').toISOString(),
        category: TransactionCategory.FOOD,
    },
    {
        id: 'txn-5',
        userId: 'user-1',
        accountId: 'acc-1',
        type: TransactionType.EXPENSE,
        description: 'Cinema',
        amount: 50,
        date: new Date('2023-10-09T12:00:00Z').toISOString(),
        category: TransactionCategory.LEISURE,
    },
     {
        id: 'txn-6',
        userId: 'user-1',
        accountId: 'acc-3',
        type: TransactionType.INCOME,
        description: 'Rendimento Poupança',
        amount: 50.12,
        date: new Date('2023-10-10T12:00:00Z').toISOString(),
        category: TransactionCategory.INVESTMENTS,
    },
];
