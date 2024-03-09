import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule, HttpTestingController
} from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { ConfigService } from "./config.service";
import {HttpClient} from "@angular/common/http";
import {ErrorsService} from "./errors.service";
import {EMPTY} from "rxjs";

describe('Users Service tests', () => {
  let service: UsersService;
  let configService: ConfigService;
  let errorsService: ErrorsService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let userDataFixture = {
    username: 'some_user',
    password: 'some_password'
  };
  let accessTokenFixture = {access_token: 'access_token'};
  let errorResponseFixture = {
    summary: "Unexpected user error",
    detail: [{name: "Username", message: "Incorrect username"}]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, {
        provide: ConfigService
      }]
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, ConfigService]
    });

    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    errorsService = TestBed.inject(ErrorsService);

    configService.config.backend.apiUrl = "http://test-host/";
  });

  afterEach(() => {
    service.loginRequest.unsubscribe();
    service.getUserRequest.unsubscribe();
    service.addUserRequest.unsubscribe();
    httpMock.verify();
  });

  it('should set access token if login request successful', () => {
    service.loginRequest.subscribe({
      next: value => expect(value).toBe(accessTokenFixture)
    })
    service.login(userDataFixture.username, userDataFixture.password)

    httpMock.expectOne(
      configService.config.backend.apiUrl + 'login'
    ).flush(accessTokenFixture);
    expect(localStorage.getItem('token')).toBe(accessTokenFixture.access_token);
  });

  it('should send valid data on registration', () => {
    spyOn(httpClient, 'post').and.callThrough();

    let userResponse = {username: userDataFixture.username}
    service.addUserRequest.subscribe({
      next: value => expect(value).toBe(userResponse)
    })
    service.addUser(userDataFixture.username, userDataFixture.password)

    httpMock.expectOne(
      configService.config.backend.apiUrl + 'users'
    ).flush(userResponse);
    expect(httpClient.post).toHaveBeenCalledWith(
      configService.config.backend.apiUrl + 'users',
      userDataFixture
    );

    (httpClient.post as jasmine.Spy).calls.reset();
  });

  it('should correctly process data on retrieve user', () => {
    localStorage.setItem('token', accessTokenFixture.access_token);
    let userResponse = {username: userDataFixture.username}
    service.getUserRequest.subscribe({
      next: value => expect(value).toBe(userResponse)
    })
    service.getUser()

    let req = httpMock.expectOne(
      configService.config.backend.apiUrl + 'users/me'
    );
    req.flush(userResponse);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toEqual(
      accessTokenFixture.access_token
    );
  });

  it('transfer request error to errors service', () => {
    spyOn(errorsService, 'handleError').and.callFake(
      (error, errorJson, status) => {return EMPTY});

    service.login(userDataFixture.username, userDataFixture.password)

    httpMock.expectOne(
      configService.config.backend.apiUrl + 'login'
    ).flush(errorResponseFixture, {status: 400, statusText: "Bad request"});
    expect(errorsService.handleError).toHaveBeenCalledWith(
      jasmine.anything(),
      errorResponseFixture,
      400
    );
  });
});
