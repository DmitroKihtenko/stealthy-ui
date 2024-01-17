import { Component } from '@angular/core';
import {FilesService} from "../../files.service";
import {ErrorsService} from "../../errors.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  imports: [
    NgIf
  ]
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadSubscription: Subscription | null = null;

  constructor(
    private filesService: FilesService,
    private errorsService: ErrorsService,
  ) { }

  ngOnInit() {
    this.uploadSubscription = this.filesService.uploadFileRequest.subscribe(
      {next: value => this.selectedFile = null}
    )
  }

  onOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile == null) {
      this.errorsService.setErrors(["File not selected"]);
      this.errorsService.setHidden(false);
    } else {
      this.filesService.uploadFile(
        this.selectedFile, this.selectedFile.name
      );
    }
  }
}
