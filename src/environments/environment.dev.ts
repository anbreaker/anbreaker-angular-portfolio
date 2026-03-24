import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: import.meta.env['NG_APP_API_URL'] ?? 'http://localhost:3000',
  env: 'development',
  enableDebug: true,
  userDev: import.meta.env['NG_APP_USER_DEV'] ?? null,
};
