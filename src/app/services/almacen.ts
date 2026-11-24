import { InjectionToken } from '@angular/core';
/** Permite sustituir el almacenamiento del navegador en las pruebas. */
export const ALMACEN = new InjectionToken<Storage>('Cuentas locales', { providedIn: 'root', factory: () => localStorage });
export const SESION = new InjectionToken<Storage>('Sesión local', { providedIn: 'root', factory: () => sessionStorage });
