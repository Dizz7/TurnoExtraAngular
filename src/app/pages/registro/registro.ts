import { Auth } from '../../services/auth';
import { validarEdad, validarContrasenas } from '../../validators/cuenta';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type CampoRegistro =
  'fullName' | 'username' | 'email' | 'password' | 'confirmPassword' | 'birthDate' | 'address';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['../../styles/page.css', './registro.css'],
})
export class Registro {
  private readonly auth = inject(Auth);
  ocupado = false;

  // Formulario reactivo con sus validaciones.
  formulario = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/.*\S.*/)],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/.*\S.*/)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      birthDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, validarEdad],
      }),
      address: new FormControl('', {
        nonNullable: true,
      }),
    },
    {
      validators: validarContrasenas,
    },
  );

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

    if (campo === 'confirmPassword' && this.formulario.hasError('contrasenasDistintas')) {
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
  async registrar(): Promise<void> {
    if (this.ocupado) return;
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
      'birthDate',
    ];

    if (obligatorios.some((campo) => !controles[campo].value.trim())) {
      this.errores.push('Completa todos los campos obligatorios.');
    }

    if (controles.email.value && controles.email.invalid) {
      this.errores.push('Ingresa un correo electrónico válido.');
    }

    const password = controles.password;

    if (password.value) {
      if (password.hasError('minlength') || password.hasError('maxlength')) {
        this.errores.push('La contraseña debe tener entre 6 y 18 caracteres.');
      }

      if (password.hasError('pattern')) {
        this.errores.push('La contraseña debe incluir una mayúscula y un número.');
      }
    }

    if (this.formulario.hasError('contrasenasDistintas')) {
      this.errores.push('Las contraseñas no coinciden.');
    }

    const fecha = controles.birthDate;

    if (fecha.hasError('fechaInvalida')) {
      this.errores.push('Ingresa una fecha de nacimiento válida.');
    } else if (fecha.hasError('edadMinima')) {
      this.errores.push('Debes tener al menos 13 años para registrarte.');
    }

    if (this.formulario.invalid) {
      this.animarBoton = true;
      return;
    }

    this.ocupado = true;
    try {
      await this.auth.registrar(this.formulario.getRawValue());
      this.registroExitoso = true;
      this.animarBoton = false;
      this.formulario.controls.password.reset();
      this.formulario.controls.confirmPassword.reset();
    } catch (e) {
      this.errores.push(e instanceof Error ? e.message : 'No se pudo guardar la cuenta.');
    } finally {
      this.ocupado = false;
    }
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
