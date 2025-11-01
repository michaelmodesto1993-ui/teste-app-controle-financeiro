export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, this would be a hash.
}

export interface Account {
    id: string;
    userId: string;
    name: string;
    initialBalance: number;
    currency: string;
}

export enum TransactionType {
    INCOME = 'Receita',
    EXPENSE = 'Despesa',
}

export enum TransactionCategory {
    SALARY = 'Salário',
    INVESTMENTS = 'Investimentos',
    HOUSING = 'Moradia',
    FOOD = 'Alimentação',
    TRANSPORT = 'Transporte',
    HEALTH = 'Saúde',
    EDUCATION = 'Educação',
    LEISURE = 'Lazer',
    OTHER = 'Outros',
}

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: string; // ISO string format
    category: TransactionCategory;
}

// Defines the possible views in the main dashboard layout.
export type View = 'dashboard' | 'accounts' | 'transactions' | 'settings';
