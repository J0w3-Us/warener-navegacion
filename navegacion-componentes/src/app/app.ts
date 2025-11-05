// src/app/app.ts (navegacion-componentes)

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // 🎯 LIMPIEZA: Solo dejamos el router-outlet
  template: '<router-outlet></router-outlet>', 
  styleUrl: './app.scss' 
})
// 🛑 ¡CORRECCIÓN CRÍTICA! Cambiamos el nombre de la clase a 'App'
// para que coincida con lo que 'main.ts' está intentando importar.
export class App { 
  // No hay lógica aquí, solo actúa como contenedor del RouterOutlet.
}