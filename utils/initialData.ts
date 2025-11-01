import { User, Account, Transaction, TransactionType, TransactionCategory, RecurrenceType, RecurrenceFrequency } from '../types.ts';

export const initialUsers: User[] = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', password: 'password123' }
];

export const initialAccounts: Account[] = [
    { id: 'acc-1', userId: 'user-1', name: 'Bradesco', initialBalance: 1500, currency: 'BRL' },
    { id: 'acc-2', userId: 'user-1', name: 'Nubank', initialBalance: 3200, currency: 'BRL' },
];

export const initialTransactions: Transaction[] = [
    {
        id: 't-1',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.INCOME,
        description: 'Salário de Maio',
        amount: 5000,
        date: '2024-05-01',
        category: TransactionCategory.SALARY,
        recurrenceType: RecurrenceType.RECURRING,
        recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    },
    {
        id: 't-2',
        userId: 'user-1',
        accountId: 'acc-1',
        type: TransactionType.EXPENSE,
        description: 'Aluguel',
        amount: 1200,
        date: '2024-05-05',
        category: TransactionCategory.HOUSING,
        recurrenceType: RecurrenceType.RECURRING,
        recurrenceFrequency: RecurrenceFrequency.MONTHLY,
        isPaid: false, // Example of an unpaid bill
    },
    {
        id: 't-3',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.EXPENSE,
        description: 'Supermercado',
        amount: 450,
        date: '2024-05-10',
        category: TransactionCategory.FOOD,
        recurrenceType: RecurrenceType.SINGLE,
        isPaid: true,
    },
    {
        id: 't-4',
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.EXPENSE,
        description: 'Compra de Smartphone',
        amount: 250,
        date: '2024-05-15',
        category: TransactionCategory.OTHER,
        customCategory: 'Eletrónicos',
        recurrenceType: RecurrenceType.INSTALLMENT,
        installmentCurrent: 3,
        installmentTotal: 12,
        isPaid: true,
    }
];