import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/** Inicia la aplicación standalone con sus proveedores y registra fallos de arranque en consola. */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
