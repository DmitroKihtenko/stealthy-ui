import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DownloadComponent} from "./download/download.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SpaceComponent} from "./space/space.component";
import {ErrorComponent} from "./error/error.component";

export const routes: Routes = [
  { path: '', component: DownloadComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'space', component: SpaceComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
