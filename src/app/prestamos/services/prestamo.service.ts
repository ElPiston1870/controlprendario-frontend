import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, of, tap, throwError } from 'rxjs';
import { Maquina, Prestamo, PrestamoMaquinaResponse, PrestamoConResumen } from '../models/prestamo.interface';
import { PagoService } from '../../pagos/services/pago.service';
import { log } from 'console';
import { PrestamoMaquina } from '../models/prestamomaquina.interface';
import { environment } from '../../core/enviroment';

@Injectable({
    providedIn: 'root'
  })
  export class PrestamoService {
    private apiUrl =  `${environment.apiUrl}/prestamos`;
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    constructor(
      private http: HttpClient,
      private pagoService: PagoService
    ) {}
  
    getPrestamos(tableName: string): Observable<(Prestamo | Maquina)[]> {
      return this.http.get<(Prestamo | Maquina)[]>(`${this.apiUrl}/${tableName}`).pipe(
          tap(prestamos => console.log('Préstamos obtenidos:', prestamos)),
          catchError(this.handleError)
      );
    }

    getAllPrestamos():Observable<PrestamoMaquinaResponse>{
      return this.http.get<PrestamoMaquinaResponse>(`${this.apiUrl}`)
    }

    getPrestamosVencidos(): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>(`${this.apiUrl}/vencidos`)
    }

    getMaquinasVencidas(): Observable<Prestamo[]> {
      return this.http.get<Prestamo[]>(`${this.apiUrl}/maquinas/vencidos`)
    }
  
    getPrestamoById(id: number): Observable<(Prestamo)> {
      return this.http.get<Prestamo>(`${this.apiUrl}/${id}`)
    }

    getPrestamoPorId(id: number): Observable<(Maquina)> {
      return this.http.get<Maquina>(`${this.apiUrl}/maquina/${id}`)
      
    }
  
    createPrestamo(prestamo: any): Observable<Prestamo> {
      return this.http.post<Prestamo>(this.apiUrl, prestamo).pipe(
        tap(response => console.log('Préstamo creado:', response)),
        catchError(this.handleError)
      );
    }

    ultimoId(tableName:string): Observable<any>{
      if(tableName === 'vehiculo'){
        return this.http.get<any>(`${this.apiUrl}/ultimo-id`).pipe(
          tap(response => console.log('Id obtenido:', response)),
          catchError(this.handleError)
        );
      }else{
        return this.http.get<any>(`${this.apiUrl}/ultimo-id/maquina`).pipe(
          tap(response => console.log('Id obtenido:', response)),
          catchError(this.handleError)
        );
      }
    }
  
    updatePrestamo(id: number, prestamo: any): Observable<Prestamo> {
      return this.http.put<Prestamo>(`${this.apiUrl}/${id}`, prestamo).pipe(
          tap(response => console.log('Préstamo actualizado:', response)),
          catchError(this.handleError)
      );
    }

    actualizarPrestamo(id: number, prestamo: any): Observable<Maquina> {
      return this.http.put<Maquina>(`${this.apiUrl}/maquina/${id}`, prestamo).pipe(
          tap(response => console.log('Préstamo actualizado:', response)),
          catchError(this.handleError)
      );
    }
  
    deletePrestamo(tableName: string,id: number): Observable<void> {
      if(tableName === 'vehiculos'){
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => console.log('Préstamo eliminado:', id)),
            catchError(this.handleError)
        );
      }else{
        return this.http.delete<void>(`${this.apiUrl}/maquina/${id}`).pipe(
          tap(() => console.log('Préstamo eliminado:', id)),
          catchError(this.handleError)
        );
      }
    }

    private handleError(error: HttpErrorResponse) {
      console.error('An error occurred:', error);
      let errorMessage = 'Ocurrió un error al procesar la solicitud.';
      
      if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
          // Error del lado del servidor con mensaje string
          errorMessage = error.error;
      } else if (error.error?.message) {
          // Error del lado del servidor con objeto de error
          errorMessage = error.error.message;
      }
      
      return throwError(() => errorMessage);
  }

  buscarPrestamos(tableName: string,termino: string, numeroDocumento: string): Observable<any[]> {
    let params = new HttpParams();
    if (tableName === 'vehiculo'){
      if (termino) {
        params = params.set('termino', termino);
      }
      if (numeroDocumento) {
        params = params.set('numeroDocumento', numeroDocumento);
      }
      return this.http.get<Prestamo[]>(`${this.apiUrl}/buscar`, { params });
    }else{
      if (termino) {
        params = params.set('termino', termino);
      }
      if (numeroDocumento) {
        params = params.set('numeroDocumento', numeroDocumento);
      }
      return this.http.get<PrestamoMaquina[]>(`${this.apiUrl}/maquina/buscar`, { params });
    }
  }

  getPrestamosConResumen(tableName: string): Observable<PrestamoConResumen[]> {
    if (tableName === 'vehiculos') {
      return this.getAllPrestamos().pipe(
        map(response => {
            const observables = response.prestamos.map(prestamo =>
            forkJoin({
              prestamo: Promise.resolve(prestamo),
              maquina: Promise.resolve({} as Maquina)
            })
            );
          
          return forkJoin(observables);
        }),
        mergeMap(results => results)
      );
    } else if (tableName === 'maquinas') {
      return this.getAllPrestamos().pipe(
        map(response => {
          const observables = response.maquinas.map(maquina =>
            forkJoin({
              maquina: Promise.resolve(maquina),
              prestamo: Promise.resolve({} as Prestamo)
            })
          );
          return forkJoin(observables);
        }),
        mergeMap(results => results)
      );
    }

    throw new Error(`Tabla no válida: ${tableName}`);
  }
  
  calcularInteresTotal(montoPrestamo: number, tasaInteres: number): number {
    return montoPrestamo * (tasaInteres / 100) * 3; // Multiplicado por 3 meses
  }

}
  