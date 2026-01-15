import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LenguageSelectorComponent } from "./internationalization/components/lenguage-selector/lenguage-selector.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, LenguageSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private translate:TranslateService) {
    translate.setDefaultLang('es');
    translate.use('es');
  }
  title = 'CONTROL_PRENDARIO';
  
}
