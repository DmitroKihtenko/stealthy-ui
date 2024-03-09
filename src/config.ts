import * as yaml from 'js-yaml';

const CONFIG_FILE = 'config.yaml'

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


export class RoutingConfig {
  baseUrl: string = ''
}


export class Config {
  backend: BackendConfig = new BackendConfig();
  institution: InstitutionConfig = new InstitutionConfig();
  pagination: PaginationConfig = new PaginationConfig();
  routing: RoutingConfig = new RoutingConfig();
}


export async function readConfigFile(): Promise<Config> {
  try {
    const response = await fetch('/assets/config.yaml');
    return Object.assign(new Config(), yaml.load(await response.text()));
  } catch (e) {
    console.error("Error reading configuration file '" + CONFIG_FILE + "'");
    throw e;
  }
}
