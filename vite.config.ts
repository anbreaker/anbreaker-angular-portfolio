import angular from '@analogjs/vite-plugin-angular';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, Plugin } from 'vite';

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
  publicDir: '../public',

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

  envPrefix: 'NG_APP_',

  server: {
    port: 4200,
    open: true,
    hmr: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
