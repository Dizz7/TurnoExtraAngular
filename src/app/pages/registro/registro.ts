
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

type CampoRegistro =
  | 'fullName'
  | 'username'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'birthDate'
  | 'address';

// Validador personalizado para la edad mínima.
function validarEdad(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;

  if (!valor) return null;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return { fechaInvalida: true };
  }

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
  ) {
    return { fechaInvalida: true };
  }

  let edad = hoy.getFullYear() - anio;

  if (
    hoy.getMonth() + 1 < mes ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
  ) {
    edad--;
  }

  return edad >= 13 ? null : { edadMinima: true };
}

// Validador para comprobar que las contraseñas coincidan.
function validarContrasenas(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) return null;

  return password === confirmPassword
    ? null
    : { contrasenasDistintas: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['../../styles/page.css', './registro.css']
})
export class Registro {

  // Formulario reactivo con sus validaciones.
  formulario = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/.*\S.*/)]
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/.*\S.*/)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarEdad]
    }),
    address: new FormControl('', {
      nonNullable: true
    })
  }, {
    validators: validarContrasenas
  });

  errores: string[] = [];
  registroExitoso = false;
  animarBoton = false;

  // Obtener el estado de validación de un campo.
  validarCampo(campo: CampoRegistro): void {
    this.formulario.controls[campo].markAsTouched();
  }

  // Aplicar clases CSS de Bootstrap.
  claseCampo(campo: CampoRegistro): string {
    const control = this.formulario.controls[campo];

    if (campo === 'address' && !control.value.trim()) {
      return '';
    }

    if (!control.touched) {
      return '';
    }

    if (
      campo === 'confirmPassword' &&
      this.formulario.hasError('contrasenasDistintas')
    ) {
      return 'is-invalid';
    }

    return control.valid ? 'is-valid' : 'is-invalid';
  }

  // Actualizar validación al modificar las contraseñas.
  actualizarContrasena(): void {
    this.formulario.updateValueAndValidity();

    const confirmacion = this.formulario.controls.confirmPassword;

    if (confirmacion.value) {
      confirmacion.markAsTouched();
    }
  }

  actualizarConfirmacion(): void {
    const confirmacion = this.formulario.controls.confirmPassword;

    if (confirmacion.value) {
      confirmacion.markAsTouched();
    }
  }

  // Validar y procesar el envío.
  registrar(): void {
    this.errores = [];
    this.registroExitoso = false;

    this.formulario.markAllAsTouched();
    this.formulario.updateValueAndValidity();

    const controles = this.formulario.controls;

    const obligatorios: CampoRegistro[] = [
      'fullName',
      'username',
      'email',
      'password',
      'confirmPassword',
      'birthDate'
    ];

    if (obligatorios.some(campo => !controles[campo].value.trim())) {
      this.errores.push('Completa todos los campos obligatorios.');
    }

    if (controles.email.value && controles.email.invalid) {
      this.errores.push('Ingresa un correo electrónico válido.');
    }

    const password = controles.password;

    if (password.value) {
      if (
        password.hasError('minlength') ||
        password.hasError('maxlength')
      ) {
        this.errores.push(
          'La contraseña debe tener entre 6 y 18 caracteres.'
        );
      }

      if (password.hasError('pattern')) {
        this.errores.push(
          'La contraseña debe incluir una mayúscula y un número.'
        );
      }
    }

    if (this.formulario.hasError('contrasenasDistintas')) {
      this.errores.push('Las contraseñas no coinciden.');
    }

    const fecha = controles.birthDate;

    if (fecha.hasError('fechaInvalida')) {
      this.errores.push('Ingresa una fecha de nacimiento válida.');
    } else if (fecha.hasError('edadMinima')) {
      this.errores.push(
        'Debes tener al menos 13 años para registrarte.'
      );
    }

    if (this.formulario.invalid) {
      this.animarBoton = true;
      return;
    }

    // Demostración: todavía no almacenamos cuentas.
    this.registroExitoso = true;
    this.animarBoton = false;
  }

  finalizarAnimacion(): void {
    this.animarBoton = false;
  }

  // Restablecer controles y mensajes.
  limpiarFormulario(): void {
    this.formulario.reset();
    this.errores = [];
    this.registroExitoso = false;
    this.animarBoton = false;
  }
}
