// app.routes.ts (navegacion-componentes)

import { Routes } from '@angular/router';
// 🛑 Usamos el nombre de tu archivo: suma
import { SumaComponent } from './suma/suma'; 
import { HomeComponent } from './home/home';
import { DirectivaComponent } from './directiva/directiva';
import { DirectivaIncorporadaComponent } from './directiva-incorporada/directiva-incorporada';


export const routes: Routes = [
    // 🛑 Ruta principal (Necesaria para que las rutas funcionen juntas)
    { path: '', component: HomeComponent },
    { path: 'directivas', component: DirectivaComponent },
    { path: 'directivas/incorporadas', component: DirectivaIncorporadaComponent },
    
    // 🎯 RUTA DE LA ACTIVIDAD 3.1
    { path: 'suma/:primerNumero/:segundoNumero', component: SumaComponent },
    
    // 🛑 Ruta por defecto corregida para que funcione con las rutas principales
    { path: '**', redirectTo: '' } 
];