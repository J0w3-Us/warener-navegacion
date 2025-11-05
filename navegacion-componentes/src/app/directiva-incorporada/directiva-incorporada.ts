// navegacion-componentes/src/app/directiva-incorporada/directiva-incorporada.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva-incorporada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './directiva-incorporada.html', // 🛑 Corregido a .html
  styleUrl: './directiva-incorporada.scss' // 🛑 Corregido a .scss
})
export class DirectivaIncorporadaComponent {
  // 🎯 Tipado Senior
  nombres: string[] = ['Angel', 'Ernesto', 'Carlos', 'Laura'];
  tipoMensaje: string = 'aviso';
  colorFondo: string = 'blue';
  subrayarTexto: boolean = true;
  colorRojo: boolean = false;
}