export const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (dateString: string) => {
    // Retorna a data no formato YYYY-MM-DD para o input de data
    return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const formatDateReadable = (dateString: string) => {
    // Retorna a data no formato legível para o utilizador
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};