import { RouterLink } from '@angular/router';
import { errorCampo } from '../../validators/cuenta';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '../../services/auth';
import {
  validarEdad,
  validarContrasenas,
  CLAVE_VALIDATORS,
  TEXTO_REQUERIDO,
} from '../../validators/cuenta';

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/** Nombres de los controles del formulario de registro, incluida la dirección opcional. */
type CampoRegistro =
  'fullName' | 'username' | 'email' | 'password' | 'confirmPassword' | 'birthDate' | 'address';

/** Alta de cuentas cliente mediante formulario reactivo y validadores compartidos. */
@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['../../styles/page.css', './registro.css'],
})
export class Registro {
  /** Expone a la plantilla los mensajes de validación del control y de su grupo. */
  readonly errorCampo = errorCampo;
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  private readonly auth = inject(Auth);
  /** Indica una operación asíncrona en curso y evita envíos duplicados. */
  ocupado = false;

  /** Formulario de registro con cuatro reglas de contraseña, confirmación, edad mínima y dirección opcional. */
  formulario = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: TEXTO_REQUERIDO,
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: TEXTO_REQUERIDO,
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: CLAVE_VALIDATORS,
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

  /** Resumen de errores de validación o del servicio de cuentas. */
  errores: string[] = [];
  /** Indica que la cuenta fue creada correctamente. */
  registroExitoso = false;
  /** Activa la animación de retroalimentación ante un envío inválido. */
  animarBoton = false;

  /** Retira errores y confirmación al editar cuando no hay un registro en curso. */
  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (!this.ocupado) {
        this.errores = [];
        this.registroExitoso = false;
      }
    });
  }

  /**
   * Marca un campo como tocado para mostrar sus validaciones.
   * @param campo Nombre del control del formulario de registro.
   */
  validarCampo(campo: CampoRegistro): void {
    this.formulario.controls[campo].markAsTouched();
  }

  /**
   * Obtiene la clase Bootstrap según interacción, validez y coincidencia de contraseñas.
   * @param campo Control que se está presentando.
   * @returns is-valid, is-invalid o una cadena vacía para campos sin interacción o dirección vacía.
   */
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

  /** Recalcula la validación del grupo y marca la confirmación como tocada si tiene valor. */
  actualizarContrasena(): void {
    this.formulario.updateValueAndValidity();

    const confirmacion = this.formulario.controls.confirmPassword;

    if (confirmacion.value) {
      confirmacion.markAsTouched();
    }
  }

  /** Marca la confirmación como tocada si contiene texto. */
  actualizarConfirmacion(): void {
    const confirmacion = this.formulario.controls.confirmPassword;

    if (confirmacion.value) {
      confirmacion.markAsTouched();
    }
  }

  /**
   * Valida y crea una cuenta cliente; evita envíos duplicados y limpia las claves tras el éxito.
   * @returns Promesa que finaliza al completar el intento; los errores se acumulan en la vista.
   */
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

  /** Desactiva la animación del botón al terminar su reproducción. */
  finalizarAnimacion(): void {
    this.animarBoton = false;
  }

  /** Restablece valores, estados de interacción, errores y confirmación del formulario. */
  limpiarFormulario(): void {
    this.formulario.reset();
    this.errores = [];
    this.registroExitoso = false;
    this.animarBoton = false;
  }
}
