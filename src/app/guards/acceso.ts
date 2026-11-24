import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
/** Conserva solo destinos internos conocidos después del login. */
export const acceso: CanActivateFn = async (_route, state) => {
  const auth = inject(Auth), router = inject(Router); await auth.preparado;
  return auth.usuario() ? true : router.createUrlTree(['/login'], {queryParams: {volver: state.url}});
};
export const administrador: CanActivateFn = async () => {
  const auth = inject(Auth), router = inject(Router); await auth.preparado;
  return auth.esAdmin() ? true : router.createUrlTree(['/sin-acceso']);
};
