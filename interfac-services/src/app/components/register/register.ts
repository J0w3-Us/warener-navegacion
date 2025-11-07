import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  correo = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  onRegister(form: NgForm) {
    this.error = '';
    // enforce a minimum secure length (backend may require >=8)
    if ((this.password || '').length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      this.toast.error(this.error);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Completa todos los campos.';
      this.toast.error(this.error);
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
    const payload = { correo: this.correo, 'contraseña': this.password, contrasena: this.password, email: this.correo, password: this.password } as any;
    try { console.debug('[RegisterComponent] registro payload', payload); } catch (e) {}
      return;
    }

    this.loading = true;
  const payload = { correo: this.correo, 'contraseña': this.password, email: this.correo, password: this.password } as any;
  try { console.debug('[RegisterComponent] registro payload', payload); } catch (e) {}
    this.auth.registro(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success('Cuenta creada correctamente. Inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('[RegisterComponent] registro error', err);
        this.loading = false;
        // Prefer backend-provided message when available
        let msg = 'Error al crear la cuenta';
        if (err && err.status === 422) {
          // 422 commonly means validation failure / user exists
          msg = err?.error?.message || err?.error?.msg || 'La cuenta ya existe o los datos son inválidos.';
        } else if (err && err.error && err.error.message) {
          msg = err.error.message;
        }
        this.error = msg;
        this.toast.error(this.error);
      }
    });
  }
}
