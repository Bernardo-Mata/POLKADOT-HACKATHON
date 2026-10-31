import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Configuración web del proyecto (Firebase console → Project settings → Your apps).
// No es secreta: la protección de los datos está en firestore.rules.
const CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

let instancia: { auth: Auth; db: Firestore } | null = null;

// Se inicializa al primer uso para que una .env incompleta dé un mensaje claro y no rompa el arranque.
export function firebase(): { auth: Auth; db: Firestore } {
  if (instancia) return instancia;
  const faltan = Object.entries(CONFIG)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);
  if (faltan.length > 0) {
    throw new Error(`Falta configurar Firebase en .env (${faltan.join(', ')}). Ver .env.example.`);
  }
  const app = initializeApp(CONFIG);
  instancia = { auth: getAuth(app), db: getFirestore(app) };
  return instancia;
}
