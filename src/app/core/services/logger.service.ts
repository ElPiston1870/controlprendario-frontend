import { Injectable } from '@angular/core';
import { environment } from '../enviroment';

/**
 * Servicio centralizado de logging
 * Solo muestra logs en modo desarrollo
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  
  /**
   * Log de información general
   * Solo se muestra en desarrollo
   */
  log(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.log(message, ...args);
    }
  }

  /**
   * Log de errores
   * Solo se muestra en desarrollo
   */
  error(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.error(message, ...args);
    }
  }

  /**
   * Log de advertencias
   * Solo se muestra en desarrollo
   */
  warn(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.warn(message, ...args);
    }
  }

  /**
   * Log de información
   * Solo se muestra en desarrollo
   */
  info(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.info(message, ...args);
    }
  }

  /**
   * Log de debug
   * Solo se muestra en desarrollo
   */
  debug(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.debug(message, ...args);
    }
  }
}
