import { User, Account, Transaction, TransactionType, TransactionCategory, RecurrenceType, RecurrenceFrequency, AccountType } from '../types.ts';
import { formatDate, calculateCreditCardDueDate } from './helpers.ts';

export const initialUsers: User[] = [
    { id: 'user-1', name: 'Usuário Padrão', email: 'mairfim@email.com', password: '123' }
];

export const initialAccounts: Account[] = [
    { id: 'acc-1', userId: 'user-1', name: 'Bradesco', type: AccountType.CHECKING, initialBalance: 1500, currency: 'BRL' },
    { id: 'acc-2', userId: 'user-1', name: 'Nubank', type: AccountType.CREDIT_CARD, initialBalance: 0, currency: 'BRL', closingDay: 25, dueDay: 4, limit: 2000 },
];

const smartphonePurchaseDate = new Date('2024-03-15T00:00:00');
const nubankCard = initialAccounts.find(a => a.id === 'acc-2');
const firstDueDate = calculateCreditCardDueDate(smartphonePurchaseDate, nubankCard!.closingDay!, nubankCard!.dueDay!);

const smartphoneInstallments: Transaction[] = Array.from({ length: 12 }, (_, i) => {
    const installmentDueDate = new Date(firstDueDate);
    installmentDueDate.setMonth(installmentDueDate.getMonth() + i);
    
    // Assuming current month is June 2024, mark installments due before June as paid.
    const isPaid = installmentDueDate.getTime() < new Date('2024-06-01').getTime();

    return {
        id: `t-4-${i + 1}`,
        userId: 'user-1',
        accountId: 'acc-2',
        type: TransactionType.EXPENSE,
        description: `Compra de Smartphone (${i + 1}/12)`,
        amount: 250,
        date: formatDate(installmentDueDate),
        purchaseDate: formatDate(smartphonePurchaseDate),
        category: TransactionCategory.OTHER,
        customCategory: 'Eletrónicos',
        recurrenceType: RecurrenceType.INSTALLMENT,
        installmentCurrent: i + 1,
        installmentTotal: 12,
        isPaid: isPaid,
    };
});

export const initialTransactions: Transaction[] = [
    {
        id: 't-1',
        userId: 'user-1',
        accountId: 'acc-1',
        type: TransactionType.INCOME,
        description: 'Salário de Maio',
        amount: 5000,
        date: '2024-05-01',
        category: TransactionCategory.SALARY,
        recurrenceType: RecurrenceType.RECURRING,
        recurrenceFrequency: RecurrenceFrequency.MONTHLY,
        isPaid: true,
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
        isPaid: false,
    },
    {
        id: 't-3',
        userId: 'user-1',
        accountId: 'acc-1',
        type: TransactionType.EXPENSE,
        description: 'Supermercado',
        amount: 450,
        date: '2024-05-10',
        category: TransactionCategory.FOOD,
        recurrenceType: RecurrenceType.SINGLE,
        isPaid: true,
    },
    ...smartphoneInstallments,
];