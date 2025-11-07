import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  nick = '';
  pass = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  onLogin(form: NgForm) {
    this.error = '';
    if (form.invalid) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    this.loading = true;
    this.auth.login({ nick: this.nick, pass: this.pass }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Bienvenido');
        this.router.navigate(['/noticias']);
      },
      error: (err) => {
        console.error('Login error', err);
        // Mostrar detalles del error para depuración rápida
        // Especial: si el servicio lanzó NonJsonResponse (HTML en vez de JSON)
        if (err && err.name === 'NonJsonResponse') {
          console.debug('[LoginComponent] Non-JSON response body:', err.body);
          this.error = 'El servidor devolvió HTML en lugar de JSON. Parece que la ruta apunta a la documentación (/docs) en lugar del API. Revisa la URL del backend.';
          this.toast.error(this.error);
          this.loading = false;
          return;
        }
        const status = err?.status;
        const body = err?.error;
        console.debug('[LoginComponent] error status, body:', status, body);
        // Intentar extraer mensaje del backend
        if (err && err.error && err.error.message) {
          this.error = err.error.message;
        } else if (err && err.status === 0) {
          this.error = 'No se pudo conectar al servidor. Revisa tu conexión.';
        } else if (err && err.status === 401) {
          this.error = 'Usuario o contraseña incorrectos.';
        } else {
          this.error = 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
        this.toast.error(this.error);
        this.loading = false;
      }
    });
  }
}
