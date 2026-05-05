import { resolve } from 'node:path';
import angular from '@analogjs/vite-plugin-angular';

import { defineConfig } from 'vite';

const environmentFileByMode: Record<string, string> = {
  demo: 'environment.demo.ts',
  dev: 'environment.dev.ts',
  development: 'environment.dev.ts',
  preproduction: 'environment.preproduction.ts',
  prod: 'environment.prod.ts',
  production: 'environment.prod.ts',
  test: 'environment.test.ts',
};

export default defineConfig(({ mode }) => {
  const environmentFile = resolve(
    __dirname,
    'src/environments',
    environmentFileByMode[mode] ?? 'environment.ts'
  );

  return {
    envPrefix: 'NG_APP_',
    root: 'src',
    publicDir: '../public',

    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rolldownOptions: {
        checks: {
          pluginTimings: false,
        },
      },
    },

    plugins: [
      angular({
        tsconfig: '../tsconfig.json',
      }),
    ],

    resolve: {
      alias: [
        { find: '../environments/environment', replacement: environmentFile },
        { find: '@environments/environment', replacement: environmentFile },
        { find: '@assets', replacement: '/assets' },
        { find: '@components', replacement: '/app/components' },
        { find: '@core', replacement: '/app/core' },
        { find: '@environments', replacement: '/environments' },
        { find: '@features', replacement: '/app/features' },
        { find: '@i18n', replacement: '/i18n' },
        { find: '@pages', replacement: '/app/pages' },
        { find: '@shared', replacement: '/app/shared' },
        { find: '@styles', replacement: '/styles' },
      ],
    },

    server: {
      port: 4200,
      open: true,
      hmr: true,
    },
  };
});
