import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import * as yaml from 'js-yaml';
import {Config} from '../config';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _config: Config = new Config();

  constructor(private httpClient: HttpClient) {}

  set config(value: Config) {
    this._config = value;
  }

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
