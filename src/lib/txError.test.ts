import { describe, expect, it } from 'vitest';
import { describeHostError, explainTxFailure } from './txError';

const RECHAZO_SDK = new Error('Transaction signing was rejected.');

describe('describeHostError', () => {
  it('junta el mensaje con la etiqueta cruda del Host', () => {
    const e = new Error('createTransaction failed: PermissionDenied', { cause: { tag: 'PermissionDenied' } });
    expect(describeHostError(e)).toBe('createTransaction failed: PermissionDenied · {"tag":"PermissionDenied"}');
  });

  it('agrega la cause cuando trae más detalle', () => {
    const e = new Error('createTransaction failed', { cause: new Error('Unknown → chain not supported') });
    expect(describeHostError(e)).toBe('createTransaction failed · Unknown → chain not supported');
  });
});

describe('explainTxFailure', () => {
  it('reconoce el permiso de transacciones negado', () => {
    const original = new Error('createTransaction failed: PermissionDenied');
    expect(explainTxFailure('createProduct', RECHAZO_SDK, original)).toMatch(/permiso a la app para enviar transacciones/);
  });

  it('muestra el motivo original en vez del mensaje genérico del SDK', () => {
    const original = new Error('createTransaction failed: Rejected');
    expect(explainTxFailure('createProduct', RECHAZO_SDK, original)).toBe(
      'createProduct: el Host no firmó la transacción. Motivo: createTransaction failed: Rejected',
    );
  });

  it('sin error del firmante usa el del SDK', () => {
    expect(explainTxFailure('createProduct', new Error('timeout'), undefined)).toBe('createProduct falló: timeout');
  });
});
