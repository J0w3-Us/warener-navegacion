// src/app/home/home.ts

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MiBotonComponent } from '../mi-boton/mi-boton';
import { CardComponent } from '../card/card'; // 🎯 Importar el nuevo componente CardComponent

@Component({
  selector: 'app-home',
  standalone: true,
  // 🛑 Asegúrate de incluir CardComponent en los imports
  imports: [RouterLink, MiBotonComponent, CardComponent], 
  templateUrl: './home.html',
  styleUrl: './home.scss' 
})
export class HomeComponent { 
  mensaje: string = 'Directivas incorporadas en Angular'; 

  constructor(private router: Router) { }
  
  irDirectiva() {
    this.router.navigate(['/directivas']);
  }

  cambiarMensaje() {
    const nuevoMensaje = 'Mensaje cambiado: ' + Math.random().toFixed(2);
    this.mensaje = nuevoMensaje;
  }
}