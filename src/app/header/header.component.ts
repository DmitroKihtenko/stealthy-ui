import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserMenuComponent} from "./user-menu/user-menu.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    UserMenuComponent
  ]
})
export class HeaderComponent {
  constructor(private router: Router) {}

  toSignIn() {
    this.router.navigateByUrl('/sign-in');
  }

  toSignUp() {
    this.router.navigateByUrl('/sign-up');
  }

  toDownload() {
    this.router.navigateByUrl('/');
  }
}
