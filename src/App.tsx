import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { connectSession, OutsideHostError, type Session } from './hub/hub';
import { cerrarSesion, sesionGuardada } from './firebase/auth';
import { intentarCopia, vincularWallet } from './firebase/db';
import { errorMessage } from './lib/format';
import { AuthView } from './pages/AuthView';
import { CatalogView } from './pages/CatalogView';
import { SellView } from './pages/SellView';
import { OrdersView } from './pages/OrdersView';

type Tab = 'catalogo' | 'vender' | 'pedidos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'vender', label: 'Vender' },
  { id: 'pedidos', label: 'Pedidos' },
];

export function App() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [revisandoSesion, setRevisandoSesion] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>('catalogo');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sesionGuardada()
      .then(setUsuario)
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setRevisandoSesion(false));
  }, []);

  async function conectar() {
    if (!usuario) return;
    setConnecting(true);
    setError(null);
    try {
      const nueva = await connectSession();
      setSession(nueva);
      const aviso = await intentarCopia(() => vincularWallet(usuario, nueva.h160));
      if (aviso) setError(aviso);
    } catch (e) {
      setError(e instanceof OutsideHostError ? e.message : `No se pudo conectar: ${String(e)}`);
    } finally {
      setConnecting(false);
    }
  }

  async function salir() {
    await cerrarSesion();
    setUsuario(null);
    setSession(null);
    setError(null);
  }

  if (revisandoSesion) {
    return (
      <main className="app">
        <p className="aviso">Cargando…</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className="app">
        <header className="cabecera">
          <h1>CampusChain</h1>
        </header>
        {error && <p className="aviso error">{error}</p>}
        <AuthView
          onListo={(u) => {
            setError(null);
            setUsuario(u);
          }}
        />
        <footer className="pie">Versión {__BUILD__}</footer>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="cabecera">
        <h1>CampusChain</h1>
        <span className="cuenta">{usuario.email}</span>
        {session ? (
          <span className="cuenta" title={session.address}>
            {session.dappName} · {session.address.slice(0, 8)}…
          </span>
        ) : (
          <button onClick={conectar} disabled={connecting}>
            {connecting ? 'Conectando…' : 'Conectar cuenta'}
          </button>
        )}
        <button className="secundario" onClick={salir}>
          Cerrar sesión
        </button>
      </header>

      {error && <p className="aviso error">{error}</p>}

      {session && (
        <p className="pequeno">
          Tu cuenta del Product (para pedir PAS en el faucet): <code>{session.address}</code>
        </p>
      )}

      {session && session.gas !== 'Allocated' && (
        <p className="aviso error">
          El Host no asignó gas a la app ({session.gas}). Publicar y pedir van a fallar: vuelve a conectar y acepta el
          permiso de gas.
        </p>
      )}

      {!session && !error && (
        <p className="aviso">
          Conecta tu cuenta desde Polkadot Desktop o la Polkadot App para usar el marketplace.
        </p>
      )}

      {session && (
        <>
          <nav className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={t.id === tab ? 'activa' : ''}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {tab === 'catalogo' && <CatalogView session={session} usuario={usuario} />}
          {tab === 'vender' && <SellView session={session} usuario={usuario} />}
          {tab === 'pedidos' && <OrdersView session={session} usuario={usuario} />}
        </>
      )}

      <footer className="pie">
        Pago reportado por el vendedor: CampusChain registra declaraciones, no verifica transferencias.
        <br />
        Versión {__BUILD__}
      </footer>
    </main>
  );
}
