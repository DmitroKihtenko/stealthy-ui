import {Component, HostBinding} from '@angular/core';
import {ErrorViewComponent} from "../error-view/error-view.component";
import {FormsModule} from "@angular/forms";
import {UsersService} from "../users.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  imports: [
    ErrorViewComponent,
    FormsModule
  ]
})
export class SignUpComponent {
  @HostBinding('class') classes = 'col-8 d-flex justify-content-md-center align-items-center bg-diluted text-lg mx-2 my-2';

  username: string = '';
  password: string = '';
  loginSubscription: Subscription | null = null;
  addUserSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginSubscription = this.usersService.loginRequest.subscribe(
      {next: value => this.router.navigateByUrl('/space')}
    );

    this.addUserSubscription = this.usersService.addUserRequest.subscribe(
      {next: value => {
        this.usersService.login(this.username, this.password);
      }}
    )
  }

  onOnDestroy() {
    if (this.addUserSubscription) {
      this.addUserSubscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSignUp() {
    this.usersService.addUser(this.username, this.password);
  }
}
