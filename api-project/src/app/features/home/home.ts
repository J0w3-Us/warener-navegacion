// src/app/features/home/home.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para [ngClass]
import { Ciudad } from '../../core/models/ciudad.model'; // 🎯 Tipado Senior

@Component({
  selector: 'app-home',
  standalone: true,
  // 🛑 IMPORTANTE: Incluir CommonModule para usar directivas ([ngClass])
  imports: [CommonModule], 
  
  // HTML mejorado: tarjeta centrada, lista y uso correcto de *ngFor/*ngIf
  template: `
    <section class="home-card">
      <h1>Bienvenid@s</h1>
      <p class="subtitle">Esta es la página principal de mi app con Angular v20.</p>

      <hr />

      <h3>Actividad 2.1: Directivas y Data Binding</h3>

      <ul class="ciudad-list">
        <li *ngFor="let elemento of ciudades; let i = index">
          <div class="ciudad-item">
            <div class="ciudad-main">
              <strong>{{ elemento.pais }}</strong>
              <span class="sep">—</span>
              <span>{{ elemento.ciudad }}</span>
            </div>
            <div class="ciudad-meta">Habitantes: <span class="habitantes">{{ elemento.habitantes | number }}</span></div>
          </div>
        </li>
      </ul>

      <div *ngIf="ciudades.length > 5" class="notice">
        <h2>Tengo más de 5 elementos</h2>
      </div>

      <h5 [ngClass]="{
        'colorAzul': ciudades.length < 5,
        'colorVerde': ciudades.length >= 5
      }" class="contador">
        Número de ciudades: {{ ciudades.length }}
      </h5>
    </section>
  `,

  // Estilos actualizados para un diseño más limpio y centrado
  styles: [`
    :host { display: block; }
    .home-card {
      max-width: 880px;
      margin: 1.25rem auto;
      padding: 1.25rem 1.5rem;
      text-align: center; /* Centrar textos */
      background: linear-gradient(180deg, #ffffff, #fbfbfe);
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(32, 33, 36, 0.06);
      border: 1px solid rgba(16, 18, 20, 0.04);
    }

    .subtitle {
      color: #586069;
      margin-top: 0.25rem;
      margin-bottom: 1rem;
      font-size: 0.98rem;
    }

    hr { border: none; height: 1px; background: rgba(16,18,20,0.04); margin: 1rem 0; }

    h3 { margin: 0.5rem 0 0.75rem; color: #222; }

    .ciudad-list { list-style: none; padding: 0; margin: 0.5rem 0 1rem; display: grid; gap: 0.6rem; }

    .ciudad-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: center;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      background: rgba(99,102,241,0.03);
      border: 1px solid rgba(99,102,241,0.06);
    }

    .ciudad-main { font-weight: 600; color: #2b2b2b; display:flex; gap:0.5rem; align-items:center; }
    .ciudad-meta { font-size: 0.88rem; color: #555; }
    .habitantes { font-weight:700; color: #0b5; }

    .notice h2 { margin: 0.5rem 0; color: #0b5b; }

    .contador { margin-top: 0.75rem; font-size: 0.98rem; padding: 0.5rem 0.75rem; border-radius: 8px; display:inline-block; }

    .colorVerde { color: #0b7a3e; border: 1px solid rgba(11,122,62,0.08); background: rgba(11,122,62,0.03); }
    .colorAzul { color: #2563eb; border: 1px solid rgba(37,99,235,0.08); background: rgba(37,99,235,0.03); }

    @media (min-width: 760px) {
      .ciudad-item { flex-direction: row; justify-content: space-between; width: 100%; }
      .ciudad-main { justify-content: flex-start; }
      .ciudad-meta { justify-self: end; }
    }
  `]
})
export class HomeComponent {

  // Definición del arreglo tipado usando la Interfaz Ciudad
  ciudades: Ciudad[] = [
    { pais: 'México', ciudad: 'Mérida', habitantes: 50000 },
    { pais: 'Colombia', ciudad: 'Valledupar', habitantes: 45000 },
    { pais: 'Canada', ciudad: 'Toronto', habitantes: 60000 },
    { pais: 'México', ciudad: 'Ciudad de México', habitantes: 80000 },
    { pais: 'Brasil', ciudad: 'Brasilia', habitantes: 30000 },
    { pais: 'Estados Unidos', ciudad: 'Nueva York', habitantes: 20000 },
    // Total: 6 elementos (> 5)
  ];
}