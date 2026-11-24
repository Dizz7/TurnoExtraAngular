import { InjectionToken } from '@angular/core';
/** Token de almacenamiento persistente de cuentas; usa localStorage y puede sustituirse en pruebas. */
export const ALMACEN = new InjectionToken<Storage>('Cuentas locales', { providedIn: 'root', factory: () => localStorage });
/** Token de almacenamiento de la sesión de la pestaña; usa sessionStorage y puede sustituirse en pruebas. */
export const SESION = new InjectionToken<Storage>('Sesión local', { providedIn: 'root', factory: () => sessionStorage });
