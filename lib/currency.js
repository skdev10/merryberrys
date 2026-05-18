export const PKR_CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs.';

export function formatPrice(value) {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return `${PKR_CURRENCY_SYMBOL} ${safeAmount.toLocaleString('en-PK', {
    maximumFractionDigits: 0,
  })}`;
}

