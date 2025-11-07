import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estado } from '../interface/estado.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  // Base API URL
  private apiUrl = 'http://localhost:4000/api/estados';

  constructor(private http: HttpClient) {}

  // --- GET: obtener todos los estados ---
  obtenerEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.apiUrl);
  }

  // --- POST: crear un nuevo estado (ejemplo) ---
  crearEstado(): Observable<Estado> {
    const nuevoEstado: Estado = {
      nombre: 'Sonora',
      abreviacion: 'SON',
      activo: true,
      UserAlta: 'Admin',
      FechaAlta: '1990-01-01',
      UserMod: '',
      FechaMod: '1990-01-01',
      UserBaja: '',
      FechaBaja: '1990-01-01'
    };
  return this.http.post<Estado>(this.apiUrl, nuevoEstado);
  }

  // --- PUT: actualizar un estado por id (ejemplo) ---
  actualizarEstado(id: string): Observable<Estado> {
    const estadoActualizado: Estado = {
      nombre: 'Yucatan',
      abreviacion: 'YUC',
      activo: true,
      UserAlta: 'Admin',
      FechaAlta: '1990-01-01',
      UserMod: '',
      FechaMod: '1990-01-01',
      UserBaja: '',
      FechaBaja: '1990-01-01'
    };
  return this.http.put<Estado>(`${this.apiUrl}/${id}`, estadoActualizado);
  }

  // --- DELETE: eliminar un estado por id ---
  eliminarEstado(id: string): Observable<Estado> {
  return this.http.delete<Estado>(`${this.apiUrl}/${id}`);
  }
}