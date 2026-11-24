import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

/** Proveedores de la aplicación: errores globales, rutas, desplazamiento a anclas y restauración de posición. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
  ],
};
