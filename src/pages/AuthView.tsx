import { useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { iniciarSesion, registrar } from '../firebase/auth';
import { DOMINIO_UANL, MIN_PASSWORD, validarCredenciales } from '../lib/registro';
import { errorMessage } from '../lib/format';

type Modo = 'login' | 'registro';

export function AuthView({ onListo }: { onListo: (usuario: User) => void }) {
  const [modo, setModo] = useState<Modo>('login');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo);
    setError(null);
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const motivo = validarCredenciales(correo, password);
    if (motivo) {
      setError(motivo);
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      onListo(modo === 'registro' ? await registrar(correo, password) : await iniciarSesion(correo, password));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="formulario">
      <nav className="tabs">
        <button type="button" className={modo === 'login' ? 'activa' : ''} onClick={() => cambiarModo('login')}>
          Iniciar sesión
        </button>
        <button type="button" className={modo === 'registro' ? 'activa' : ''} onClick={() => cambiarModo('registro')}>
          Registrarme
        </button>
      </nav>
      <h2>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
      <p className="pequeno">Solo para estudiantes con correo {DOMINIO_UANL}.</p>
      <form onSubmit={enviar} noValidate>
        <label>
          Correo institucional
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder={`matricula${DOMINIO_UANL}`}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            minLength={MIN_PASSWORD}
            required
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : modo === 'login' ? 'Entrar' : 'Registrarme'}
        </button>
      </form>
      {error && <p className="aviso error">{error}</p>}
    </section>
  );
}
