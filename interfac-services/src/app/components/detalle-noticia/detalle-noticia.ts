import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../services/noticias';
import { Noticia } from '../../interface/noticia.interface';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-detalle-noticia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle-noticia.html',
  styleUrls: ['./detalle-noticia.css']
})
export class DetalleNoticiaComponent implements OnInit {
  noticia: Noticia | null = null;
  cargando = true;
  error = '';
  // Edit mode / edición
  editMode = false;
  editedNoticia: Noticia | null = null;
  currentUserId: string | null = null;
  currentUserRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiasService: NoticiasService,
    private authService: AuthService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentUserId = this.authService.getCurrentUserId() ? String(this.authService.getCurrentUserId()) : null;
    // fetch role (admin or other) to allow role-based actions
    this.authService.getCurrentUserRole().subscribe({
      next: (role) => this.currentUserRole = role,
      error: () => this.currentUserRole = null
    });
    if (id) {
      this.cargarNoticia(id);
    } else {
      this.error = 'ID de noticia no válido';
      this.cargando = false;
    }
  }

    isOwner(): boolean {
      if (!this.noticia || !this.currentUserId) return false;
      return String(this.noticia.UserAlta) === String(this.currentUserId);
    }

  cargarNoticia(id: string) {
    this.cargando = true;
    this.noticiasService.obtenerNoticiaPorId(id).subscribe({
      next: (data) => {
        this.noticia = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la noticia. Por favor, intenta de nuevo.';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  volver() {
    this.router.navigate(['/noticias']);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-MX', opciones);
  }

  compartir() {
    if (navigator.share && this.noticia) {
      navigator.share({
        title: this.noticia.titulo,
        text: this.noticia.contenido.substring(0, 100) + '...',
        url: window.location.href
      }).catch((error) => console.log('Error al compartir:', error));
    }
  }

  // --- Toggle edit ---
  toggleEditar() {
    if (!this.noticia) return;
    this.editMode = !this.editMode;
    if (this.editMode) {
      // Clonamos para editar sin mutar hasta guardar
      this.editedNoticia = { ...this.noticia } as Noticia;
    } else {
      this.editedNoticia = null;
    }
  }

  // --- Guardar edición (PUT) ---
  guardarEdicion() {
    if (!this.noticia || !this.editedNoticia || !this.noticia.id) return;
    this.noticiasService.actualizarNoticia(this.noticia.id, this.editedNoticia).subscribe({
      next: (updated) => {
        console.info('[DetalleNoticiaComponent] Noticia actualizada', updated);
        try { this.toast.success('Noticia actualizada'); } catch (e) {}
        this.noticia = updated;
        this.editMode = false;
        this.editedNoticia = null;
      },
      error: (err) => {
        console.error('Error actualizando noticia:', err);
        try { this.toast.error('Error al actualizar noticia'); } catch (e) {}
      }
    });
  }

  // --- Eliminar noticia (DELETE) ---
  eliminarNoticia() {
    if (!this.noticia || !this.noticia.id) return;
    if (!confirm('¿Eliminar esta noticia?')) return;
    this.noticiasService.eliminarNoticia(this.noticia.id).subscribe({
      next: () => {
        console.info('[DetalleNoticiaComponent] Noticia eliminada', this.noticia?.id);
        try { this.toast.success('Noticia eliminada'); } catch (e) {}
        this.volver();
      },
      error: (err) => console.error('Error eliminando noticia:', err)
    });
  }
}
