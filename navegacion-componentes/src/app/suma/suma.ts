// src/app/suma/suma.ts (navegacion-componentes)

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suma',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suma.html',
  styleUrls: ['./suma.scss']
})
export class SumaComponent implements OnInit, OnDestroy {
  // Display de la calculadora
  display: string = '0';

  // Estado interno simple
  private firstValue: number | null = null;
  private operator: string | null = null;
  private waitingForSecond = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Si la ruta provee parámetros, mostrar la suma inicial (compatibilidad con la app original)
    this.route.params.subscribe(params => {
      const a = params['primerNumero'];
      const b = params['segundoNumero'];
      if (a !== undefined && b !== undefined) {
        const sum = Number(a) + Number(b);
        this.display = String(sum);
        this.firstValue = sum;
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup si fuera necesario
  }

  // 🎹 Soporte para teclado - escucha eventos de teclas globalmente
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Prevenir scroll y otros comportamientos por defecto en ciertas teclas
    const key = event.key;
    
    // Números del 0-9
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      this.pressDigit(key);
      return;
    }

    // Operadores matemáticos
    switch (key) {
      case '+':
        event.preventDefault();
        this.setOperator('+');
        break;
      case '-':
        event.preventDefault();
        this.setOperator('-');
        break;
      case '*':
        event.preventDefault();
        this.setOperator('*');
        break;
      case '/':
        event.preventDefault();
        this.setOperator('/');
        break;
      case 'Enter':
      case '=':
        event.preventDefault();
        this.calculate();
        break;
      case '.':
      case ',': // También soportar coma decimal
        event.preventDefault();
        this.pressDot();
        break;
      case 'Backspace':
        event.preventDefault();
        this.backspace();
        break;
      case 'Escape':
      case 'Delete':
      case 'c':
      case 'C':
        event.preventDefault();
        this.clear();
        break;
    }
  }

  // Entrada de dígitos
  pressDigit(d: string) {
    if (this.waitingForSecond) {
      this.display = d;
      this.waitingForSecond = false;
    } else {
      this.display = this.display === '0' ? d : this.display + d;
    }
  }

  pressDot() {
    if (this.waitingForSecond) {
      this.display = '0.';
      this.waitingForSecond = false;
      return;
    }
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  clear() {
    this.display = '0';
    this.firstValue = null;
    this.operator = null;
    this.waitingForSecond = false;
  }

  backspace() {
    if (this.waitingForSecond) return;
    if (this.display.length <= 1) {
      this.display = '0';
    } else {
      this.display = this.display.slice(0, -1);
    }
  }

  setOperator(op: string) {
    const current = Number(this.display);
    if (this.operator && !this.waitingForSecond) {
      this.performCalculation(current);
    } else {
      this.firstValue = current;
    }
    this.operator = op;
    this.waitingForSecond = true;
  }

  calculate() {
    if (!this.operator || this.firstValue === null) return;
    const second = Number(this.display);
    this.performCalculation(second);
    this.operator = null;
    this.waitingForSecond = true;
  }

  private performCalculation(second: number) {
    if (this.firstValue === null || this.operator === null) return;
    let result = 0;
    switch (this.operator) {
      case '+': result = this.firstValue + second; break;
      case '-': result = this.firstValue - second; break;
      case '*': result = this.firstValue * second; break;
      case '/': result = second === 0 ? NaN : this.firstValue / second; break;
      default: result = second; break;
    }
    this.display = String(Number.isFinite(result) ? +result.toPrecision(12) : 'NaN');
    this.firstValue = Number(this.display);
  }
}