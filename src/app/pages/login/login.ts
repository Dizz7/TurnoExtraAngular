import { errorCampo } from '../../validators/cuenta';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
/** Inicio de sesión con destinos internos limitados. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../../styles/cuenta.css',
})
export class Login {
  /** Expone a la plantilla los mensajes de validación del control y de su grupo. */
  readonly errorCampo = errorCampo;
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  readonly auth = inject(Auth);
  /** Router utilizado para navegar entre pantallas de la aplicación. */
  private readonly router = inject(Router);
  /** Ruta activa utilizada para consultar sus datos o parámetros. */
  private readonly route = inject(ActivatedRoute);
  /** Formulario reactivo de correo obligatorio válido y contraseña obligatoria. */
  formulario = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  /** Mensaje de la última operación fallida; vacío cuando no hay error visible. */
  error = '';
  /** Indica una operación asíncrona en curso y evita envíos duplicados. */
  ocupado = false;
  /** Limpia errores al editar cuando no hay un inicio de sesión en curso. */
  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (!this.ocupado) this.error = '';
    });
  }
  /**
   * Valida credenciales, inicia la sesión y navega a un destino permitido o al perfil.
   * @returns Promesa que finaliza al completar el intento; los errores se muestran en la vista.
   */
  async ingresar(): Promise<void> {
    if (this.ocupado) return;
    this.error = '';
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      this.error = 'Ingresa un correo válido y tu contraseña.';
      return;
    }
    this.ocupado = true;
    try {
      const d = this.formulario.getRawValue();
      await this.auth.ingresar(d.email, d.password);
      const volver = this.route.snapshot.queryParamMap.get('volver');
      await this.router.navigateByUrl(
        volver && ['/perfil', '/carrito', '/pago', '/admin'].includes(volver) ? volver : '/perfil',
      );
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'No se pudo iniciar sesión.';
    } finally {
      this.ocupado = false;
    }
  }
}
