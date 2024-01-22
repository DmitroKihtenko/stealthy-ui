import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserMenuComponent} from "./user-menu/user-menu.component";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    UserMenuComponent
  ]
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private configService: ConfigService
  ) {}

  toSignIn() {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl + '/sign-in'
    );
  }

  toSignUp() {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl + '/sign-up'
    );
  }

  toDownload() {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl
    );
  }
}
