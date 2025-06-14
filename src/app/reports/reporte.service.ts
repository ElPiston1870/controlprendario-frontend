import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../core/enviroment";

@Injectable({
    providedIn: 'root'
  })
  export class ReporteService {
    private apiUrl =  `${environment.apiUrl}/reportes`;
  
    constructor(private http: HttpClient) {}
  
    generarDocumentoEmpeno(idPrestamo: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/documento-empeno/${idPrestamo}`, {
        responseType: 'blob'
      });
    }

    generarDocumentoEmpenoMaquina(idPrestamoMaquina: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/documento-maquina/${idPrestamoMaquina}`, {
        responseType: 'blob'
      });
    }
  }