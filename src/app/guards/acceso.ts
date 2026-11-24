import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
/**
 * Espera la inicialización y permite usuarios con sesión; redirige al login con el destino solicitado. Login limita los destinos de regreso permitidos.
 * @param _route Ruta protegida solicitada.
 * @param state Estado de navegación con la URL solicitada.
 * @returns Promesa con true o un UrlTree al login.
 */
export const acceso: CanActivateFn = async (_route, state) => {
  const auth = inject(Auth), router = inject(Router); await auth.preparado;
  return auth.usuario() ? true : router.createUrlTree(['/login'], {queryParams: {volver: state.url}});
};
/**
 * Espera la inicialización y comprueba el rol administrador. Se combina con acceso en la ruta administrativa.
 * @returns Promesa con true o un UrlTree a la pantalla de acceso restringido.
 */
export const administrador: CanActivateFn = async () => {
  const auth = inject(Auth), router = inject(Router); await auth.preparado;
  return auth.esAdmin() ? true : router.createUrlTree(['/sin-acceso']);
};
