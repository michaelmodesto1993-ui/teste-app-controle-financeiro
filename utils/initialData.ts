import { User, Account, Transaction, TransactionType, TransactionCategory } from '../types.ts';

const userId1 = 'user-1';
const accountId1 = 'acc-1';
const accountId2 = 'acc-2';

export const initialUsers: User[] = [
    {
        id: userId1,
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: 'password123',
    },
];

export const initialAccounts: Account[] = [
    {
        id: accountId1,
        userId: userId1,
        name: 'Nubank',
        initialBalance: 50.00,
        currency: 'BRL',
    },
    {
        id: accountId2,
        userId: userId1,
        name: 'Itaú Unibanco',
        initialBalance: 1250.75,
        currency: 'BRL',
    },
];

export const initialTransactions: Transaction[] = [
    {
        id: 'txn-1',
        userId: userId1,
        accountId: accountId2,
        type: TransactionType.INCOME,
        description: 'Salário de Maio',
        amount: 5000,
        date: '2024-05-05T03:00:00.000Z',
        category: TransactionCategory.SALARY,
    },
    {
        id: 'txn-2',
        userId: userId1,
        accountId: accountId2,
        type: TransactionType.EXPENSE,
        description: 'Aluguel',
        amount: 1500,
        date: '2024-05-06T03:00:00.000Z',
        category: TransactionCategory.HOUSING,
    },
    {
        id: 'txn-3',
        userId: userId1,
        accountId: accountId1,
        type: TransactionType.EXPENSE,
        description: 'Almoço',
        amount: 35.50,
        date: '2024-05-07T03:00:00.000Z',
        category: TransactionCategory.FOOD,
    },
    {
        id: 'txn-4',
        userId: userId1,
        accountId: accountId2,
        type: TransactionType.EXPENSE,
        description: 'Supermercado',
        amount: 450.20,
        date: '2024-05-08T03:00:00.000Z',
        category: TransactionCategory.FOOD,
    },
    {
        id: 'txn-5',
        userId: userId1,
        accountId: accountId1,
        type: TransactionType.EXPENSE,
        description: 'Cinema',
        amount: 60,
        date: '2024-05-10T03:00:00.000Z',
        category: TransactionCategory.LEISURE,
    },
];