import { DOCUMENT } from "@angular/common";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

/**
 * Interceptor de autenticación
 * - Agrega el token JWT a las peticiones
 * - Verifica si el token está expirado antes de cada petición
 * - Intercepta errores 401 para cerrar sesión automáticamente
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);
  const router = inject(Router);
  const storage = document.defaultView?.localStorage;

  if (storage) {
    const token = storage.getItem('token');
    
    if (token) {
      // Verificar si el token está expirado
      if (isTokenExpired(token)) {
        // Token expirado - limpiar sesión y redirigir
        clearSession(storage);
        router.navigate(['/login']);
        return next(req);
      }

      // Token válido - agregar a la petición
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      
      // Interceptar respuestas para manejar errores 401
      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Token inválido o expirado según el servidor
            clearSession(storage);
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
  }
  
  return next(req);
};

/**
 * Verifica si un token JWT está expirado
 */
function isTokenExpired(token: string): boolean {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return true;

    const payload = JSON.parse(atob(tokenParts[1]));
    
    if (!payload.exp || typeof payload.exp !== 'number') {
      return true;
    }

    const expiration = payload.exp * 1000;
    return Date.now() >= expiration;
  } catch {
    return true;
  }
}

/**
 * Limpia la sesión del usuario
 */
function clearSession(storage: Storage): void {
  storage.removeItem('token');
  storage.removeItem('roles');
  storage.removeItem('username');
  storage.removeItem('nombre');
}
