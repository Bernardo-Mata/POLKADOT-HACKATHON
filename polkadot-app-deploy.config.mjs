// Configuración de polkadot-app-deploy (pad 0.22.1) para la publicación final en .dot.
// Sin secretos: va en el commit. El nombre temporal de cada subida entra por APP_DOT.
export default {
  domain: process.env.APP_DOT,
  displayName: 'CampusChain',
  description: 'Marketplace universitario con pedidos verificables en Polkadot.',
  // Solo png o jpeg, cuadrado (512×512). Falta agregar el archivo antes de la publicación final.
  icon: { path: './public/icono.png', format: 'png' },
  executables: [{ kind: 'app', path: './dist', appVersion: [1, 0, 0] }],
};
