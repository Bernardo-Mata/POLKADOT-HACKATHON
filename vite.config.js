import { defineConfig } from 'vite';

const DESCRIPTORES = '@parity/product-sdk-descriptors/';
const STUB = '\0descriptor-sin-usar:';

// @parity/product-sdk-chain-client importa de forma dinámica los metadatos de todas las cadenas
// (presets de getChainAPI) aunque la app solo usa devnet-asset-hub. En el build se cambian los
// demás descriptores por un módulo vacío para que no terminen en dist.
// Solo aplica en el build: si la app llega a importar otra cadena, en pnpm dev y en los tests
// funciona, pero en dist queda vacía. Agrega su subruta a la condición de resolveId.
function soloDescriptorDevnet() {
  return {
    name: 'solo-descriptor-devnet',
    apply: 'build',
    enforce: 'pre',
    resolveId(id) {
      if (!id.startsWith(DESCRIPTORES)) return null;
      const subruta = id.slice(DESCRIPTORES.length);
      return subruta === 'devnet-asset-hub' ? null : STUB + subruta;
    },
    load(id) {
      return id.startsWith(STUB) ? 'export {};' : null;
    },
  };
}

export default defineConfig({
  // Rutas relativas: el bundle se sirve desde un CID de Bulletin, no desde la raíz de un dominio.
  base: './',
  plugins: [soloDescriptorDevnet()],
});
