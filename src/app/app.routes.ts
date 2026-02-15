import { Routes  } from '@angular/router';
import { ClienteFormComponent } from './clientes/components/cliente-form/cliente-form.component';
import { ClienteListaComponent } from './clientes/components/cliente-lista/cliente-lista.component';
import { ClienteEditarComponent } from './clientes/components/cliente-editar/cliente-editar.component';
import { HomeComponent } from './home/components/home/home.component';
import { PrestamosListaComponent } from './prestamos/components/prestamos-lista/prestamos-lista.component';
import { PagosListaComponent } from './pagos/components/pagos-lista/pagos-lista.component';
import { MovimientoListaComponent } from './movimientos/components/movimiento-lista/movimiento-lista.component';
import { PrestamosCrearComponent } from './prestamos/components/prestamos-crear/prestamos-crear.component';
import { PrestamosEditarComponent } from './prestamos/components/prestamos-editar/prestamos-editar.component';
import { ClienteViewComponent } from './clientes/components/cliente-view/cliente-view.component';
import { PrestamosViewComponent } from './prestamos/components/prestamos-view/prestamos-view.component';
import { PagosCrearComponent } from './pagos/components/pagos-crear/pagos-crear.component';
import { MovimientosCrearComponent } from './movimientos/components/movimiento-crear/movimiento-crear.component';
import { ConfiguracionComponent } from './config/components/configuracion/configuracion.component';
import { PrestamosCrearAgroComponent } from './prestamos/components/prestamos-crear-agro/prestamos-crear.component';
import { PagosCrearMaquinaComponent } from './pagos/components/pagos-crear-maquina/pagos-crear.component';
import { PrestamosMaquinaViewComponent } from './prestamos/components/prestamos-view-agro/prestamos-view.component';
import { PrestamosMaquinaEditarComponent } from './prestamos/components/prestamos-editar-agro/prestamos-editar.component';

export const routes: Routes = [
    
    {path: "configuracion", component: ConfiguracionComponent},


    {
      path: '',
      component: HomeComponent
    },

    {
        path: 'home',
        component: HomeComponent,
    },

    {
        path: 'clientes',
        children: [
        { path: '', component: ClienteListaComponent },
        { path: 'nuevo', component: ClienteFormComponent },
        { path: 'editar/:id', component: ClienteEditarComponent },
        { path: 'ver/:id', component: ClienteViewComponent }
    ]
    },

    {
        path: 'prestamos',
        children: [
          { path: '', component: PrestamosListaComponent },
          { path: 'nuevo', component: PrestamosCrearComponent },
          { path: 'new', component: PrestamosCrearAgroComponent },
          { path: 'edit/:id', component: PrestamosEditarComponent },
          { path: 'editar/:id', component: PrestamosMaquinaEditarComponent},
          { path: 'ver/:id', component: PrestamosViewComponent },
          { path: 'maquina/ver/:id', component: PrestamosMaquinaViewComponent }
        ]
    },

    {
        path: 'pagos',
        children: [
          { path: '', component: PagosListaComponent },
          { path: 'nuevo', component: PagosCrearComponent },
          { path: 'new', component: PagosCrearMaquinaComponent }
        ]
    },

    {
        path: 'movimientos',
        children: [
          { path: '', component: MovimientoListaComponent },
          { path: 'nuevo', component: MovimientosCrearComponent }
        ]
      },

    {
    path: '**',
    component: HomeComponent
    }
];
