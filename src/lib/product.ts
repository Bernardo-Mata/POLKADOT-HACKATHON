// El id del Product sale del dominio: mi-app.dot, mi-app.dot.li, mi-app.app.dot.li… → mi-app.dot.
// Fuera de un dominio .dot (pnpm dev, localhost) se usa el nombre por defecto.
export function productIdFromHostname(hostname: string): string {
  const esDominioProduct = /(\.dot|-dot\.li)$|\.dot\.li$/.test(hostname);
  return esDominioProduct ? `${hostname.split('.')[0]}.dot` : 'campuschain.dot';
}
