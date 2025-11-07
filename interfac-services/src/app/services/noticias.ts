import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ToastService } from '../shared/toast.service';
import { AuthService } from './auth.service';
import { Noticia } from '../interface/noticia.interface';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  // Base API URL
  private apiUrl = 'http://localhost:4000/api/news';

  // Nota: el token será añadido por el AuthInterceptor. No incluir headers aquí.

  constructor(private http: HttpClient, private toast: ToastService, private auth: AuthService) { }

  // GET - Obtener todas las noticias
  obtenerNoticias(): Observable<Noticia[]> {
  return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // Manejar diferentes estructuras de respuesta de la API y normalizar cada noticia
        let raw: any[] = [];
        if (Array.isArray(response)) {
          raw = response;
        } else if (response && Array.isArray(response.news)) {
          raw = response.news;
        } else if (response && Array.isArray(response.data)) {
          raw = response.data;
        } else if (response && Array.isArray(response.noticias)) {
          raw = response.noticias;
        } else {
          console.error('Estructura de respuesta inesperada:', response);
          raw = [];
        }
        // Normalizar campos para que el frontend use la misma forma (contenido, titulo, autor...)
        return raw.map(item => this.normalizeNoticia(item));
      }),
      tap((arr: any) => {
        try { console.info('[NoticiasService] obtenerNoticias -> received', Array.isArray(arr) ? arr.length : 'non-array'); } catch (e) {}
      }),
      catchError((err) => {
        try { console.error('[NoticiasService] obtenerNoticias error', err); this.toast.error('Error cargando noticias'); } catch (e) {}
        return throwError(err);
      })
    );
  }

  // Normaliza varias formas de respuesta de la API hacia la forma que usa el frontend
  private normalizeNoticia(item: any): Noticia {
    if (!item || typeof item !== 'object') {
      return {
        id: undefined,
        titulo: '',
        contenido: '',
        autor: '',
        fecha: new Date().toISOString(),
        categoria: '',
        imagenUrl: '',
        destacada: false,
        UserAlta: '',
        FechaAlta: new Date().toISOString(),
        UserMod: '',
        FechaMod: new Date().toISOString()
      } as Noticia;
    }

    // Algunos backends usan 'description' o 'content' en lugar de 'contenido'
    const contenido = item.contenido ?? item.description ?? item.content ?? item.body ?? '';
    const titulo = item.titulo ?? item.title ?? '';
    const autor = item.autor ?? item.author ?? item.user ?? item.UserAlta ?? '';
    const fecha = item.fecha ?? item.date ?? item.created_at ?? item.FechaAlta ?? new Date().toISOString();
    const categoria = item.categoria ?? item.category ?? '';
    const imagenUrl = item.imagenUrl ?? item.imageUrl ?? item.thumbnail ?? '';
    const destacada = (item.destacada ?? item.featured ?? item.activo) ? true : false;
    const userAlta = item.UserAlta ?? item.usuario_id ?? item.user_id ?? item.user ?? '';

    return {
      id: item.id ?? item._id ?? item.news_id ?? undefined,
      titulo,
      contenido,
      autor,
      fecha,
      categoria,
      imagenUrl,
      destacada,
      UserAlta: String(userAlta),
      FechaAlta: fecha,
      UserMod: item.UserMod ?? '',
      FechaMod: item.FechaMod ?? ''
    } as Noticia;
  }

  // GET - Obtener una noticia por ID
  obtenerNoticiaPorId(id: string): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nueva noticia
  crearNoticia(noticia: Noticia): Observable<Noticia> {
    // Map frontend Noticia -> API payload expected by /api/news
    const categoriaId = this.toNumberIfNumeric(noticia.categoria);
    const uidFromForm = noticia.UserAlta;
    const uidFromAuth = this.auth.getCurrentUserId();
    const usuarioIdNum = this.toNumberIfNumeric(uidFromForm) ?? this.toNumberIfNumeric(uidFromAuth);

    const payload: any = {
      // Titles / content (both spanish and english keys for compatibility)
      titulo: noticia.titulo,
      title: noticia.titulo,
      description: noticia.contenido,
      contenido: noticia.contenido,

      // Category (id when available)
      categoria_id: categoriaId !== null ? categoriaId : undefined,
      categoria: noticia.categoria,
      category: noticia.categoria,

      // User who creates the news (id preferred, numeric)
      usuario_id: usuarioIdNum !== null ? usuarioIdNum : undefined,
      user_id: usuarioIdNum !== null ? usuarioIdNum : undefined,

      // Optional image
      imagenUrl: noticia.imagenUrl || undefined,

      activo: noticia.destacada ?? true
    };

    // Debug: log payload, target URL and token presence so we can confirm the request and headers in the console
    try { console.debug('[NoticiasService] crearNoticia ->', this.apiUrl, payload, 'tokenPresent=', !!this.auth.getToken()); } catch (e) {}

    return this.http.post<Noticia>(this.apiUrl, payload as any).pipe(
      tap((created) => {
        try { console.info('[NoticiasService] crearNoticia success', created); this.toast.success('Noticia creada correctamente'); } catch (e) {}
      }),
      catchError((err) => {
        try {
          console.error('[NoticiasService] crearNoticia error', err);
          // Log response body if present for easier debugging
          try { console.debug('[NoticiasService] crearNoticia response body', err && err.error); } catch (e) {}
          const serverMsg = err?.error?.message || err?.error || err?.message || err?.statusText || '';
          this.toast.error('Error al crear noticia: ' + String(serverMsg));
        } catch (e) {}
        return throwError(err);
      })
    );
  }

  // PUT - Actualizar noticia
  actualizarNoticia(id: string, noticia: Noticia): Observable<Noticia> {
    const categoriaId = this.toNumberIfNumeric(noticia.categoria);
    const uidFromForm = noticia.UserAlta;
    const uidFromAuth = this.auth.getCurrentUserId();
    const usuarioIdNum = this.toNumberIfNumeric(uidFromForm) ?? this.toNumberIfNumeric(uidFromAuth);

    const payload: any = {
      categoria_id: categoriaId !== null ? categoriaId : undefined,
      usuario_id: usuarioIdNum !== null ? usuarioIdNum : undefined,
      titulo: noticia.titulo,
      description: noticia.contenido,
      activo: noticia.destacada ?? true,
      // indicate who modified this record (backend may use token, but add for compatibility)
      UserMod: uidFromAuth || uidFromForm || undefined
    };
    return this.http.put<Noticia>(`${this.apiUrl}/${id}`, payload as any).pipe(
      tap((updated) => {
        try { console.info('[NoticiasService] actualizarNoticia success', updated); this.toast.success('Noticia actualizada'); } catch (e) {}
      }),
      catchError((err) => {
        try { console.error('[NoticiasService] actualizarNoticia error', err); this.toast.error('Error al actualizar noticia'); } catch (e) {}
        return throwError(err);
      })
    );
  }

  // DELETE - Eliminar noticia
  eliminarNoticia(id: string): Observable<Noticia> {
    try { console.debug('[NoticiasService] eliminarNoticia ->', `${this.apiUrl}/${id}`, 'tokenPresent=', !!this.auth.getToken()); } catch (e) {}

    return this.http.delete<Noticia>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        try { console.info('[NoticiasService] eliminarNoticia success', id); this.toast.success('Noticia eliminada'); } catch (e) {}
      }),
      catchError((err) => {
        try { console.error('[NoticiasService] eliminarNoticia error', err); this.toast.error('Error al eliminar noticia'); } catch (e) {}
        return throwError(err);
      })
    );
  }

  // GET - Obtener noticias destacadas (filtramos en el cliente por ahora)
  obtenerNoticiasDestacadas(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.apiUrl).pipe(
      tap((res) => {
        try { console.info('[NoticiasService] obtenerNoticiasDestacadas -> count', Array.isArray(res) ? res.length : 'n/a'); } catch (e) {}
      }),
      catchError((err) => {
        try { console.error('[NoticiasService] obtenerNoticiasDestacadas error', err); this.toast.error('Error cargando noticias destacadas'); } catch (e) {}
        return throwError(err);
      })
    );
  }

  private toNumberIfNumeric(value: any): number | null {
    if (value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
}
