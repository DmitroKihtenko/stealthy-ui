import {Component, HostBinding} from '@angular/core';
import {FileUploadComponent} from "./file-upload/file-upload.component";
import {ErrorViewComponent} from "../error-view/error-view.component";
import {FilesService} from "../files.service";
import {ErrorsService} from "../errors.service";
import {FilesMetadataService} from "../files-metadata.service";
import {ConfigService} from "../config.service";
import {NgForOf, NgIf} from "@angular/common";
import {DateTimeFormatter, LocalDateTime, ZoneOffset} from "@js-joda/core";
import {ClipboardModule} from "ngx-clipboard";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-space',
  standalone: true,
  templateUrl: './space.component.html',
  imports: [
    FileUploadComponent,
    ErrorViewComponent,
    NgIf,
    NgForOf,
    ClipboardModule
  ]
})
export class SpaceComponent {
  @HostBinding('class') classes = 'col-10 d-flex justify-content-md-center align-items-center bg-diluted mx-2 my-2';

  skip: number = 0;
  limit: number = 6;
  total: number | null = null;
  metadataList: any[] = [];
  getMetadataSubscription: Subscription | null = null;
  uploadSubscription: Subscription | null = null;
  navigationSubscription: Subscription | null = null;
  intervalId: number | null = null;

  constructor(
    private filesService: FilesService,
    private filesMetadataService: FilesMetadataService,
    private configService: ConfigService,
    private errorsService: ErrorsService,
    private router: Router
  ) {
    this.limit = this.configService.config.pagination.perPageLimit;
  }

  ngOnInit() {
    this.getMetadataSubscription = this.filesMetadataService.
    getMetadataRequest.subscribe(
      {next: value => {
        this.total = value['total'];
        this.metadataList = value['records'];
      }}
    )

    this.uploadSubscription = this.filesService.
    uploadFileRequest.subscribe(
      {next: value => {
        this.errorsService.setHidden(true);
        this.skip = 0;
        this.updateMetadataList();
      }}
    )

    this.navigationSubscription = this.router.events.subscribe((next: any) => {
      if (next instanceof NavigationEnd) {
        this.updateMetadataList()
      }
    });

    this.updateMetadataList();

    this.intervalId = setInterval(
      () => {
        this.updateMetadataList();
      }, 15000
    )
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (this.getMetadataSubscription) {
      this.getMetadataSubscription.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateMetadataList() {
    this.filesMetadataService.getMetadata(
      this.skip, this.limit
    );
  }

  onNextPage() {
    this.errorsService.setHidden(true);
    this.skip += this.limit;

    this.updateMetadataList();
  }

  onPreviousPage() {
    this.errorsService.setHidden(true);
    if (this.skip == 0) {
      return;
    } else if (this.skip - this.limit < 0) {
      this.skip = 0;
    } else {
      this.skip -= this.limit;
    }

    this.updateMetadataList();
  }

  isPreviousPageDisabled(): boolean {
    return this.skip === 0;
  }

  isNextPageDisabled(): boolean {
    if (this.total == null) {
      return false;
    } else {
      return this.skip + this.limit >= this.total;
    }
  }

  getFileExtension(filename: string) {
    const parts = filename.split('.');
    if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
      return '-';
    }
    return parts.pop();
  }

  getFileSizeRounded(size: number): number {
    return Math.round((size / 1024) * 100) / 100;
  }

  timestampToDatetime(timestamp: number): string {
    const formatter = DateTimeFormatter.ofPattern(
      'yyyy-MM-dd HH:mm:ss'
    );
    const timezoneHours = new Date().getTimezoneOffset() / 60;

    return LocalDateTime.ofEpochSecond(
      timestamp, 0, ZoneOffset.ofHours(-timezoneHours)
    ).format(formatter);
  }

  getFileLink(fileId: string): string {
    let baseUrl = this.configService.config.routing.baseUrl;
    if (baseUrl != '') {
      baseUrl = '/' + baseUrl;
    }
    return window.location.protocol + '//' +
      window.location.host + baseUrl + '?file-id=' + fileId;
  }

  toFileDownload(fileId: string) {
    this.router.navigateByUrl(
      this.configService.config.routing.baseUrl + '?file-id=' + fileId
    );
  }
}
