import { useState, type FormEvent } from 'react';
import type { Session } from '../hub/hub';
import { write } from '../contract/campusChain';
import { errorMessage, pesosToCents } from '../lib/format';

export function SellView({ session }: { session: Session }) {
  const [nombre, setNombre] = useState('');
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
      await write(session, 'createProduct', nombre.trim(), categoria.trim(), punto.trim(), priceCents);
      setMensaje(`Producto publicado: ${nombre.trim()}.`);
      setNombre('');
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
      <p className="pequeno">Solo cuentas de estudiante verificado (demo) pueden publicar.</p>
      <form onSubmit={publicar}>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
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
