import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { Session } from '../hub/hub';
import { getSellerStats, listProducts, newOrderId, write, type Product, type SellerStats } from '../contract/campusChain';
import { actualizarDisponibilidad, guardarPedido, intentarCopia } from '../firebase/db';
import { errorMessage, formatMxn, shortAddress } from '../lib/format';
import { computeOrderHash } from '../lib/orderHash';

type Card = Product & { sellerStats: SellerStats };

export function CatalogView({ session, usuario }: { session: Session; usuario: User }) {
  const [items, setItems] = useState<Card[] | null>(null);
  const [busy, setBusy] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function cargar() {
    try {
      const productos = await listProducts(session);
      const tarjetas = await Promise.all(
        productos.map(async (p) => ({
          ...p,
          sellerStats: await getSellerStats(session, p.seller),
        })),
      );
      setItems(tarjetas);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function pedir(producto: Product) {
    setBusy(producto.id);
    setError(null);
    setMensaje(null);
    try {
      const orderId = newOrderId();
      const orderHash = computeOrderHash({
        orderId,
        productId: producto.id,
        quantity: 1n,
        unitPriceCents: producto.priceCents,
        buyer: session.h160,
        seller: producto.seller as `0x${string}`,
      });
      await write(session, 'createOrder', orderId, producto.id, 1n, orderHash);
      setMensaje(`Pedido creado: ${producto.name}. Revísalo en Pedidos.`);
      const aviso = await intentarCopia(() =>
        guardarPedido(usuario, {
          orderId,
          productId: producto.id,
          cantidad: 1n,
          totalCents: producto.priceCents,
          orderHash,
          compradorWallet: session.h160,
          vendedorWallet: producto.seller,
        }),
      );
      if (aviso) setError(aviso);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  async function cambiarDisponibilidad(producto: Product) {
    setBusy(producto.id);
    setError(null);
    setMensaje(null);
    try {
      await write(session, 'setAvailable', producto.id, !producto.available);
      const aviso = await intentarCopia(() => actualizarDisponibilidad(producto.id, !producto.available));
      if (aviso) setError(aviso);
      await cargar();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  if (error && !items) return <p className="aviso error">{error}</p>;
  if (!items) return <p className="aviso">Cargando catálogo…</p>;
  if (items.length === 0) return <p className="aviso">Todavía no hay productos publicados.</p>;

  return (
    <section>
      {error && <p className="aviso error">{error}</p>}
      {mensaje && <p className="aviso ok">{mensaje}</p>}
      <div className="grid">
        {items.map((p) => (
          <article key={p.id.toString()} className="tarjeta">
            <h2>{p.name}</h2>
            <p className="precio">{formatMxn(p.priceCents)}</p>
            <p>{p.description}</p>
            <p>{p.category} · Entrega: {p.pickupPoint}</p>
            <p className="pequeno">Vendedor {shortAddress(p.seller)}</p>
            <p className="pequeno">
              Completados {p.sellerStats.completed.toString()} · Aceptados {p.sellerStats.accepted.toString()} ·
              Cancelados {p.sellerStats.cancelled.toString()}
            </p>
            {p.sellerStats.accepted > 0n && (
              <p className="pequeno">
                Tasa de finalización: {((Number(p.sellerStats.completed) / Number(p.sellerStats.accepted)) * 100).toFixed(0)}%
              </p>
            )}
            <button
              disabled={!p.available || p.seller === session.h160 || busy !== null}
              onClick={() => pedir(p)}
            >
              {!p.available ? 'No disponible' : p.seller === session.h160 ? 'Tu producto' : busy === p.id ? 'Firmando…' : 'Pedir'}
            </button>
            {p.seller === session.h160 && (
              <button className="secundario" disabled={busy !== null} onClick={() => cambiarDisponibilidad(p)}>
                {p.available ? 'Marcar no disponible' : 'Marcar disponible'}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
