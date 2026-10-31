// Convierte el `value` de un `.query()` fallido en texto legible.
// El SDK entrega dos formas (ver QueryResult en @parity/product-sdk-contracts):
//   - revert del contrato: { type: 'ContractRevertedWithPayload', reason?, decoded?: { errorName, args } }
//   - error de la cadena, enum anidado: { type: 'Module', value: { type: 'Revive', value: { type: 'AccountUnmapped' } } }
export function describeDryRunFailure(value: unknown): string {
  if (value === null || value === undefined) return 'sin detalle';
  if (typeof value !== 'object') return String(value);

  const v = value as { type?: unknown; value?: unknown; reason?: unknown; decoded?: { errorName?: unknown; args?: unknown } };
  if (v.type === 'ContractRevertedWithPayload') {
    if (v.decoded?.errorName) return `${String(v.decoded.errorName)}${formatArgs(v.decoded.args)}`;
    if (v.reason) return String(v.reason);
    return 'el contrato revirtió sin motivo';
  }

  const ruta: string[] = [];
  let actual: unknown = value;
  while (actual && typeof actual === 'object' && typeof (actual as { type?: unknown }).type === 'string') {
    ruta.push((actual as { type: string }).type);
    actual = (actual as { value?: unknown }).value;
  }
  if (ruta.length > 0) return ruta.join(' › ');
  return safeJson(value);
}

function formatArgs(args: unknown): string {
  return Array.isArray(args) && args.length > 0 ? `(${args.map(String).join(', ')})` : '';
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, (_k, x) => (typeof x === 'bigint' ? x.toString() : x));
  } catch {
    return String(value);
  }
}
