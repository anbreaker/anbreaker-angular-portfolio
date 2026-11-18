import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const POSTS_DIR = resolve(__dirname, '..', 'public/assets/blog');

const posts = readdirSync(POSTS_DIR).flatMap((lang) =>
  readdirSync(resolve(POSTS_DIR, lang))
    .filter((name) => name.endsWith('.md'))
    .map((name) => ({
      file: `${lang}/${name}`,
      markdown: readFileSync(resolve(POSTS_DIR, lang, name), 'utf-8'),
    }))
);

describe('blog post content', () => {
  it('has no HTML comments, which leak into the RSS feeds and the public .md files', () => {
    const withComments = posts
      .filter(({ markdown }) => markdown.includes('<!--'))
      .map(({ file }) => file);

    expect(withComments).toEqual([]);
  });
});
