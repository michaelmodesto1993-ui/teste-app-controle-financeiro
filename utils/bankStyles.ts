// A map of bank names to their brand colors.
const bankColors: Record<string, string> = {
    'Itaú Unibanco': '#EC7000',       // Orange
    'Nubank': '#820AD1',             // Purple
    'Santander': '#EC0000',          // Red
    'Caixa Econômica Federal': '#0062A8', // Blue
    'Bradesco': '#CC092F',           // Red
    'Banco do Brasil': '#0033A0',     // Blue (Using a more contrast-friendly blue)
    'Inter': '#FF7A00',              // Orange
    'C6 Bank': '#262626',            // Black/Gray
    'Original': '#00A78E',           // Green
    // Default color for 'Outro' and any other unlisted banks
    'default': '#6b7280'             // Gray
};

export const getBankColor = (bankName: string): string => {
    return bankColors[bankName] || bankColors['default'];
};
