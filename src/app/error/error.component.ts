import {Component, HostBinding} from '@angular/core';
import {ErrorViewComponent} from "../error-view/error-view.component";
import {ErrorsService} from "../errors.service";

@Component({
  selector: 'app-error',
  standalone: true,
  templateUrl: './error.component.html',
  imports: [
    ErrorViewComponent
  ]
})
export class ErrorComponent {
  @HostBinding('class') classes = 'col-8 d-flex justify-content-md-center align-items-center bg-diluted text-lg mx-2 my-2';

  constructor(private errorsService: ErrorsService) {}

  ngOnInit() {
    if (!this.errorsService.showOnInit) {
      this.errorsService.setErrors(['Page not found']);
      this.errorsService.setHidden(false);
      this.errorsService.showOnInit = true;
    }
  }
}
