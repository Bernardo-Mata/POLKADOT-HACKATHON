// El SDK (@parity/product-sdk-tx, isSigningRejection) cambia cualquier error del Host cuyo texto
// diga "rejected", "denied" o "cancelled" por "Transaction signing was rejected." y pierde el motivo.
// hub.ts guarda el error original del firmante; aquí se convierte en texto para el usuario.

// Mensaje del error y de sus `cause`, sin repetir. Los errores del Host traen la etiqueta en cause.
export function describeHostError(error: unknown): string {
  const partes: string[] = [];
  let actual: unknown = error;
  for (let i = 0; actual !== undefined && actual !== null && i < 5; i++) {
    const texto = actual instanceof Error ? actual.message : typeof actual === 'object' ? safeJson(actual) : String(actual);
    if (texto && !partes.some((p) => p.includes(texto))) partes.push(texto);
    actual = (actual as { cause?: unknown }).cause;
  }
  return partes.length > 0 ? partes.join(' · ') : 'sin detalle';
}

// `original` es lo que lanzó el firmante del Host (undefined si el fallo vino de otro lado).
export function explainTxFailure(method: string, error: unknown, original: unknown): string {
  const detalle = describeHostError(original ?? error);
  const permiso = /PermissionDenied|NotAllowed|ChainSubmit|not allowed|permission/i.test(detalle);
  if (permiso) {
    return (
      `${method}: el Host no dio permiso a la app para enviar transacciones. ` +
      `Pulsa "Cerrar sesión", vuelve a entrar, conecta la cuenta y acepta el permiso de transacciones. (${detalle})`
    );
  }
  if (original !== undefined) return `${method}: el Host no firmó la transacción. Motivo: ${detalle}`;
  return `${method} falló: ${detalle}`;
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, (_k, x) => (typeof x === 'bigint' ? x.toString() : x instanceof Uint8Array ? '[bytes]' : x));
  } catch {
    return String(value);
  }
}
