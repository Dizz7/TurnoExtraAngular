import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
/** Obligatoriedad y cuatro reglas de contraseña: mínimo 6, máximo 18, al menos una mayúscula ASCII y un dígito. */
export const CLAVE_VALIDATORS = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(18),
  Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
];
/** Validadores que exigen un valor con al menos un carácter que no sea espacio. */
export const TEXTO_REQUERIDO = [Validators.required, Validators.pattern(/.*\S.*/)];
/**
 * Compara las contraseñas del grupo cuando ambas tienen valor; required se aplica en cada control.
 * @param control Grupo con password y confirmPassword.
 * @returns Error contrasenasDistintas si difieren, o null.
 */
export function validarContrasenas(control: AbstractControl): ValidationErrors | null {
  const a = control.get('password')?.value,
    b = control.get('confirmPassword')?.value;
  return a && b && a !== b ? { contrasenasDistintas: true } : null;
}
/**
 * Comprueba una fecha real no futura y una edad mínima de 13 años; el vacío se delega a required.
 * @param control Control con fecha YYYY-MM-DD.
 * @returns fechaInvalida, edadMinima o null cuando no corresponde error.
 */
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

/**
 * Selecciona el primer mensaje aplicable a un control tocado, incluida la confirmación validada en el grupo.
 * @param control Control cuyo estado se presentará.
 * @param etiqueta Nombre legible del campo.
 * @param tipo Variante de mensaje para texto, contraseña o stock.
 * @returns Mensaje de error o cadena vacía si no debe mostrarse ninguno.
 */
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
