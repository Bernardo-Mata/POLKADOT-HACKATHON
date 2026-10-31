import type { User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firebase } from './config';
import { mensajeFirebase, USUARIOS } from './auth';
import type { Product } from '../contract/campusChain';

// Firestore guarda una copia de consulta de lo que pasa en el contrato, ligada a la cuenta UANL.
// La fuente de verdad sigue siendo CampusChain.sol: si la copia falla, la transacción no se deshace.
//
// Colecciones:
//   usuarios/{uid}                       registro del estudiante (auth.ts)
//   vendedores/{uid}                     perfil del vendedor: correo y wallet con la que publica
//   productos/{productId}                productId = id del contrato
//   pedidos/{orderId}                    orderId = bytes32 del contrato
//   pedidos/{orderId}/eventos/{auto}     cada cambio de estado, con quién lo hizo
export const VENDEDORES = 'vendedores';
export const PRODUCTOS = 'productos';
export const PEDIDOS = 'pedidos';
export const EVENTOS = 'eventos';

export async function intentarCopia(fn: () => Promise<void>): Promise<string | null> {
  try {
    await fn();
    return null;
  } catch (e) {
    return `Quedó registrado en el contrato, pero no en Firebase: ${mensajeFirebase(e)}`;
  }
}

export async function vincularWallet(user: User, wallet: string): Promise<void> {
  await updateDoc(doc(firebase().db, USUARIOS, user.uid), { wallet: wallet.toLowerCase() });
}

// Se crea la primera vez que el estudiante publica. Las métricas no se guardan aquí:
// salen de los pedidos y del contrato, para que el vendedor no pueda escribirlas.
export async function asegurarVendedor(user: User, wallet: string): Promise<void> {
  const ref = doc(firebase().db, VENDEDORES, user.uid);
  const w = wallet.toLowerCase();
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { uid: user.uid, email: user.email, wallet: w, activo: true, creadoEn: serverTimestamp() });
  } else if (snap.data().wallet !== w) {
    await updateDoc(ref, { wallet: w });
  }
}

export async function guardarProducto(user: User, p: Product): Promise<void> {
  await setDoc(doc(firebase().db, PRODUCTOS, p.id.toString()), {
    productId: p.id.toString(),
    vendedorUid: user.uid,
    vendedorWallet: p.seller.toLowerCase(),
    nombre: p.name,
    descripcion: p.description,
    categoria: p.category,
    puntoEntrega: p.pickupPoint,
    precioCents: Number(p.priceCents),
    disponible: p.available,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
}

export async function actualizarDisponibilidad(productId: bigint, disponible: boolean): Promise<void> {
  await updateDoc(doc(firebase().db, PRODUCTOS, productId.toString()), {
    disponible,
    actualizadoEn: serverTimestamp(),
  });
}

export type NuevoPedido = {
  orderId: string;
  productId: bigint;
  cantidad: bigint;
  totalCents: bigint;
  orderHash: string;
  compradorWallet: string;
  vendedorWallet: string;
};

async function agregarEvento(user: User, orderId: string, estado: number, wallet: string): Promise<void> {
  await addDoc(collection(firebase().db, PEDIDOS, orderId, EVENTOS), {
    estado,
    porUid: user.uid,
    porWallet: wallet.toLowerCase(),
    en: serverTimestamp(),
  });
}

export async function guardarPedido(user: User, p: NuevoPedido): Promise<void> {
  const db = firebase().db;
  // El uid del vendedor sale de su producto; los productos publicados antes de Firebase no lo tienen.
  const producto = await getDoc(doc(db, PRODUCTOS, p.productId.toString()));
  await setDoc(doc(db, PEDIDOS, p.orderId), {
    orderId: p.orderId,
    productId: p.productId.toString(),
    compradorUid: user.uid,
    vendedorUid: producto.exists() ? producto.data().vendedorUid : null,
    compradorWallet: p.compradorWallet.toLowerCase(),
    vendedorWallet: p.vendedorWallet.toLowerCase(),
    cantidad: Number(p.cantidad),
    totalCents: Number(p.totalCents),
    orderHash: p.orderHash,
    estado: 1, // CREATED
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
  });
  await agregarEvento(user, p.orderId, 1, p.compradorWallet);
}

// estado sigue el enum Status del contrato (2 ACCEPTED … 6 CANCELLED).
export async function registrarEstado(user: User, orderId: string, estado: number, wallet: string): Promise<void> {
  await updateDoc(doc(firebase().db, PEDIDOS, orderId), { estado, actualizadoEn: serverTimestamp() });
  await agregarEvento(user, orderId, estado, wallet);
}
