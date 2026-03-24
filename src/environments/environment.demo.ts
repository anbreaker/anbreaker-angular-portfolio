import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'https://demo-api.example.com',
  env: 'demo',
  enableDebug: false,
  userDev: null,
};
