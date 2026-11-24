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
  readonly errorCampo = errorCampo;
  readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  formulario = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  error = '';
  ocupado = false;
  constructor() {
    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (!this.ocupado) this.error = '';
    });
  }
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
