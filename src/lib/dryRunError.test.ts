import { describe, expect, it } from 'vitest';
import { describeDryRunFailure, explainDryRunFailure } from './dryRunError';

// Respuesta real de ReviveApi.call para una cuenta nueva sin PAS (Products Devnet, 2026-10-31).
const SIN_FONDOS = { type: 'Module', value: { type: 'Revive', value: { type: 'StorageDepositNotEnoughFunds' } } };

describe('explainDryRunFailure', () => {
  it('explica la falta de PAS e incluye la cuenta', () => {
    const msg = explainDryRunFailure('createProduct', SIN_FONDOS, '5C857s…');
    expect(msg).toMatch(/^createProduct: Tu cuenta no tiene PAS/);
    expect(msg).toContain('5C857s…');
    expect(msg).toContain('faucet.polkadot.io');
  });

  it('cae en la descripción técnica para errores desconocidos', () => {
    expect(explainDryRunFailure('acceptOrder', { type: 'Module', value: { type: 'Otro' } }, 'x')).toBe(
      'acceptOrder falló: Module › Otro',
    );
  });
});

describe('describeDryRunFailure', () => {
  it('aplana los errores de la cadena en una ruta', () => {
    expect(
      describeDryRunFailure({ type: 'Module', value: { type: 'Revive', value: { type: 'AccountUnmapped' } } }),
    ).toBe('Module › Revive › AccountUnmapped');
    expect(describeDryRunFailure({ type: 'ContractReverted' })).toBe('ContractReverted');
  });

  it('usa el error decodificado del contrato', () => {
    expect(
      describeDryRunFailure({
        type: 'ContractRevertedWithPayload',
        data: '0x',
        decoded: { errorName: 'InvalidStatus', args: [2n] },
      }),
    ).toBe('InvalidStatus(2)');
    expect(describeDryRunFailure({ type: 'ContractRevertedWithPayload', data: '0x', reason: 'boom' })).toBe('boom');
  });

  it('no truena con bigint ni con valores raros', () => {
    expect(describeDryRunFailure({ gas: 5n })).toBe('{"gas":"5"}');
    expect(describeDryRunFailure(undefined)).toBe('sin detalle');
    expect(describeDryRunFailure('texto')).toBe('texto');
  });
});
