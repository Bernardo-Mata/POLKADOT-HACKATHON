# CampusChain

Marketplace universitario con pedidos verificables, publicado como Polkadot Product en Products Devnet.

- Frontend: React + Vite + TypeScript, estático, sin backend.
- Contrato: `contracts/CampusChain.sol` (Solidity 0.8.28, sin optimizador), desplegado con Remix + MetaMask.
- Red: Products Devnet, Asset Hub 1000, chainId `420420417`.
- Versiones fijas según la skill `polkadot-products-devnet` (`.agents/skills/…/references/versiones.md`).

## Requisitos

- Node ≥ 22.19 y pnpm 12.6.0 (el proyecto lo pide en `devEngines`).
- Polkadot Desktop o la Polkadot App emparejada con el devnet, para probar dentro del Host.
- MetaMask con la red Polkadot Hub TestNet (chainId `420420417`, RPC `https://eth-rpc-testnet.polkadot.io`) y PAS del faucet para desplegar.

## Desarrollo

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm dev        # solo para la parte visual: fuera de un Host la app pide abrirse dentro de uno
```

Antes de probar, copiar `.env.example` a `.env` y poner la dirección del contrato en `VITE_CONTRACT_ADDRESS`.

Revisión del entorno:

```sh
node .agents/skills/polkadot-products-devnet/scripts/verificar-entorno.mjs .
```

## Desplegar el contrato

1. En [Remix](https://remix.ethereum.org): crear `CampusChain.sol` con el contenido de `contracts/`.
2. Compilador `0.8.28`, optimizador apagado.
3. *Deploy & run*: entorno **Injected Provider – MetaMask**, red `420420417`. Desplegar.
4. Copiar la dirección a `VITE_CONTRACT_ADDRESS` y regenerar `src/contract/campusChain.abi.json` desde la pestaña ABI de Remix (no editarlo a mano).
5. No hace falta registrar cuentas: cualquier cuenta que se conecte desde el Host puede publicar y pedir.

## Publicar en `.dot`

La cuenta del Product depende del nombre `.dot`: cambiar de nombre cambia la dirección que el contrato ve como vendedor o comprador. Por eso conviene fijar el nombre final desde el principio.

1. Registrar el nombre final de 9 caracteres o más (ver `publicar.md`, sección 1).
2. `pnpm build`.
3. Prueba rápida sin manifest, con un nombre temporal:

   ```powershell
   $tmp = 'tmp' + (-join ((Get-Date -Format 'yyyyMMddHHmmss').ToCharArray() | ForEach-Object { [char](97 + [int]"$_") })) + '.dot'
   pnpm dlx --ignore-scripts @polkadot-community-foundation/polkadot-app-deploy@0.22.1 .\dist $tmp --env devnet --js-merkle --no-manifest
   ```

   Copiar el `CID: bafy…` y pegarlo en el `contenthash` del nombre final desde `dotns.dot` en el Host.
4. Publicación final con icono y manifest (el icono es `src/img/e-commerce.png`, 512×512):

   ```powershell
   pnpm build
   $env:APP_DOT = 'tu-nombre-final.dot'
   pnpm dlx --ignore-scripts @polkadot-community-foundation/polkadot-app-deploy@0.22.1 .\dist $env:APP_DOT --env devnet --js-merkle
   ```

   Después, en `dotns.dot`: Resolve con el CID y, en Edit → Custom Records, el registro `manifest` con el JSON de `Verified text[manifest]:`.

Detalles y errores conocidos: `.agents/skills/polkadot-products-devnet/references/publicar.md` y `errores-comunes.md`.

## Limitaciones que se muestran en la app

- "Pago reportado por el vendedor": el contrato registra la declaración del vendedor, no verifica transferencias.
- No hay verificación de identidad: cualquier cuenta conectada desde el Host puede publicar y pedir. La identidad universitaria queda fuera del MVP.
- La reputación cuenta pedidos completados según el registro; no garantiza honestidad.

## Estructura

```
contracts/CampusChain.sol          contrato (Remix)
src/hub/hub.ts                     conexión con el Host, cuenta del Product, PGAS
src/contract/campusChain.ts        lecturas (.query) y escrituras (.query → .tx)
src/contract/campusChain.abi.json  ABI exportada de Remix
src/pages/                         catálogo, vender, pedidos
polkadot-app-deploy.config.mjs     manifest para pad (publicación final)
```
