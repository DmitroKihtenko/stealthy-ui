import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ErrorViewComponent} from "../error-view/error-view.component";
import {FilesService} from "../files.service";
import FileSaver from 'file-saver';
import {HttpResponse} from "@angular/common/http";
import {ErrorsService} from "../errors.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [
    ErrorViewComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './download.component.html'
})
export class DownloadComponent {
  @HostBinding('class') classes = 'col-8 d-flex justify-content-md-center align-items-center bg-diluted text-lg mx-2 my-2';

  fileId: string = ''
  downloadSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService,
    private errorsService: ErrorsService
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let fileId = params.get('file-id');
      if (fileId == null) {
        fileId = ''
      }
      this.fileId = fileId;
    });

    this.downloadSubscription = this.filesService.downloadFileRequest.subscribe(
      ({
        next: (value: HttpResponse<ArrayBuffer>) => {
          let filename = "file";
          const disposition = value.headers.get('Content-Disposition');
          let mimetype = value.headers.get('Content-Type');
          if (mimetype == null) {
            mimetype = "application/octet-stream";
          }

          if (disposition != null) {
            const filenameRaw = disposition.split('filename=')[1];
            if (filenameRaw != undefined) {
              filename = decodeURIComponent(filenameRaw)
            }
          }

          if (value.body) {
            if (value.body.byteLength == 0) {
              mimetype = "application/x-empty";
            }
            const blob = new Blob([value.body], { type: mimetype });
            FileSaver.saveAs(blob, filename);
          } else {
            this.errorsService.setErrors(["No file data in server response"]);
            this.errorsService.setHidden(false);
          }
        }
      })
    )
  }

  ngOnDestroy() {
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }
  }

  downloadFile() {
    this.filesService.downloadFile(this.fileId);
  }
}
