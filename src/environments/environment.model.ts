export interface Environment {
  production: boolean;
  apiUrl: string;
  env: 'default' | 'development' | 'demo' | 'production' | 'test' | 'preproduction';
  enableDebug: boolean;
  userDev: string | null;
}
