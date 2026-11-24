import { FormControl, FormGroup } from '@angular/forms';
import {
  CLAVE_VALIDATORS,
  TEXTO_REQUERIDO,
  validarEdad,
  validarContrasenas,
  errorCampo,
} from './cuenta';
describe('Reglas compartidas de cuenta', () => {
  for (const [caso, clave] of [
    ['mínimo de seis caracteres', 'Ab123'],
    ['máximo de dieciocho caracteres', 'Ab123456789012345678'],
    ['al menos una mayúscula', 'abcdef1'],
    ['al menos un número', 'Abcdefg'],
  ]) {
    it('exige ' + caso, () => expect(new FormControl(clave, CLAVE_VALIDATORS).invalid).toBeTrue());
  }
  it('acepta los límites exactos de seis y dieciocho caracteres', () => {
    expect(new FormControl('Ab1234', CLAVE_VALIDATORS).valid).toBeTrue();
    expect(new FormControl('Ab' + '1'.repeat(16), CLAVE_VALIDATORS).valid).toBeTrue();
  });
  it('rechaza nombres formados solo por espacios', () =>
    expect(new FormControl('   ', TEXTO_REQUERIDO).invalid).toBeTrue());
  it('rechaza fechas inexistentes y futuras', () => {
    expect(validarEdad(new FormControl('2000-02-30'))).toEqual({ fechaInvalida: true });
    expect(validarEdad(new FormControl('2999-01-01'))).toEqual({ fechaInvalida: true });
  });
  it('acepta el día del cumpleaños número trece y rechaza el día anterior', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 10, 24, 12));
    try {
      expect(validarEdad(new FormControl('2013-11-24'))).toBeNull();
      expect(validarEdad(new FormControl('2013-11-25'))).toEqual({ edadMinima: true });
    } finally {
      jasmine.clock().uninstall();
    }
  });
  it('muestra el error de confirmación solo después de tocar el campo', () => {
    const f = new FormGroup(
      { password: new FormControl('Clave123'), confirmPassword: new FormControl('Distinta123') },
      { validators: validarContrasenas },
    );
    expect(errorCampo(f.controls.confirmPassword, 'Confirmación')).toBe('');
    f.controls.confirmPassword.markAsTouched();
    expect(errorCampo(f.controls.confirmPassword, 'Confirmación')).toBe(
      'Las contraseñas no coinciden.',
    );
    f.controls.confirmPassword.setValue('Clave123');
    expect(errorCampo(f.controls.confirmPassword, 'Confirmación')).toBe('');
  });
});
