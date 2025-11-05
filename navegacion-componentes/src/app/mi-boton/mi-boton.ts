// src/app/mi-boton/mi-boton.ts (navegacion-componentes)

// 🎯 Importamos todas las interfaces de ciclo de vida necesarias y SimpleChanges
import { 
  Component, 
  Input, 
  OnChanges, 
  SimpleChanges, 
  OnInit, 
  DoCheck, 
  AfterContentInit, 
  AfterContentChecked, 
  AfterViewInit, 
  AfterViewChecked, 
  OnDestroy 
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-boton',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mi-boton.html', 
  styleUrl: './mi-boton.scss' 
})
// 🎯 Declaramos que la clase implementa todas las interfaces
export class MiBotonComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() inputMensaje: string = '';
  @Input() inputRuta: string = '';

  // Ciclo de vida: ngOnChanges (Se ejecuta cuando cambia un @Input)
  ngOnChanges(changes: SimpleChanges): void {
    // Es CRUCIAL verificar si la propiedad ha cambiado antes de usarla
    if (changes['inputMensaje']) {
      console.log('NGONCHANGES: Se cambió el mensaje de entrada:', this.inputMensaje);
    }
    if (changes['inputRuta']) {
      console.log('NGONCHANGES: Se cambió la ruta de entrada:', this.inputRuta);
    }
  }

  // Ciclo de vida: ngOnInit (Se ejecuta UNA SOLA VEZ después de la inicialización)
  // 🛑 LUGAR IDEAL PARA CARGAR DATOS DE LA API 🛑
  ngOnInit(): void {
    console.log('NGONINIT: El componente se ha inicializado.');
  }

  // Ciclo de vida: ngDoCheck (Se ejecuta en cada ciclo de detección de cambios)
  ngDoCheck(): void {
    // Nota Senior: Usar este hook puede afectar el rendimiento si no se usa con cuidado.
    // console.log('NGDOCHECK: El ciclo de detección de cambios personalizado se ejecutó.');
  }

  // Ciclo de vida: ngAfterContentInit (Se ejecuta después de la inicialización de <ng-content>)
  ngAfterContentInit(): void {
    console.log('NGAFTERCONTENTINIT: El contenido proyectado se ha inicializado.');
  }

  // Ciclo de vida: ngAfterContentChecked (Se ejecuta después de la revisión de <ng-content>)
  ngAfterContentChecked(): void {
    // console.log('NGAFTERCONTENTCHECKED: El contenido proyectado se ha revisado para cambios.');
  }

  // Ciclo de vida: ngAfterViewInit (Se ejecuta después de que la VISTA del componente esté lista)
  ngAfterViewInit(): void {
    console.log('NGAFTERVIEWINIT: La vista del componente se ha inicializado.');
  }

  // Ciclo de vida: ngAfterViewChecked (Se ejecuta después de cada revisión de la VISTA)
  ngAfterViewChecked(): void {
    // console.log('NGAFTERVIEWCHECKED: La vista del componente se ha revisado para cambios.');
  }

  // Ciclo de vida: ngOnDestroy (Se ejecuta justo antes de que el componente sea ELIMINADO del DOM)
  // 🛑 LUGAR IDEAL PARA CANCELAR SUSCRIPCIONES Y LIMPIAR MEMORIA 🛑
  ngOnDestroy(): void {
    console.log('NGONDESTROY: El componente está siendo destruido. Realizando limpieza.');
  }

}