import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from '../../prestamos/models/prestamo.interface';
import { environment } from '../../core/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicPrestamoService {
  private apiUrl =  `${environment.apiUrl}/public/prestamos`;

  constructor(private http: HttpClient) { }

  buscarPrestamos(termino?: string, numeroDocumento?: string): Observable<Prestamo[]> {
    let url = `${this.apiUrl}/buscar`;
    let params: any = {};
    
    if (termino) params.termino = termino;
    if (numeroDocumento) params.numeroDocumento = numeroDocumento;
    
    return this.http.get<Prestamo[]>(url, { params });
  }
  getPrestamoById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }
}