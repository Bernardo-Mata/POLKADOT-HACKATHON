export const DOMINIO_UANL = '@uanl.edu.mx';

// Firebase Authentication no acepta contraseñas de menos de 6 caracteres.
export const MIN_PASSWORD = 6;

export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

// Un solo "@" y algo antes del dominio: "a@b@uanl.edu.mx" o "@uanl.edu.mx" no cuentan.
export function esCorreoUanl(correo: string): boolean {
  const c = normalizarCorreo(correo);
  if (!c.endsWith(DOMINIO_UANL)) return false;
  const usuario = c.slice(0, -DOMINIO_UANL.length);
  return usuario.length > 0 && !usuario.includes('@') && !/\s/.test(usuario);
}

// Primer filtro, antes de hablar con Firebase. Devuelve el motivo del rechazo o null si pasa.
export function validarCredenciales(correo: string, password: string): string | null {
  if (!esCorreoUanl(correo)) return `El correo debe terminar en ${DOMINIO_UANL}.`;
  if (password.trim() === '') return 'La contraseña no puede quedar en blanco.';
  if (password.length < MIN_PASSWORD) return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
  return null;
}
