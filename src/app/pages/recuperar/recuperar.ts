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
  readonly errorCampo = errorCampo;
  private readonly auth = inject(Auth);
  correo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  solicitud = new FormGroup({ correo: this.correo });
  formulario = new FormGroup(
    {
      codigo: new FormControl('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl('', { nonNullable: true, validators: CLAVE_VALIDATORS }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    },
    { validators: validarContrasenas },
  );
  codigoDemo = '';
  error = '';
  exito = false;
  ocupado = false;
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
