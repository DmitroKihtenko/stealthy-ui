import {Component, HostBinding} from '@angular/core';
import {UsersService} from "../../users.service";
import {NavigationEnd, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.component.html',
  imports: [
    NgIf
  ]
})
export class UserMenuComponent {
  @HostBinding('class') classes = 'col w-100 d-flex';

  username: string | null = null;
  routerSubscription: Subscription | null = null;
  getUserSubscription: Subscription | null = null;


  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.reloadUsername();
      });

    this.getUserSubscription = this.usersService.getUserRequest.subscribe(
      {next: value => this.username = value['username']}
    )

    this.reloadUsername();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }
  }

  reloadUsername() {
    this.usersService.getUser();
  }

  space() {
    this.router.navigateByUrl('/space');
  }

  logout() {
    this.usersService.logout();
    this.router.navigateByUrl('/');
  }
}
