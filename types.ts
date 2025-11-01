// Fix: Populate the types file with all necessary type definitions and enums.
// This ensures that components have access to consistent data structures,
// resolving numerous 'is not a module' and 'Cannot find name' errors across the application.

export type ThemeName = 'dark' | 'light' | 'synthwave';

export interface User {
    id: string;
    name: string;
    email: string;
    // Fix: Add the missing 'password' property to the User interface to resolve type errors.
    password: string;
}

export enum AccountType {
    CHECKING = 'Conta Corrente',
    SAVINGS = 'Conta Poupança',
    CREDIT_CARD = 'Cartão de Crédito',
    INVESTMENT = 'Conta de Investimento',
}

export interface Account {
    id: string;
    userId: string;
    name: string;
    type: AccountType;
    initialBalance: number;
    currency: 'BRL' | 'USD' | 'EUR';
    closingDay?: number; // Day of the month the credit card invoice closes
    dueDay?: number; // Day of the month the credit card invoice is due
    limit?: number; // Total credit card limit
}

export enum TransactionType {
    INCOME = 'Receita',
    EXPENSE = 'Despesa',
}

export enum TransactionCategory {
    SALARY = 'Salário',
    HOUSING = 'Moradia',
    FOOD = 'Alimentação',
    TRANSPORTATION = 'Transporte',
    HEALTH = 'Saúde',
    EDUCATION = 'Educação',
    LEISURE = 'Lazer',
    INVESTMENTS = 'Investimentos',
    OTHER = 'Outro',
}

export enum RecurrenceType {
    SINGLE = 'Único',
    RECURRING = 'Recorrente',
    INSTALLMENT = 'Parcelado',
}

export enum RecurrenceFrequency {
    DAILY = 'Diário',
    WEEKLY = 'Semanal',
    MONTHLY = 'Mensal',
    YEARLY = 'Anual',
}

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD (Represents due date for credit cards)
    purchaseDate?: string; // YYYY-MM-DD (For credit card purchases)
    category: TransactionCategory;
    customCategory?: string;
    isPaid?: boolean;
    recurrenceType?: RecurrenceType;
    recurrenceFrequency?: RecurrenceFrequency;
    installmentCurrent?: number;
    installmentTotal?: number;
}