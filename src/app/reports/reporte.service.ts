import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ReporteService {
    private apiUrl = `https://controlprendario.up.railway.app/api/reportes`;
  
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