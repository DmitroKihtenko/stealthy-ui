import { Injectable } from '@angular/core';
import {catchError, Subject, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {ErrorsService} from "./errors.service";
import {UsersService} from "./users.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FilesMetadataService {
  getMetadataRequest: Subject<any> = new Subject<any>();

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private errorsService: ErrorsService,
    private usersService: UsersService,
  ) {}

  getMetadata(skip: number, limit: number) {
    let token = this.usersService.getTokenWithError();
    if (token != null) {
      const headers = new HttpHeaders({Authorization: token});
      const params = new HttpParams().
      set('skip', skip).
      set('limit', limit);

      this.httpClient.get(
        this.configService.config.backend.apiUrl + 'files',
        {headers: headers, params: params},
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorsService.handleError(
            error, error.error, error.status
          )}
        )
      ).subscribe({
        next: value => this.getMetadataRequest.next(value)
      });
    }
  }
}
