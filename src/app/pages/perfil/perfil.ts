import { errorCampo } from '../../validators/cuenta';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { TEXTO_REQUERIDO, validarEdad } from '../../validators/cuenta';
/** Edición de la cuenta activa; el rol no forma parte del formulario. */
@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: '../../styles/cuenta.css',
})
export class Perfil {
  /** Expone a la plantilla los mensajes de validación del control y de su grupo. */
  readonly errorCampo = errorCampo;
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  readonly auth = inject(Auth);
  /** Datos editables del perfil; valida nombre, usuario, correo y edad mínima de 13 años. */
  formulario = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: TEXTO_REQUERIDO }),
    username: new FormControl('', { nonNullable: true, validators: TEXTO_REQUERIDO }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarEdad],
    }),
    address: new FormControl('', { nonNullable: true }),
  });
  /** Mensaje de la última operación fallida; vacío cuando no hay error visible. */
  error = '';
  /** Indica que la última operación terminó correctamente. */
  exito = false;
  /** Carga el perfil y limpia mensajes cuando cambian los campos. */
  constructor() {
    this.restaurar();
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.error = '';
      this.exito = false;
    });
  }
  /** Recarga los datos de la cuenta activa, restablece los controles y descarta mensajes. */
  restaurar(): void {
    const u = this.auth.usuario();
    if (u)
      this.formulario.reset({
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        birthDate: u.birthDate,
        address: u.address,
      });
    this.error = '';
    this.exito = false;
  }
  /** Valida los campos y actualiza la cuenta mediante Auth, mostrando éxito o error. */
  guardar(): void {
    this.error = '';
    this.exito = false;
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.error =
        'Completa nombre, usuario, correo válido y fecha de nacimiento (mínimo 13 años).';
      return;
    }
    try {
      this.auth.actualizar(this.formulario.getRawValue());
      this.exito = true;
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo guardar el perfil.';
    }
  }
}
