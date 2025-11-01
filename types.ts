export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Stored for simplicity in this example
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
    FOOD = 'Alimentação',
    TRANSPORT = 'Transporte',
    HOUSING = 'Moradia',
    BILLS = 'Contas',
    LEISURE = 'Lazer',
    HEALTH = 'Saúde',
    SALARY = 'Salário',
    INVESTMENTS = 'Investimentos',
    OTHER = 'Outros',
}

export interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: string; // ISO string
    category: TransactionCategory;
}
