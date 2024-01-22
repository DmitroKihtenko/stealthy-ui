import { bootstrapApplication } from '@angular/platform-browser';
import { createAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { readConfigFile } from "./config";

readConfigFile().
then(config => {
  bootstrapApplication(
    AppComponent, createAppConfig(config)
  ).catch((err) => console.error(err));
}).catch(reason => {
  bootstrapApplication(
    AppComponent, createAppConfig(null)
  ).catch((err) => console.error(err));
});
