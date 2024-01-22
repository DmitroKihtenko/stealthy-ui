import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {Router} from "@angular/router";
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private errors: Subject<string[]> = new Subject<string[]>();
  private hidden: Subject<boolean> = new Subject<boolean>();
  private lastErrors: string[] = [];
  private lastHidden: boolean = true;
  showOnInit: boolean = false;

  constructor(
    private router: Router,
    private configService: ConfigService
  ) {
    this.getErrorsObservable().subscribe(
      {next: value => this.lastErrors = value}
    );
    this.getHiddenObservable().subscribe(
      {next: value => this.lastHidden = value}
    );
  }

  setErrors(errors: string[]) {
    this.errors.next(errors);
  }

  getErrors(): string[] {
    return this.lastErrors;
  }

  getErrorsObservable(): Observable<string[]> {
    return this.errors.asObservable();
  }

  setHidden(hidden: boolean) {
    this.hidden.next(hidden);
  }

  getHidden(): boolean {
    return this.lastHidden;
  }

  getHiddenObservable(): Observable<boolean> {
    return this.hidden.asObservable();
  }

  parseErrorsFromResponse(response: any): string[] {
    const result: string[] = [];
    try {
      for (const detail of response.detail) {
        result.push(detail.message);
      }
    } catch (error) {
      try {
        result.push(response.summary)
      } catch (error) {
        result.push("Unknown user error");
      }
    }
    return result;
  }

  handleError(error: any, errorJson: any, status: number) {
    if (status == 0) {
      this.setErrors(["Server unavailable"]);
      this.setHidden(false);
    } else {
      this.setErrors(
        this.parseErrorsFromResponse(errorJson)
      );
      this.setHidden(false);
      if (status >= 500 || status == 401 || status == 403) {
        this.showOnInit = true;
        this.router.navigateByUrl(
          this.configService.config.routing.baseUrl + '/error'
        );
      }
    }
    return throwError(() => error);
  }
}
