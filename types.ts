export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, this should be hashed.
}

export type ThemeName = 'dark' | 'light' | 'synthwave';

export type View = 'dashboard' | 'accounts' | 'transactions' | 'settings';

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export enum TransactionCategory {
    FOOD = 'Alimentação',
    TRANSPORT = 'Transporte',
    HOUSING = 'Moradia',
    BILLS = 'Contas',
    ENTERTAINMENT = 'Lazer',
    HEALTH = 'Saúde',
    INVESTMENTS = 'Investimentos',
    SALARY = 'Salário',
    OTHER = 'Outros',
}

export enum RecurrenceType {
    SINGLE = 'Única',
    RECURRING = 'Recorrente/Fixa',
    INSTALLMENT = 'Parcelada',
}

export enum RecurrenceFrequency {
    DAILY = 'Diária',
    WEEKLY = 'Semanal',
    MONTHLY = 'Mensal',
    YEARLY = 'Anual',
}


export interface Account {
    id: string;
    userId: string;
    name: string;
    initialBalance: number;
    currency: 'BRL' | 'USD' | 'EUR';
}

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: string; // ISO string format like YYYY-MM-DD
    category: TransactionCategory;
    isPaid?: boolean; // New field for payment status
    customCategory?: string;
    recurrenceType?: RecurrenceType;
    recurrenceFrequency?: RecurrenceFrequency;
    installmentCurrent?: number;
    installmentTotal?: number;
}