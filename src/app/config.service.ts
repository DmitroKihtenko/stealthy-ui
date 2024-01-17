import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import * as yaml from 'js-yaml';


export class BackendConfig {
  apiUrl: string = 'http://localhost/';
}


export class InstitutionConfig {
  name: string = 'Stealthy';
  description: string = 'Web application for secure sharing sensitive information';
  link: string | null = null;
}


export class PaginationConfig {
  perPageLimit: number = 6;
}


export class Config {
  backend: BackendConfig = new BackendConfig();
  institution: InstitutionConfig = new InstitutionConfig();
  pagination: PaginationConfig = new PaginationConfig();
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config: Config = new Config();

  constructor(private httpClient: HttpClient) {}

  async load() {
    let body = await lastValueFrom(
      this.httpClient.get('assets/config.yml',
        { responseType: 'text' })
    );
    let configData = yaml.load(body);
    this._config = Object.assign(new Config(), configData);
  }

  get config(): any {
    return this._config;
  }
}
