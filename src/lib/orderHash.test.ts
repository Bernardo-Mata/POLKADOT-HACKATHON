import { describe, expect, it } from 'vitest';
import { computeOrderHash, type OrderHashInput } from './orderHash';

const base: OrderHashInput = {
  orderId: '0x' + '11'.repeat(32) as `0x${string}`,
  productId: 1n,
  quantity: 2n,
  unitPriceCents: 3500n,
  buyer: '0x1111111111111111111111111111111111111111',
  seller: '0x2222222222222222222222222222222222222222',
};

describe('computeOrderHash', () => {
  it('es determinista', () => {
    expect(computeOrderHash(base)).toBe(computeOrderHash({ ...base }));
  });

  it('no depende de mayúsculas en las direcciones', () => {
    const mayusculas = {
      ...base,
      buyer: base.buyer.toUpperCase().replace('0X', '0x') as `0x${string}`,
    };
    expect(computeOrderHash(mayusculas)).toBe(computeOrderHash(base));
  });

  it('cambia si cambia cualquier campo', () => {
    const original = computeOrderHash(base);
    expect(computeOrderHash({ ...base, quantity: 3n })).not.toBe(original);
    expect(computeOrderHash({ ...base, unitPriceCents: 3501n })).not.toBe(original);
    expect(computeOrderHash({ ...base, productId: 2n })).not.toBe(original);
    expect(computeOrderHash({ ...base, seller: '0x3333333333333333333333333333333333333333' })).not.toBe(original);
  });

  it('devuelve un bytes32 en hex', () => {
    expect(computeOrderHash(base)).toMatch(/^0x[0-9a-f]{64}$/);
  });
});
