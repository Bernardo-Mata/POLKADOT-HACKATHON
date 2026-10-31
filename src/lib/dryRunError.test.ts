import { describe, expect, it } from 'vitest';
import { describeDryRunFailure } from './dryRunError';

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
