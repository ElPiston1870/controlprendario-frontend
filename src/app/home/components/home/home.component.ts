import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../../../prestamos/services/prestamo.service';
import { MovimientoService } from '../../../movimientos/services/movimiento.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Maquina, Prestamo } from '../../../prestamos/models/prestamo.interface';

interface ResumenNegocio {
  dineroFluyendo: number;
  dineroDisponible: number;
  prestamosVencidos: any[];
  maquinasVencidas: any[];
  interesesGenerados: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, CommonModule, SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  prestamos: Prestamo[] = [];
  maquinas: Maquina[] = [];
  
  private prestamoService = inject(PrestamoService);
  private movimientoService = inject(MovimientoService);
  private translateService = inject(TranslateService);

  resumen: ResumenNegocio = {
    dineroFluyendo: 0,
    dineroDisponible: 0,
    prestamosVencidos: [],
    maquinasVencidas: [],
    interesesGenerados: 0
  };

  loading = true;
  error = '';

  ngOnInit() {
    this.cargarResumen();

  }

  private cargarResumen() {
    // Cargar préstamos activos
    this.prestamoService.getPrestamosVencidos().subscribe({
      next: (response) => {

        this.loading = false;
        
        // Filtrar préstamos vencidos
        this.resumen.prestamosVencidos = response
        .sort((a, b) => {
          const fechaA = new Date(a.fechaVencimiento!).getTime();
          const fechaB = new Date(b.fechaVencimiento!).getTime();
          return fechaB - fechaA; // Ordenar por fecha de vencimiento más reciente
        });        
      },
      error: (error) => {
        this.translateService.get('HOME.ERROR_LOADING_LOANS').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        console.error('Error:', error);
      }
    });
    this.prestamoService.getMaquinasVencidas().subscribe({
      next: (response) => {
        this.loading = false;

        this.resumen.maquinasVencidas = response
        .sort((a, b) => {
          const fechaA = new Date(a.fechaVencimiento!).getTime();
          const fechaB = new Date(b.fechaVencimiento!).getTime();
          return fechaB - fechaA; // Ordenar por fecha de vencimiento más reciente
        });
      },
      error: (error) => {
        this.translateService.get('HOME.ERROR_LOADING_MACHINES').subscribe((res: string) => {
          this.error = res;
        });
        this.loading = false;
        console.error('Error:', error);
      }
    })
  

    // Cargar balance de movimientos
    this.movimientoService.obtenerBalance().subscribe({
      next: (balance) => {
        this.resumen.dineroFluyendo = balance.activos;
        this.resumen.dineroDisponible = balance.total;
      },
      error: (error) => {
        console.error('Error al cargar el balance:', error);
      }
    });
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat(this.translateService.currentLang, {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  }

  getDisponiblePercentage(): number {
    if (this.resumen.dineroFluyendo === 0) return 0;
    const percentage = (this.resumen.dineroDisponible / this.resumen.dineroFluyendo) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Limitar entre 0 y 100
  }

  getDiasVencidos(fechaVencimiento: string): number {
    const fechaVenc = new Date(fechaVencimiento);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaVenc.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

}
