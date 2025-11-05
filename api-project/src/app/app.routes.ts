// src/app/app.routes.ts

import { Routes } from '@angular/router';
// 🛑 CORRECCIÓN: Apuntamos al archivo real 'home' (sin .ts ni .component)
import { HomeComponent } from './features/home/home'; 

export const routes: Routes = [
  // Esta es la ruta raíz
  { path: '', component: HomeComponent },
  // ...
];