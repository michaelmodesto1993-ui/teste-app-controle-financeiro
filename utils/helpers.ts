// Fix: Implement helper functions for formatting currency and dates.
// These utilities are used across multiple components for consistent data presentation,
// and implementing them resolves the 'is not a module' error for this file.

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    // Adjust for timezone issues where `new Date('2024-05-01')` might become the previous day in UTC.
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toISOString().split('T')[0];
};

export const formatDateReadable = (dateString: string): string => {
    // Assuming dateString is 'YYYY-MM-DD'
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatDateRelative = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Vence hoje';
    } else if (diffDays > 0) {
        return `Vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else {
        return `Vencido há ${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? 's' : ''}`;
    }
};

export const formatMonthYear = (date: Date): string => {
    const formatted = date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });
    // Capitalize the first letter for consistent styling.
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};


export const calculateCreditCardDueDate = (purchaseDate: Date, closingDay: number, dueDay: number): Date => {
    const pDate = new Date(purchaseDate.getTime()); // Clone to avoid mutation
    const pDay = pDate.getDate();
    const pMonth = pDate.getMonth();
    const pYear = pDate.getFullYear();

    // Set due date to the current month of the purchase
    const dueDate = new Date(pYear, pMonth, dueDay);

    // If purchase day is after closing day, the due date is in the next month
    if (pDay > closingDay) {
        dueDate.setMonth(dueDate.getMonth() + 1);
    }

    return dueDate;
};