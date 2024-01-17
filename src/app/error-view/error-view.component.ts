import { Component } from '@angular/core';
import {ErrorsService} from "../errors.service";
import {NgForOf, NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-error-view',
  standalone: true,
  templateUrl: './error-view.component.html',
  imports: [
    NgForOf,
    NgIf
  ]
})
export class ErrorViewComponent {
  errorMessages: string[] = []
  hidden: boolean = true
  hiddenSubscription: Subscription | null = null;
  errorsSubscription: Subscription | null = null;

  constructor(private errorsService: ErrorsService) {
  }

  ngOnInit() {
    this.hiddenSubscription = this.errorsService.getHiddenObservable()
      .subscribe(
      {
        next: (value: boolean) => {
          this.hidden = value;
        }
      }
    )
    this.errorsSubscription = this.errorsService.getErrorsObservable()
      .subscribe(
      {
        next: (value: string[]) => {
          this.errorMessages = value;
        }
      }
    )

    if (this.errorsService.showOnInit) {
      this.errorMessages = this.errorsService.getErrors();
      this.hidden = this.errorsService.getHidden();

      this.errorsService.showOnInit = false;
    }
  }

  ngOnDestroy() {
    if (this.hiddenSubscription) {
      this.hiddenSubscription.unsubscribe();
    }
    if (this.errorsSubscription) {
      this.errorsSubscription.unsubscribe();
    }
  }
}
