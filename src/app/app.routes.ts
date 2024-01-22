import { Routes } from '@angular/router';
import {DownloadComponent} from "./download/download.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SpaceComponent} from "./space/space.component";
import {ErrorComponent} from "./error/error.component";
import {Config} from "../config";


export function createAppRoutes(config: Config | null): Routes {
  if (config) {
    let baseUrlAsPart = config.routing.baseUrl;
    if (baseUrlAsPart != '') {
      baseUrlAsPart += '/';
    }
    return [
      { path: config.routing.baseUrl + '', component: DownloadComponent },
      { path: baseUrlAsPart + 'sign-up', component: SignUpComponent },
      { path: baseUrlAsPart + 'sign-in', component: SignInComponent },
      { path: baseUrlAsPart + 'space', component: SpaceComponent },
      { path: '**', component: ErrorComponent }
    ]
  } else {
    return [
      { path: '**', component: ErrorComponent }
    ]
  }
}
