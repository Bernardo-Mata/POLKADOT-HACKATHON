import { useEffect, useState } from 'react';
import type { Session } from '../hub/hub';
import {
  getBuyerOrderIds,
  getHistory,
  getOrder,
  getSellerOrderIds,
  STATUS_LABEL,
  write,
  type HistoryEntry,
  type Order,
} from '../contract/campusChain';
import { errorMessage, formatMxn, formatTimestamp, shortAddress } from '../lib/format';

type Action = { label: string; method: string };

// Quién puede hacer qué según el estado. El contrato vuelve a validar rol y estado.
function accionesPara(order: Order, rol: 'comprador' | 'vendedor'): Action[] {
  if (rol === 'vendedor') {
    if (order.status === 1) return [{ label: 'Aceptar pedido', method: 'acceptOrder' }];
    if (order.status === 2) return [{ label: 'Declarar pago recibido', method: 'reportPayment' }];
    if (order.status === 3) return [{ label: 'Marcar como entregado', method: 'confirmDelivery' }];
    return [];
  }
  if (order.status === 1) return [{ label: 'Cancelar pedido', method: 'cancelOrder' }];
  if (order.status === 4) return [{ label: 'Confirmar recepción', method: 'completeOrder' }];
  return [];
}

type Row = { order: Order; history: HistoryEntry[] };

export function OrdersView({ session }: { session: Session }) {
  const [compras, setCompras] = useState<Row[] | null>(null);
  const [ventas, setVentas] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function cargarFilas(ids: string[]): Promise<Row[]> {
    return Promise.all(
      ids.map(async (id) => ({
        order: await getOrder(session, id),
        history: await getHistory(session, id),
      })),
    );
  }

  async function cargar() {
    try {
      setCompras(await cargarFilas(await getBuyerOrderIds(session)));
      setVentas(await cargarFilas(await getSellerOrderIds(session)));
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function ejecutar(orderId: string, action: Action) {
    setBusy(orderId);
    setError(null);
    try {
      await write(session, action.method, orderId);
      await cargar();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  function bloque(titulo: string, filas: Row[] | null, rol: 'comprador' | 'vendedor') {
    return (
      <section>
        <h2>{titulo}</h2>
        {filas === null && <p className="aviso">Cargando…</p>}
        {filas?.length === 0 && <p className="aviso">Sin pedidos.</p>}
        {filas?.map(({ order, history }) => (
          <article key={order.id} className="tarjeta">
            <p>
              <strong>{STATUS_LABEL[order.status]}</strong> · {formatMxn(order.totalCents)} · {order.quantity.toString()} u.
            </p>
            <p className="pequeno">
              Comprador {shortAddress(order.buyer)} · Vendedor {shortAddress(order.seller)} · ID {order.id.slice(0, 10)}…
            </p>
            <ol className="historial">
              {history.map((h, i) => (
                <li key={i}>
                  {STATUS_LABEL[h.status]} · {shortAddress(h.changedBy)} · {formatTimestamp(h.timestamp)}
                </li>
              ))}
            </ol>
            {accionesPara(order, rol).map((a) => (
              <button key={a.method} disabled={busy !== null} onClick={() => ejecutar(order.id, a)}>
                {busy === order.id ? 'Firmando…' : a.label}
              </button>
            ))}
          </article>
        ))}
      </section>
    );
  }

  return (
    <div>
      <button className="secundario" onClick={cargar} disabled={busy !== null}>
        Actualizar
      </button>
      {error && <p className="aviso error">{error}</p>}
      {bloque('Mis compras', compras, 'comprador')}
      {bloque('Mis ventas', ventas, 'vendedor')}
    </div>
  );
}
