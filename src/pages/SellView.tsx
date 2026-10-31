import { useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import type { Session } from '../hub/hub';
import { getProduct, write } from '../contract/campusChain';
import { asegurarVendedor, guardarProducto, intentarCopia } from '../firebase/db';
import { errorMessage, pesosToCents } from '../lib/format';

export function SellView({ session, usuario }: { session: Session; usuario: User }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [punto, setPunto] = useState('');
  const [precio, setPrecio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function publicar(e: FormEvent) {
    e.preventDefault();
    const priceCents = pesosToCents(precio);
    if (!priceCents) {
      setError('El precio debe ser mayor que cero.');
      return;
    }
    setEnviando(true);
    setError(null);
    setMensaje(null);
    try {
      const id = (await write(
        session,
        'createProduct',
        nombre.trim(),
        descripcion.trim(),
        categoria.trim(),
        punto.trim(),
        priceCents,
      )) as bigint;
      setMensaje(`Producto publicado: ${nombre.trim()}.`);

      // El id viene de la simulación: se confirma que ese producto es el que acaba de publicar esta cuenta.
      const aviso = await intentarCopia(async () => {
        const producto = await getProduct(session, id);
        if (producto.seller.toLowerCase() !== session.h160.toLowerCase() || producto.name !== nombre.trim()) {
          throw new Error('no se pudo confirmar el id del producto');
        }
        await asegurarVendedor(usuario, session.h160);
        await guardarProducto(usuario, producto);
      });
      if (aviso) setError(aviso);
      setNombre('');
      setDescripcion('');
      setCategoria('');
      setPunto('');
      setPrecio('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="formulario">
      <h2>Publicar producto</h2>
      <form onSubmit={publicar}>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Descripción
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} required />
        </label>
        <label>
          Categoría
          <input value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
        </label>
        <label>
          Punto de entrega
          <input
            value={punto}
            onChange={(e) => setPunto(e.target.value)}
            placeholder="Biblioteca, Explanada, Facultad…"
            required
          />
        </label>
        <label>
          Precio (MXN)
          <input value={precio} onChange={(e) => setPrecio(e.target.value)} inputMode="decimal" required />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Firmando…' : 'Publicar'}
        </button>
      </form>
      {error && <p className="aviso error">{error}</p>}
      {mensaje && <p className="aviso ok">{mensaje}</p>}
    </section>
  );
}
