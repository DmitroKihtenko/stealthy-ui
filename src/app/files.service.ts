import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {ErrorsService} from "./errors.service";
import {Router} from "@angular/router";
import {catchError, Subject, throwError} from "rxjs";
import {UsersService} from "./users.service";

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  uploadFileRequest: Subject<any> = new Subject<any>();
  downloadFileRequest: Subject<any> = new Subject<any>();

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private errorsService: ErrorsService,
    private usersService: UsersService,
    private router: Router
  ) {}

  uploadFile(file: File, filename: string) {
    const form = new FormData();
    form.append('file', file, filename);

    let token = this.usersService.getTokenWithError();
    if (token != null) {
      const headers = new HttpHeaders({'Authorization': token});

      this.httpClient.post(
        this.configService.config.backend.apiUrl + 'files',
        form,
        {headers: headers},
      ).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.errorsService.handleError(
            error, error.error, error.status
          )}
        )
      ).subscribe({
        next: value => this.uploadFileRequest.next(value)
      });
    }
  }

  downloadFile(fileId: string) {
    this.httpClient.get(
      this.configService.config.backend.apiUrl + "files/" + fileId,
      { observe: 'response', responseType: 'arraybuffer' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        try {
          const errorsObject = JSON.parse(
            (new TextDecoder('utf-8')).decode(error.error)
          );
          return this.errorsService.handleError(
            error, errorsObject, error.status
          )
        } catch (anotherError) {
          this.errorsService.setErrors(['Invalid server response']);
          this.errorsService.setHidden(false);
          this.router.navigateByUrl('/error');
        }
        return throwError(() => error);
      })
    ).subscribe({
      next: value => this.downloadFileRequest.next(value)
    });
  }
}
