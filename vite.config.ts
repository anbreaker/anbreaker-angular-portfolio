import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import angular from '@analogjs/vite-plugin-angular';

import { Marked } from 'marked';
import { defineConfig, Plugin } from 'vite';

import { BLOG_POSTS } from './src/app/core/const/blog-posts';
import { buildRssFeed, RSS_FEED_LANGS, rssFeedPath } from './src/app/core/utils/rss-feed';

const environmentFileByMode: Record<string, string> = {
  demo: 'environment.demo.ts',
  dev: 'environment.dev.ts',
  development: 'environment.dev.ts',
  preproduction: 'environment.preproduction.ts',
  prod: 'environment.prod.ts',
  production: 'environment.prod.ts',
  test: 'environment.test.ts',
};

const SITE_URL = 'https://rootdevs.es';

/** Emits one RSS feed per language (dist/rss/<lang>.xml) from the blog posts and their translations. */
function rssFeeds(): Plugin {
  return {
    apply: 'build',
    name: 'rss-feeds',
    generateBundle() {
      const markdown = new Marked();

      for (const lang of RSS_FEED_LANGS) {
        const translations = JSON.parse(
          readFileSync(resolve(__dirname, `public/assets/i18n/${lang}.json`), 'utf8')
        ) as object;

        this.emitFile({
          fileName: rssFeedPath(lang),
          source: buildRssFeed({
            contentHtml: (post) =>
              markdown.parse(
                readFileSync(
                  resolve(__dirname, `public/assets/blog/${lang}/${post.slug}.md`),
                  'utf8'
                ),
                { async: false }
              ),
            imageLength: (path) => statSync(resolve(__dirname, 'public', `.${path}`)).size,
            lang,
            posts: BLOG_POSTS,
            siteUrl: SITE_URL,
            translations,
          }),
          type: 'asset',
        });
      }
    },
  };
}

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
      rssFeeds(),
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
