import {Component, HostBinding} from '@angular/core';
import {UsersService} from "../users.service";
import {Router} from "@angular/router";
import {ErrorViewComponent} from "../error-view/error-view.component";
import {FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  imports: [
    ErrorViewComponent,
    FormsModule
  ]
})
export class SignInComponent {
  @HostBinding('class') classes = 'col-8 d-flex justify-content-md-center align-items-center bg-diluted text-lg mx-2 my-2';

  username: string = '';
  password: string = '';
  loginSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.loginSubscription = this.usersService.loginRequest.subscribe(
      {
        next: value => {
          this.router.navigateByUrl('/space');
        }
      }
    )
  }

  onOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSignIn() {
    this.usersService.login(this.username, this.password);
  }
}
