export const formatMoney = (minorUnits: number, currencyCode: string): string => {
    const value = minorUnits / 100;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
    }).format(value);
};