export const formatCurrency = (amount: number, currency: 'BRL' | 'USD' | 'EUR' = 'BRL'): string => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    // Input is ISO string, output should be YYYY-MM-DD for date inputs
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '';
    }
    return date.toISOString().split('T')[0];
};

export const formatDateReadable = (dateString: string): string => {
    // Input is ISO string, output should be human-readable
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Data inválida';
    }
    // Adding timeZone to avoid off-by-one day errors due to UTC conversion
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
};
