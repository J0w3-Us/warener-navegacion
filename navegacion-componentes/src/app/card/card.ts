// src/app/card/card.ts (navegacion-componentes)

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html', // 🎯 Ajustado a tu nomenclatura
  styleUrl: './card.scss' // 🎯 Ajustado a tu nomenclatura
})
export class CardComponent {
  // 🎯 Los tres inputs dinámicos
  @Input() titulo: string = 'Título por Defecto';
  @Input() descripcion: string = 'Descripción por defecto de la tarjeta.';
  @Input() pie: string = 'Pie de página por defecto';
}