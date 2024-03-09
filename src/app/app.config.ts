import {APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import { createAppRoutes } from './app.routes';
import {ConfigService} from './config.service';
import {Config} from '../config';


export function createAppConfig(config: Config | null): ApplicationConfig {
  function initConfig(configService: ConfigService) {
    return () => {
      if (config) {
        configService.config = config;
      }
    }
  }

  return {
    providers: [
      provideRouter(
        createAppRoutes(config),
        withRouterConfig({onSameUrlNavigation: 'reload'})
      ),
      provideHttpClient(),
      ConfigService,
      {
        provide: APP_INITIALIZER,
        useFactory: initConfig,
        deps: [ConfigService],
        multi: true
      }
    ]
  }
}
