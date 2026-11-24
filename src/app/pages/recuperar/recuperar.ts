import { errorCampo } from '../../validators/cuenta';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CLAVE_VALIDATORS, validarContrasenas } from '../../validators/cuenta';
/** Recuperación local: código visible, temporal y de un solo uso; no envía correos. */
@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: '../../styles/cuenta.css',
})
export class Recuperar {
  /** Expone a la plantilla los mensajes de validación del control y de su grupo. */
  readonly errorCampo = errorCampo;
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  private readonly auth = inject(Auth);
  /** Control de correo obligatorio y con formato válido para solicitar recuperación. */
  correo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  /** Grupo reactivo de la solicitud inicial de recuperación. */
  solicitud = new FormGroup({ correo: this.correo });
  /** Grupo de código, nueva contraseña y confirmación con las reglas compartidas. */
  formulario = new FormGroup(
    {
      codigo: new FormControl('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl('', { nonNullable: true, validators: CLAVE_VALIDATORS }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    },
    { validators: validarContrasenas },
  );
  /** Código mostrado localmente para la demostración; nunca se envía por correo. */
  codigoDemo = '';
  /** Mensaje de la última operación fallida; vacío cuando no hay error visible. */
  error = '';
  /** Indica que la última operación terminó correctamente. */
  exito = false;
  /** Indica una operación asíncrona en curso y evita envíos duplicados. */
  ocupado = false;
  /** Restablece la recuperación visible al cambiar el correo y limpia mensajes al editar. */
  constructor() {
    this.correo.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.codigoDemo = '';
      this.error = '';
      this.exito = false;
      this.formulario.reset();
    });
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (!this.ocupado) {
        this.error = '';
        this.exito = false;
      }
    });
  }
  /**
   * Valida el correo y solicita un código local; evita solicitudes simultáneas y muestra errores.
   * @returns Promesa que finaliza cuando el intento de solicitud termina.
   */
  async solicitar(): Promise<void> {
    if (this.ocupado) return;
    this.error = '';
    this.exito = false;
    this.codigoDemo = '';
    this.correo.markAsTouched();
    this.formulario.reset();
    if (this.correo.invalid) {
      this.error = 'Ingresa un correo válido.';
      return;
    }
    this.ocupado = true;
    try {
      this.codigoDemo = await this.auth.solicitarRecuperacion(this.correo.value);
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo generar el código.';
    } finally {
      this.ocupado = false;
    }
  }
  /**
   * Valida código y contraseñas, solicita el cambio y limpia los campos tras el éxito.
   * @returns Promesa que finaliza al completar el intento; los errores se muestran en la vista.
   */
  async restablecer(): Promise<void> {
    if (this.ocupado) return;
    this.error = '';
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.error =
        'Completa el código y dos contraseñas iguales de 6 a 18 caracteres, con mayúscula y número.';
      return;
    }
    this.ocupado = true;
    try {
      const d = this.formulario.getRawValue();
      await this.auth.restablecer(d.codigo, d.password);
      this.exito = true;
      this.codigoDemo = '';
      this.formulario.reset();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo restablecer la contraseña.';
    } finally {
      this.ocupado = false;
    }
  }
}
