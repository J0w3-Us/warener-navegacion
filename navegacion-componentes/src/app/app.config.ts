// app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // 🎯 Configuramos el Router para que la aplicación conozca las rutas.
  providers: [provideRouter(routes)]
};