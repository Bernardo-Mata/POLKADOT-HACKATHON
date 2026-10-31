import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { firebase } from './config';
import { normalizarCorreo, validarCredenciales } from '../lib/registro';

// Colección con un documento por estudiante registrado. Id = uid de Firebase Auth.
export const USUARIOS = 'usuarios';

export type Usuario = {
  email: string;
  rol: 'estudiante';
  wallet: string | null; // H160 de la cuenta del Product, cuando se conecta
};

const MENSAJES: Record<string, string> = {
  'auth/email-already-in-use': 'Ese correo ya está registrado. Inicia sesión.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentar.',
  'auth/network-request-failed': 'No hay conexión con Firebase.',
  'auth/operation-not-allowed': 'Activa Email/Password en Firebase Authentication.',
  'permission-denied': 'Firestore rechazó la operación. Revisa que las reglas estén desplegadas.',
};

export function mensajeFirebase(e: unknown): string {
  if (e instanceof FirebaseError) return MENSAJES[e.code] ?? `Firebase: ${e.code}`;
  return e instanceof Error ? e.message : String(e);
}

// Segundo filtro: la cuenta de Auth debe tener su registro en Firestore con el mismo correo.
async function tieneRegistro(user: User): Promise<boolean> {
  const snap = await getDoc(doc(firebase().db, USUARIOS, user.uid));
  return snap.exists() && snap.data().email === normalizarCorreo(user.email ?? '');
}

export async function registrar(correo: string, password: string): Promise<User> {
  const motivo = validarCredenciales(correo, password);
  if (motivo) throw new Error(motivo);

  const { auth, db } = firebase();
  const email = normalizarCorreo(correo);
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const registro: Usuario = { email, rol: 'estudiante', wallet: null };
    try {
      await setDoc(doc(db, USUARIOS, user.uid), { ...registro, creadoEn: serverTimestamp() });
    } catch (e) {
      // Sin el documento, el login lo rechazaría: se borra la cuenta para que pueda registrarse de nuevo.
      await deleteUser(user).catch(() => signOut(auth));
      throw e;
    }
    return user;
  } catch (e) {
    throw new Error(mensajeFirebase(e));
  }
}

// Firebase Auth compara la contraseña con la del registro (nunca se guarda en Firestore).
export async function iniciarSesion(correo: string, password: string): Promise<User> {
  const motivo = validarCredenciales(correo, password);
  if (motivo) throw new Error(motivo);

  const { auth } = firebase();
  try {
    const { user } = await signInWithEmailAndPassword(auth, normalizarCorreo(correo), password);
    if (!(await tieneRegistro(user))) {
      await signOut(auth);
      throw new Error('Esta cuenta no tiene registro en CampusChain. Regístrate primero.');
    }
    return user;
  } catch (e) {
    throw new Error(mensajeFirebase(e));
  }
}

// Al abrir la app: recupera la sesión anterior solo si sigue teniendo registro.
export async function sesionGuardada(): Promise<User | null> {
  const { auth } = firebase();
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return null;
  if (await tieneRegistro(user)) return user;
  await signOut(auth);
  return null;
}

export async function cerrarSesion(): Promise<void> {
  await signOut(firebase().auth);
}
