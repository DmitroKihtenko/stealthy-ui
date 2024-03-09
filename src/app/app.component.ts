import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {ErrorViewComponent} from './error-view/error-view.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ErrorViewComponent, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private router: Router) {}
}
