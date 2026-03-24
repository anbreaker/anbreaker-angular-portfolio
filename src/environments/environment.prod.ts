import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'https://api.example.com',
  env: 'production',
  enableDebug: false,
  userDev: null,
};
