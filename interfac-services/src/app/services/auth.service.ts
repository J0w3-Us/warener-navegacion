import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ToastService } from '../shared/toast.service';

interface LoginResponse {
  token: string;
  usuario?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private usuariosUrl = 'http://localhost:4000/api/usuarios';
  private tokenKey = 'authToken';
  private userIdKey = 'currentUserId';
  private _currentUserRole: string | null = null;

  constructor(private http: HttpClient, private toast: ToastService) {}

  private hasLocalStorage(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch (e) {
      return false;
    }
  }

  login(credentials: { nick: string; pass: string }): Observable<LoginResponse | any> {
    // Map frontend fields to backend expected fields: { email, password }
    const payload = {
      email: credentials.nick,
      password: credentials.pass,
    };

    // Debug: log outgoing payload to help diagnose 4000 responses from the API
    try {
      console.debug('[AuthService] POST', `${this.apiUrl}/login`, 'payload=', payload);
    } catch (e) {
      // ignore
    }

    // Request as text so we can handle cases where the server returns HTML (swagger/docs) by mistake.
    return this.http.post(`${this.apiUrl}/login`, payload, { responseType: 'text' }).pipe(
      map((raw: string) => {
        // Try parse JSON response; if it's HTML, rethrow a controlled error
        try {
          const parsed = JSON.parse(raw);
          // persist token and user id if possible
          if (this.hasLocalStorage()) {
            if (parsed && parsed.token) {
              localStorage.setItem(this.tokenKey, parsed.token);
            }
            // prefer common fields `usuario` or `user` in case backend returns different shapes
            if (parsed && parsed.usuario && parsed.usuario.id) {
              localStorage.setItem(this.userIdKey, String(parsed.usuario.id));
            } else if (parsed && parsed.user && parsed.user.id) {
              localStorage.setItem(this.userIdKey, String(parsed.user.id));
            }
          }
          this._currentUserRole = null;
          return parsed as LoginResponse;
        } catch (err) {
          // Received non-JSON (probably HTML). Attach the raw body for debugging upstream.
          throw { name: 'NonJsonResponse', body: raw };
        }
      }),
      tap((parsed: any) => {
        try {
          console.info('[AuthService] login success', parsed);
          this.toast.success('Inicio de sesión correcto');
        } catch (e) {}
      }),
      catchError((err) => {
        try {
          console.error('[AuthService] login error', err);
          this.toast.error('Error al iniciar sesión');
        } catch (e) {}
        return throwError(err);
      })
    );
  }

  registro(payload: { correo?: string; contraseña?: string; email?: string; password?: string }) {
    // Build a payload compatible with different backends by including both
    // Spanish and English field names (correo / email, contraseña / password).
    const correo = payload.correo ?? payload.email ?? '';
    const contraseña = payload.contraseña ?? payload.password ?? '';

    // also provide a non-accented Spanish key 'contrasena' (many backends expect this)
    const body: any = {
      // keep the Spanish keys
      correo,
      contraseña,
      contrasena: contraseña,
      // and also include English equivalents in case backend expects them
      email: correo,
      password: contraseña
    };

  try { console.debug('[AuthService] registro POST', `${this.apiUrl}/registro`, body); } catch (e) {}

  return this.http.post<any>(`${this.apiUrl}/registro`, body).pipe(
      tap((res) => {
        try {
          console.info('[AuthService] registro success', res);
          this.toast.success('Usuario registrado correctamente');
        } catch (e) {}
      }),
      catchError((err) => {
        try {
          console.error('[AuthService] registro error', err);
          // Provide a clearer message for common validation / conflict responses
          if (err && err.status === 422) {
            // 422 Unprocessable Entity often used for validation or user exists
            const m = err.error && (err.error.message || err.error.msg || JSON.stringify(err.error));
            const message = m && m !== '{}' ? String(m) : 'La cuenta ya existe o los datos son inválidos.';
            this.toast.error(message);
          } else {
            this.toast.error('Error al registrar usuario');
          }
        } catch (e) {}
        return throwError(err);
      })
    );
  }

  getToken(): string | null {
    if (!this.hasLocalStorage()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUserId(): string | null {
    if (!this.hasLocalStorage()) return null;
    return localStorage.getItem(this.userIdKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (this.hasLocalStorage()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
    }
    this._currentUserRole = null;
  }

  /**
   * Fetch and cache the current user's role. Returns Observable<string|null>.
   * If role is already cached, returns the cached value as an Observable.
   */
  getCurrentUserRole(): Observable<string | null> {
    if (this._currentUserRole !== null) {
      return of(this._currentUserRole);
    }

    const uid = this.getCurrentUserId();
    if (!uid) {
      return of(null);
    }

    return this.http.get<any[]>(this.usuariosUrl).pipe(
      map((users) => {
        const me = users.find((u: any) => String(u.id) === String(uid));
        this._currentUserRole = me ? me.role || null : null;
        return this._currentUserRole;
      })
    );
  }
}
