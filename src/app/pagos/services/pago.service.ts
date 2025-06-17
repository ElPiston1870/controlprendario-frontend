import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../interfaces/pago.interface';
import { environment } from '../../core/enviroment';


@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrlPrestamos =  `${environment.apiUrl}/pagos`;
  private apiUrlMaquinas =  `${environment.apiUrl}/pagos-maquinas`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  crearPago(tableName: string ,pago: Pago): Observable<Pago> {
    if (tableName === 'vehiculos') {
      console.log('Pago :', pago);
      return this.http.post<Pago>(this.apiUrlPrestamos, pago);
    } else {
      console.log('Pago :', pago);
      return this.http.post<Pago>(this.apiUrlMaquinas, pago);
    }
  }
  

  obtenerTodosPagos(tableName : string): Observable<any[]> {
    if(tableName === 'vehiculos'){
    return this.http.get<any[]>(this.apiUrlPrestamos);
    } else {
      return this.http.get<any[]>(`${this.apiUrlPrestamos}/maquina`);
    }
  }
  
}