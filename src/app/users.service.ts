import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Subject} from 'rxjs';
import {ConfigService} from './config.service';
import {ErrorsService} from './errors.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getUserRequest: Subject<any> = new Subject<any>();
  loginRequest: Subject<any> = new Subject<any>();
  addUserRequest: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private errorsService: ErrorsService,
    private router: Router
  ) {
    this.loginRequest.subscribe(
      {
        next: (data: any) => {
          localStorage.setItem('token', data['access_token']);
        }
      }
    );
  }

  login(username: string, password: string) {
    this.http.post(
      this.configService.config.backend.apiUrl + 'login',
      {
        'username': username,
        'password': password,
      },
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorsService.handleError(
          error, error.error, error.status
        )}
      )
    ).subscribe({
      next: value => this.loginRequest.next(value)
    });
  }

  logout() {
    localStorage.removeItem('token');
  }

  addUser(username: string, password: string) {
    this.http.post(
      this.configService.config.backend.apiUrl + 'users',
      {
        'username': username,
        'password': password,
      },
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorsService.handleError(
          error, error.error, error.status
        )}
      )
    ).subscribe({
      next: value => this.addUserRequest.next(value)
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenWithError(): string | null {
    let token = this.getToken();
    if (token == null) {
      this.errorsService.setErrors(['You are not logged in']);
      this.errorsService.setHidden(false);
      this.errorsService.showOnInit = true;
      this.router.navigateByUrl(
        this.configService.config.routing.baseUrl + '/sign-in'
      );
    }
    return token;
  }

  getUser() {
    let token = this.getToken();
    if (token == null) {
      this.getUserRequest.next({});
    } else {
      const headers = new HttpHeaders({Authorization: token});

      this.http.get(
        this.configService.config.backend.apiUrl + 'users/me',
        {headers: headers}
      ).subscribe({
        next: value => this.getUserRequest.next(value)
      });
    }
  }
}
