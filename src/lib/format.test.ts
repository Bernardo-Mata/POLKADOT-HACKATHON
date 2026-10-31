import { describe, expect, it } from 'vitest';
import { formatMxn, pesosToCents } from './format';
import { productIdFromHostname } from './product';

describe('pesosToCents', () => {
  it('convierte pesos a centavos', () => {
    expect(pesosToCents('35.50')).toBe(3550n);
    expect(pesosToCents('10')).toBe(1000n);
  });

  it('rechaza precios no válidos', () => {
    expect(pesosToCents('0')).toBeNull();
    expect(pesosToCents('-5')).toBeNull();
    expect(pesosToCents('abc')).toBeNull();
  });
});

describe('formatMxn', () => {
  it('muestra centavos como pesos', () => {
    expect(formatMxn(3550n)).toContain('35.50');
  });
});

describe('productIdFromHostname', () => {
  it('toma el nombre .dot del dominio del Product', () => {
    expect(productIdFromHostname('campuschain.dot')).toBe('campuschain.dot');
    expect(productIdFromHostname('campuschain.dot.li')).toBe('campuschain.dot');
    expect(productIdFromHostname('campuschain.app.dot.li')).toBe('campuschain.dot');
    expect(productIdFromHostname('campuschain.dev-dot.li')).toBe('campuschain.dot');
  });

  it('usa el nombre por defecto fuera de un dominio .dot', () => {
    expect(productIdFromHostname('localhost')).toBe('campuschain.dot');
    expect(productIdFromHostname('127.0.0.1')).toBe('campuschain.dot');
  });
});
