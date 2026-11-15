const dateFormatter = new Intl.DateTimeFormat('ca-ES');
const currencyFormatter = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
});
const timeFormatter = new Intl.DateTimeFormat('ca-ES', {
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatTime(value: string): string {
  const timeOnly = /^(\d{1,2}):(\d{2})/.exec(value);
  if (timeOnly) return `${timeOnly[1].padStart(2, '0')}:${timeOnly[2]}`;
  return timeFormatter.format(new Date(value));
}
