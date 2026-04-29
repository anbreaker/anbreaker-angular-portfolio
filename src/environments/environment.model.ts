export interface Environment {
  apiUrl: string;
  enableDebug: boolean;
  env: 'default' | 'development' | 'demo' | 'production' | 'test' | 'preproduction';
  production: boolean;
  userDev: string | null;
}
