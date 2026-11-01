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

// Errores de la cadena que el usuario puede resolver, con qué hacer. `cuenta` es la SS58 del Product.
const AYUDA: Record<string, (cuenta: string) => string> = {
  StorageDepositNotEnoughFunds: (cuenta) =>
    `Tu cuenta no tiene PAS para el depósito de almacenamiento (unos 0.03 PAS por producto o pedido). ` +
    `Pide PAS en faucet.polkadot.io (red Paseo → Asset Hub 1000) para la cuenta ${cuenta} y vuelve a intentar.`,
  StorageDepositLimitExhausted: (cuenta) =>
    `Se agotó el límite de depósito de almacenamiento. Pide PAS para la cuenta ${cuenta} y vuelve a intentar.`,
  AccountUnmapped: (cuenta) => `La cuenta ${cuenta} no está mapeada a una dirección 0x… en la cadena.`,
  OutOfGas: () => 'Se acabó el gas de la app. Vuelve a conectar y acepta el permiso de gas.',
};

// Mensaje para el usuario: la ayuda si el error se conoce, si no la descripción técnica.
export function explainDryRunFailure(method: string, value: unknown, cuenta: string): string {
  const detalle = describeDryRunFailure(value);
  const conocido = Object.keys(AYUDA).find((k) => detalle.split(' › ').includes(k));
  return conocido ? `${method}: ${AYUDA[conocido](cuenta)}` : `${method} falló: ${detalle}`;
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
