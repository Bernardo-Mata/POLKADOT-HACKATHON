import { describe, expect, it } from 'vitest';
import { esCorreoUanl, normalizarCorreo, validarCredenciales } from './registro';

describe('esCorreoUanl', () => {
  it('acepta correos institucionales', () => {
    expect(esCorreoUanl('ana.rodriguez@uanl.edu.mx')).toBe(true);
    expect(esCorreoUanl('  Ana.Rodriguez@UANL.edu.mx ')).toBe(true);
  });

  it('rechaza otros dominios y correos mal formados', () => {
    expect(esCorreoUanl('ana@gmail.com')).toBe(false);
    expect(esCorreoUanl('ana@uanl.edu.mx.com')).toBe(false);
    expect(esCorreoUanl('ana@notuanl.edu.mx')).toBe(false);
    expect(esCorreoUanl('@uanl.edu.mx')).toBe(false);
    expect(esCorreoUanl('a@b@uanl.edu.mx')).toBe(false);
    expect(esCorreoUanl('ana perez@uanl.edu.mx')).toBe(false);
  });
});

describe('validarCredenciales', () => {
  it('pasa con correo UANL y contraseña válida', () => {
    expect(validarCredenciales('ana@uanl.edu.mx', 'secreto1')).toBeNull();
  });

  it('rechaza contraseña en blanco o solo espacios', () => {
    expect(validarCredenciales('ana@uanl.edu.mx', '')).toMatch(/en blanco/);
    expect(validarCredenciales('ana@uanl.edu.mx', '      ')).toMatch(/en blanco/);
  });

  it('rechaza contraseñas cortas', () => {
    expect(validarCredenciales('ana@uanl.edu.mx', '123')).toMatch(/6 caracteres/);
  });

  it('revisa el dominio antes que la contraseña', () => {
    expect(validarCredenciales('ana@gmail.com', '')).toMatch(/@uanl\.edu\.mx/);
  });
});

describe('normalizarCorreo', () => {
  it('quita espacios y pasa a minúsculas', () => {
    expect(normalizarCorreo('  ANA@UANL.EDU.MX ')).toBe('ana@uanl.edu.mx');
  });
});
