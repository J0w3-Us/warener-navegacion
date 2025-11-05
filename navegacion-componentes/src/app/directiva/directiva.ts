// navegacion-componentes/src/app/directiva/directiva.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-directiva',
  standalone: true, 
  imports: [RouterOutlet],
  templateUrl: './directiva.html', // 🛑 Corregido a .html
  styleUrl: './directiva.scss' // 🛑 Corregido a .scss
})
export class DirectivaComponent {}