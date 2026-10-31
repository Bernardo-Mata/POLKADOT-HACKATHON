import type { Session } from '../hub/hub';

// Espejo de enum Status de contracts/CampusChain.sol (NONE = 0 significa "no existe").
export const STATUS_LABEL = [
  'Sin registro',
  'Creado',
  'Aceptado',
  'Pago reportado por vendedor',
  'Entrega declarada',
  'Completado',
  'Cancelado',
] as const;

export type Product = {
  id: bigint;
  seller: string;
  name: string;
  category: string;
  pickupPoint: string;
  priceCents: bigint;
  available: boolean;
};

export type Order = {
  id: string; // bytes32 en hex
  productId: bigint;
  buyer: string;
  seller: string;
  quantity: bigint;
  totalCents: bigint;
  status: number;
  createdAt: bigint;
};

export type HistoryEntry = { status: number; changedBy: string; timestamp: bigint };

export type SellerStats = { accepted: bigint; completed: bigint; cancelled: bigint };

type Result<T> = { success: true; value: T } | { success: false; value: unknown };

// Métodos que devuelve createContract de @parity/product-sdk: .query() simula, .tx() firma.
// Los argumentos se tipan como any[] porque el SDK genera la firma desde la ABI en tiempo de ejecución.
type Method = {
  query: (...args: any[]) => Promise<Result<unknown>>;
  tx: (...args: any[]) => Promise<{ ok: boolean; error?: unknown }>;
};

function contractMethod(session: Session, name: string): Method {
  return (session.contract as unknown as Record<string, Method>)[name];
}

// Lectura: devuelve el valor o lanza con el motivo del revert.
async function read<T>(session: Session, name: string, ...args: unknown[]): Promise<T> {
  const r = await contractMethod(session, name).query(...args, { origin: session.address });
  if (!r.success) throw new Error(`${name} revirtió: ${String(r.value)}`);
  return r.value as T;
}

// Escritura: simula primero (sin firma), luego firma y espera la transacción finalizada.
// Así un revert se muestra sin pedir firma al usuario en el Host.
export async function write(session: Session, name: string, ...args: unknown[]): Promise<void> {
  const method = contractMethod(session, name);
  const preview = await method.query(...args, { origin: session.address });
  if (!preview.success) throw new Error(`${name} revirtió: ${String(preview.value)}`);

  const sent = await method.tx(...args, {
    waitFor: 'finalized',
    timeoutMs: 300_000,
  });
  if (!sent.ok) throw sent.error instanceof Error ? sent.error : new Error(`${name} falló`);
}

export async function isStudent(session: Session, account: string): Promise<boolean> {
  return read<boolean>(session, 'isStudent', account);
}

export async function listProducts(session: Session): Promise<Product[]> {
  const count = await read<bigint>(session, 'productCount');
  const items: Product[] = [];
  for (let id = 1n; id <= count; id++) {
    const [seller, name, category, pickupPoint, priceCents, available] = await read<
      [string, string, string, string, bigint, boolean]
    >(session, 'getProduct', id);
    items.push({ id, seller, name, category, pickupPoint, priceCents, available });
  }
  return items;
}

export async function getOrder(session: Session, orderId: string): Promise<Order> {
  const [productId, buyer, seller, quantity, totalCents, status, createdAt] = await read<
    [bigint, string, string, bigint, bigint, number, bigint]
  >(session, 'getOrder', orderId);
  return { id: orderId, productId, buyer, seller, quantity, totalCents, status, createdAt };
}

export async function getHistory(session: Session, orderId: string): Promise<HistoryEntry[]> {
  return read<HistoryEntry[]>(session, 'getHistory', orderId);
}

// Los mapas del contrato usan msg.sender, que es la dirección 0x… (H160) de la cuenta del Product.
export async function getBuyerOrderIds(session: Session): Promise<string[]> {
  return read<string[]>(session, 'getBuyerOrders', session.h160);
}

export async function getSellerOrderIds(session: Session): Promise<string[]> {
  return read<string[]>(session, 'getSellerOrders', session.h160);
}

export async function getSellerStats(session: Session, seller: string): Promise<SellerStats> {
  const [accepted, completed, cancelled] = await read<[bigint, bigint, bigint]>(
    session,
    'getSellerStats',
    seller,
  );
  return { accepted, completed, cancelled };
}

// orderId bytes32 aleatorio, en hex. Lo genera el comprador antes de llamar a createOrder.
export function newOrderId(): `0x${string}` {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}
