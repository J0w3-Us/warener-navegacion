import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoticiasService } from '../../services/noticias';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast.service';
import { UiService } from '../../shared/ui.service';
import { Noticia } from '../../interface/noticia.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-noticias.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./lista-noticias.css']
})
export class ListaNoticiasComponent implements OnInit, OnDestroy {
  currentUserId: string | null = null;
  currentUserRole: string | null = null;
  noticias: Noticia[] = [];
  noticiasDestacadas: Noticia[] = [];
  cargando = true;
  error = '';
  // track which noticia is expanded to show full contenido
  expandedId: string | null = null;
  fechaActual = new Date(); // Fecha fija para evitar errores de change detection
  // Imagen por defecto (data-uri SVG) para noticias sin imagen en la base de datos
  defaultImage: string = '';
  // cached view-model for performance
  private buildView(n: Noticia) {
    return {
      ...n,
      resumen: this.obtenerResumen(n.contenido, 25),
      fechaFormateada: this.formatearFecha(n.fecha)
    } as Noticia & { resumen: string; fechaFormateada: string };
  }
  // --- Campos para crear una nueva noticia desde la UI ---
  showCreate = false;
  creando = false;
  newNoticia: Noticia = {
    titulo: '',
    contenido: '',
    autor: 'Admin',
    fecha: new Date().toISOString(),
    categoria: 'General',
    imagenUrl: '',
    destacada: false,
    UserAlta: 'Admin',
    FechaAlta: new Date().toISOString(),
    UserMod: '',
    FechaMod: new Date().toISOString()
  };

  constructor(
    private noticiasService: NoticiasService,
    private router: Router,
    public authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private ui: UiService
  ) { }

  private destroy$ = new Subject<void>();

  ngAfterContentInit() {
    // Construimos un SVG simple embebido como fallback para evitar añadir assets.
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='220'>
        <rect width='100%' height='100%' fill='#f5f5f5'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999999' font-family='Roboto, Arial, sans-serif' font-size='24'>Imagen no disponible</text>
      </svg>`;
    this.defaultImage = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    // get current user role to decide admin privileges
    this.authService.getCurrentUserRole().subscribe({
      next: (role) => {
        this.currentUserRole = role;
      },
      error: () => {
        this.currentUserRole = null;
      }
    });

    this.cargarNoticias();

    // Suscribir evento global para abrir formulario de creación
    this.ui.openCreate$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.showCreate = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarNoticias() {
    this.cargando = true;
    this.noticiasService.obtenerNoticias().subscribe({
      next: (data) => {
        console.log('✅ Datos recibidos de la API:', data);
        const raw = Array.isArray(data) ? data : [];
        const view = raw.map(item => this.buildView(item));
        // assign immutably so OnPush picks up change
        this.noticias = view;
        this.noticiasDestacadas = view.filter(n => n.destacada).slice(0, 3);
        this.cargando = false;
        this.cdr.markForCheck();
        // Si no hay noticias, usar datos de ejemplo
        if (this.noticias.length === 0) {
          console.warn('⚠️ API devolvió array vacío. Usando datos de ejemplo.');
          const demo = this.obtenerNoticiasDeEjemplo().map(n => this.buildView(n));
          this.noticias = demo;
          this.noticiasDestacadas = demo.filter(n => n.destacada).slice(0, 3);
        }
      },
      error: (err) => {
        console.warn('❌ API no disponible. Mostrando datos de ejemplo:', err);
        // Datos de ejemplo para demostración
        const demo = this.obtenerNoticiasDeEjemplo().map(n => this.buildView(n));
        this.noticias = demo;
        this.noticiasDestacadas = demo.filter(n => n.destacada).slice(0, 3);
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  obtenerNoticiasDeEjemplo(): Noticia[] {
    return [
      {
        id: '1',
        titulo: 'Tecnología revoluciona la industria automotriz',
        contenido: 'Los vehículos eléctricos están transformando por completo la manera en que nos desplazamos. Las nuevas tecnologías de baterías prometen mayor autonomía y menores costos. Empresas líderes invierten millones en investigación y desarrollo para crear alternativas sostenibles al combustible fósil.',
        autor: 'María González',
        fecha: new Date().toISOString(),
        categoria: 'Tecnología',
        imagenUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        destacada: true,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      },
      {
        id: '2',
        titulo: 'Nuevo tratamiento médico ofrece esperanza',
        contenido: 'Investigadores han desarrollado un innovador tratamiento que muestra resultados prometedores en pruebas clínicas. El método combina terapia génica con medicina personalizada, abriendo nuevas posibilidades para pacientes que antes no tenían alternativas efectivas.',
        autor: 'Dr. Carlos Ruiz',
        fecha: new Date(Date.now() - 3600000).toISOString(),
        categoria: 'Salud',
        imagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        destacada: true,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      },
      {
        id: '3',
        titulo: 'Cambio climático: Acciones urgentes necesarias',
        contenido: 'Líderes mundiales se reúnen para discutir estrategias contra el cambio climático. El consenso científico indica que es necesario actuar con rapidez para limitar el aumento de temperatura global. Se proponen nuevas políticas energéticas y compromisos de reducción de emisiones.',
        autor: 'Ana Martínez',
        fecha: new Date(Date.now() - 7200000).toISOString(),
        categoria: 'Medio Ambiente',
        imagenUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800',
        destacada: true,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      },
      {
        id: '4',
        titulo: 'Economía global muestra señales de recuperación',
        contenido: 'Los mercados financieros responden positivamente a las nuevas medidas económicas implementadas. Analistas prevén un crecimiento sostenido en los próximos trimestres, impulsado por el sector tecnológico y servicios.',
        autor: 'Roberto Sánchez',
        fecha: new Date(Date.now() - 10800000).toISOString(),
        categoria: 'Economía',
        destacada: false,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      },
      {
        id: '5',
        titulo: 'Deportes: Equipo local avanza a la final',
        contenido: 'En un emocionante partido, el equipo local consiguió su pase a la final del campeonato. Los aficionados celebraron en las calles mientras el equipo agradecía su apoyo incondicional.',
        autor: 'Luis Hernández',
        fecha: new Date(Date.now() - 14400000).toISOString(),
        categoria: 'Deportes',
        destacada: false,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      },
      {
        id: '6',
        titulo: 'Educación digital: El futuro del aprendizaje',
        contenido: 'Las plataformas de aprendizaje en línea están revolucionando la educación. Estudiantes de todo el mundo pueden acceder a cursos de alta calidad desde cualquier ubicación, democratizando el conocimiento.',
        autor: 'Patricia López',
        fecha: new Date(Date.now() - 18000000).toISOString(),
        categoria: 'Educación',
        destacada: false,
        UserAlta: 'Admin',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      }
    ];
  }

  verDetalle(id: string | undefined) {
    if (id) {
      this.router.navigate(['/noticias', id]);
    }
  }

  toggleExpand(noticia: Noticia) {
    if (!noticia || !noticia.id) return;
    this.expandedId = this.expandedId === noticia.id ? null : noticia.id;
    this.cdr.markForCheck();
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

  obtenerResumen(contenido: string, palabras: number = 30): string {
    // Defendernos contra contenido undefined o datos que no sean string
    if (!contenido) return '';
    const text = typeof contenido === 'string' ? contenido.trim() : String(contenido);
    if (text.length === 0) return '';
    const palabrasArray = text.split(/\s+/);
    if (palabrasArray.length <= palabras) {
      return text;
    }
    return palabrasArray.slice(0, palabras).join(' ') + '...';
  }

  // --- Crear noticia (POST) ---
  crearNoticia() {
    // Require authentication before attempting to create on the backend
    if (!this.authService.isLoggedIn()) {
      try { this.toast.error('Debes iniciar sesión para crear una noticia'); } catch (e) {}
      this.router.navigate(['/login']);
      return;
    }
    this.creando = true;
    // Ajustar fecha/metadata mínima
    this.newNoticia.fecha = new Date().toISOString();
    this.newNoticia.FechaAlta = new Date().toISOString();
    // Assign the current logged user id if available so backend receives the correct user id
    this.newNoticia.UserAlta = this.currentUserId || this.newNoticia.UserAlta || 'Admin';

    this.noticiasService.crearNoticia(this.newNoticia).subscribe({
      next: (n) => {
        console.info('[ListaNoticiasComponent] Noticia creada', n);
        try { this.toast.success('Noticia creada'); } catch (e) {}
        // Build view-model and insert immutably to trigger OnPush
        const view = this.buildView(n as Noticia);
        this.noticias = [view, ...this.noticias];
        this.noticiasDestacadas = this.noticias.filter(x => x.destacada).slice(0, 3);
        // reset
        this.newNoticia = {
          titulo: '', contenido: '', autor: 'Admin', fecha: new Date().toISOString(), categoria: 'General', imagenUrl: '', destacada: false,
          UserAlta: 'Admin', FechaAlta: new Date().toISOString(), UserMod: '', FechaMod: new Date().toISOString()
        };
        this.creando = false;
        this.showCreate = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error creando noticia:', err);
        this.creando = false;
        try {
          const msg = err?.error?.message || err?.message || 'Error al crear noticia';
          this.toast.error(msg);
        } catch (e) {}
        // keep the create overlay open so the user can correct data
        this.showCreate = true;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Eliminar noticia (DELETE) ---
  eliminarNoticia(id?: string) {
    if (!id) return;
    if (!confirm('¿Eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    this.noticiasService.eliminarNoticia(id).subscribe({
      next: () => {
        console.info('[ListaNoticiasComponent] Noticia eliminada', id);
        try { this.toast.success('Noticia eliminada'); } catch (e) {}
        // update immutably so OnPush picks the change
        this.noticias = this.noticias.filter(n => n.id !== id);
        this.noticiasDestacadas = this.noticias.filter(x => x.destacada).slice(0, 3);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error eliminando noticia:', err);
        try { this.toast.error('Error al eliminar noticia'); } catch (e) {}
      }
    });
  }

  // --- Cerrar sesión ---
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- Editar noticia ---
  editarNoticia(noticia?: Noticia) {
    if (noticia && noticia.id) {
      this.router.navigate(['/noticias', noticia.id]);
    } else {
      // Nueva noticia - abrir formulario
      this.showCreate = true;
    }
  }

  openCreateOrLogin() {
    if (this.authService.isLoggedIn()) {
      this.showCreate = true;
      this.cdr.markForCheck();
    } else {
      try { this.toast.info('Inicia sesión para crear noticias'); } catch (e) {}
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  trackByNoticiaId(index: number, noticia: Noticia): string | undefined {
    return noticia.id;
  }

  isOwner(n: Noticia): boolean {
    if (!n) return false;
    const uid = this.currentUserId ?? '';
    return !!(uid && String(n.UserAlta) === String(uid));
  }
}
