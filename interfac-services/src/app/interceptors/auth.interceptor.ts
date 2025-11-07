import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    // Log request for debugging (non-blocking)
    try {
      console.debug('[AuthInterceptor] request', req.method, req.url, 'tokenPresent=', !!token);
    } catch (e) {}

    let outgoing = req;
    if (token) {
      outgoing = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    try {
      // Log whether Authorization header is present (mask value)
      const authHeader = outgoing.headers.get('Authorization');
      console.debug('[AuthInterceptor] outgoing header Authorization present=', !!authHeader, authHeader ? String(authHeader).slice(0, 30) + '...' : null);
    } catch (e) {}

    return next.handle(outgoing).pipe(
      tap({
        next: (event) => {
          // Could log responses here when needed (avoid noisy logs in prod)
        },
        error: (err) => {
          try { console.debug('[AuthInterceptor] response error', req.url, err); } catch (e) {}
        }
      })
    );
  }
}
