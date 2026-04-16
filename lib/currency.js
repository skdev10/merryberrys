/** All product & order amounts in the database are stored as PKR. */

export const FREE_SHIPPING_MIN_PKR = 55000;
export const STANDARD_SHIPPING_PKR = 500;

export function formatPKR(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 'PKR 0';
  return `PKR ${Math.round(n).toLocaleString('en-PK')}`;
}

export function formatPKRDecimal(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 'PKR 0.00';
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
