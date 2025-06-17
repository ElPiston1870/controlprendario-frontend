import { Cliente } from "../../clientes/models/cliente.interface";
import { Vehicle } from "./vehicle.model";



export interface ResumenPrestamo {
  capitalTotal: number;
  interesTotal: number;
  capitalPagado: number;
  interesPagado: number;
  capitalPendiente: number;
  interesPendiente: number;
}
  
export interface PrestamoBase {
    idCliente: number;
    cliente?: Cliente;
    fechaPrestamo?: string;
    fechaVencimiento?: string;
    montoPrestamo: number;
    tasaInteres: number;
    estadoPrestamo?: string;
    observaciones?: string;
    interesTotal?: number;
    capitalPagado?: number;
    interesPagado?: number;
    interesPendiente?: number;
    capitalPendiente?: number;
    totalAbonado?: number;
    saldoPendiente?: number;
}

export interface Prestamo extends PrestamoBase {
  idPrestamo?: number;
  vehiculo: Vehicle;
}

export interface Maquina extends PrestamoBase {
  idPrestamoMaquina?: number;
  tipoMaquina: string;
  marcaMaquina: string;
}

// Para tipar mejor la respuesta del servicio
export interface PrestamoConResumen {
    prestamo: Prestamo;
    maquina: Maquina;
}

export interface PrestamoMaquinaResponse{
    prestamos: Prestamo[];
    maquinas: Maquina[];
}

  