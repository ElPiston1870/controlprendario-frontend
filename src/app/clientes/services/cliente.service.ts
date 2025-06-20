import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.interface';
import { environment } from '../../core/enviroment';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private apiUrl =  `${environment.apiUrl}/clientes`;

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        withCredentials: true
      };

    constructor(private http: HttpClient) { }

    crearCliente(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, cliente);
    }

    obtenerClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl);
    }

    obtenerClientePorId(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
    }
    actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
    }
    
    eliminarCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    buscarClientes(nombre: string = '', numeroDocumento: string = ''): Observable<Cliente[]> {
      let params = new HttpParams();
      
      // Si el mismo término se usa para nombre y número de documento
      if (nombre && nombre === numeroDocumento) {
          params = params.set('termino', nombre);
          return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, { params });
      }

      // Si se proporcionan términos diferentes
      if (nombre.trim()) {
          params = params.set('nombre', nombre);
      }
      if (numeroDocumento.trim()) {
          params = params.set('numeroDocumento', numeroDocumento);
      }
      
      return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, { params });
  }
      
}