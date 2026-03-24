import angular from '@analogjs/vite-plugin-angular';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, Plugin } from 'vite';

// Replica el fileReplacement de Angular:
// environment.ts → environment.dev.ts cuando mode === 'dev'
function envReplacementPlugin(): Plugin {
  const devEnvPath = resolve(__dirname, 'src/environments/environment.dev.ts');

  return {
    name: 'ng-env-replacement',
    enforce: 'pre',
    load(id: string) {
      if (id.endsWith('environments/environment.ts')) {
        return readFileSync(devEnvPath, 'utf-8');
      }
      return null;
    },
  };
}

export default defineConfig({
  root: 'src',

  plugins: [
    angular({
      tsconfig: '../tsconfig.json',
    }),
    envReplacementPlugin(),
  ],

  resolve: {
    alias: {
      '@assets': '/assets',
      '@components': '/app/components',
      '@core': '/app/core',
      '@environments': '/environments',
      '@features': '/app/features',
      '@i18n': '/i18n',
      '@pages': '/app/pages',
      '@shared': '/app/shared',
      '@styles': '/styles',
    },
  },

  // Solo expone variables NG_APP_* al bundle del cliente
  envPrefix: 'NG_APP_',

  server: {
    port: 4200,
    open: true,
    hmr: true,
  },
});
