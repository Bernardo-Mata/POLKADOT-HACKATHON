import { useSyncExternalStore } from 'react';

// Último error de una transacción, para mostrarlo en pantalla hasta que el usuario lo cierre.
let actual: string | null = null;
const suscriptores = new Set<() => void>();

function notificar() {
  suscriptores.forEach((s) => s());
}

export function mostrarError(detalle: string) {
  actual = detalle;
  notificar();
}

export function cerrarError() {
  actual = null;
  notificar();
}

export function useToast(): string | null {
  return useSyncExternalStore(
    (cambio) => {
      suscriptores.add(cambio);
      return () => suscriptores.delete(cambio);
    },
    () => actual,
  );
}

// Convierte cualquier error (Error, objeto del SDK o texto) en una cadena legible.
export function detalleError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e, (_, x) => (typeof x === 'bigint' ? x.toString() : x), 2);
  } catch {
    return String(e);
  }
}
