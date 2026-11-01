import { cerrarError, useToast } from '../lib/toast';

// Muestra el error de la última transacción con su detalle completo, hasta que el usuario lo cierra.
export function Toast() {
  const detalle = useToast();
  if (!detalle) return null;

  return (
    <div className="toast" role="alert">
      <div className="toast-cabecera">
        <strong>La transacción falló</strong>
        <button className="secundario" onClick={cerrarError}>
          Cerrar
        </button>
      </div>
      <pre>{detalle}</pre>
    </div>
  );
}
