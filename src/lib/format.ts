export function formatMxn(cents: bigint): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(cents) / 100);
}

export function formatTimestamp(seconds: bigint): string {
  return new Date(Number(seconds) * 1000).toLocaleString('es-MX');
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// Convierte pesos escritos por el usuario ("35.50") en centavos.
export function pesosToCents(input: string): bigint | null {
  const valor = Number(input);
  if (!Number.isFinite(valor) || valor <= 0) return null;
  return BigInt(Math.round(valor * 100));
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
