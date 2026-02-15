import { Component } from '@angular/core';
import { SidebarComponent } from "../../../pages/components/sidebar/sidebar.component";
import { HeaderComponent } from "../../../pages/components/header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LenguageSelectorComponent } from "../../../internationalization/components/lenguage-selector/lenguage-selector.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [RouterModule, FormsModule, SidebarComponent, HeaderComponent, LenguageSelectorComponent, CommonModule, TranslateModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  constructor(
    private router: Router
  ) {}
}