import { useState } from 'react';
import { connectSession, OutsideHostError, type Session } from './hub/hub';
import { CatalogView } from './pages/CatalogView';
import { SellView } from './pages/SellView';
import { OrdersView } from './pages/OrdersView';
import { Toast } from './components/Toast';

type Tab = 'catalogo' | 'vender' | 'pedidos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'vender', label: 'Vender' },
  { id: 'pedidos', label: 'Pedidos' },
];

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>('catalogo');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function conectar() {
    setConnecting(true);
    setError(null);
    try {
      setSession(await connectSession());
    } catch (e) {
      setError(e instanceof OutsideHostError ? e.message : `No se pudo conectar: ${String(e)}`);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="app">
      <header className="cabecera">
        <h1>CampusChain</h1>
        {session ? (
          <span className="cuenta" title={session.address}>
            {session.dappName} · {session.address.slice(0, 8)}…
          </span>
        ) : (
          <button onClick={conectar} disabled={connecting}>
            {connecting ? 'Conectando…' : 'Conectar cuenta'}
          </button>
        )}
      </header>

      {error && <p className="aviso error">{error}</p>}

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
          {tab === 'catalogo' && <CatalogView session={session} />}
          {tab === 'vender' && <SellView session={session} />}
          {tab === 'pedidos' && <OrdersView session={session} />}
        </>
      )}

      <Toast />

      <footer className="pie">
        Pago reportado por el vendedor: CampusChain registra declaraciones, no verifica transferencias.
      </footer>
    </main>
  );
}
