import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'https://preprod-api.example.com',
  env: 'preproduction',
  enableDebug: false,
  userDev: null,
};
