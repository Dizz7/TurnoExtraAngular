import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
/** Cuatro reglas de composición compartidas por registro y recuperación. */
export const CLAVE_VALIDATORS = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(18),
  Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
];
export const TEXTO_REQUERIDO = [Validators.required, Validators.pattern(/.*\S.*/)];
export function validarContrasenas(control: AbstractControl): ValidationErrors | null {
  const a = control.get('password')?.value,
    b = control.get('confirmPassword')?.value;
  return a && b && a !== b ? { contrasenasDistintas: true } : null;
}
export function validarEdad(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return { fechaInvalida: true };
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(0);
  fecha.setFullYear(anio, mes - 1, dia);
  fecha.setHours(0, 0, 0, 0);
  const hoy = new Date();
  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() + 1 !== mes ||
    fecha.getDate() !== dia ||
    fecha > hoy
  )
    return { fechaInvalida: true };
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) edad--;
  return edad >= 13 ? null : { edadMinima: true };
}

/** Mensaje visible tras interactuar con un control; incluye confirmación a nivel de grupo. */
export function errorCampo(
  control: AbstractControl,
  etiqueta: string,
  tipo: 'texto' | 'clave' | 'stock' = 'texto',
): string {
  if (!control.touched) return '';
  if (control.hasError('required')) return `Completa ${etiqueta.toLowerCase()}.`;
  if (control.hasError('email')) return 'Ingresa un correo electrónico válido.';
  if (control.hasError('minlength')) return 'Usa al menos 6 caracteres.';
  if (control.hasError('maxlength')) return 'Usa como máximo 18 caracteres.';
  if (control.hasError('fechaInvalida')) return 'Ingresa una fecha válida que no sea futura.';
  if (control.hasError('edadMinima')) return 'Debes tener al menos 13 años.';
  if (tipo === 'stock' && control.invalid) return 'Ingresa un número entero entre 0 y 9999.';
  if (control.hasError('pattern')) {
    if (tipo === 'clave') return 'Incluye al menos una mayúscula y un número.';
    return `${etiqueta} no puede contener solo espacios.`;
  }
  if (
    control.parent?.get('confirmPassword') === control &&
    control.parent.hasError('contrasenasDistintas')
  )
    return 'Las contraseñas no coinciden.';
  return '';
}
