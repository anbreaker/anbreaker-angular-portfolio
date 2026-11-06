import { BlogPost } from '../interfaces/portfolio.interfaces';
import { buildLlmsTxt, LLMS_TXT_PATH } from './llms-txt';

import { describe, expect, it } from 'vitest';

const POSTS: BlogPost[] = [
  {
    date: '2026-09-30',
    excerptKey: 'blog.posts.old.excerpt',
    id: '1',
    slug: 'old-post',
    tags: ['Git'],
    titleKey: 'blog.posts.old.title',
  },
  {
    date: '2026-10-27',
    excerptKey: 'blog.posts.new.excerpt',
    id: '2',
    slug: 'new-post',
    tags: ['Angular'],
    titleKey: 'blog.posts.new.title',
  },
];

const TRANSLATIONS = {
  blog: {
    posts: {
      new: { excerpt: 'Fast <em>builds</em>', title: 'How I built it in <em>three days</em>.' },
      old: { excerpt: 'Old excerpt', title: 'Old title' },
    },
  },
};

const llmsTxt = (): string =>
  buildLlmsTxt({ posts: POSTS, siteUrl: 'https://example.dev', translations: TRANSLATIONS });

describe('buildLlmsTxt', () => {
  it('is served from the site root', () => {
    expect(LLMS_TXT_PATH).toBe('llms.txt');
  });

  it('starts with the site name as the only H1, followed by a blockquote summary', () => {
    const lines = llmsTxt().split('\n');

    expect(lines[0]).toBe('# Rootdevs');
    expect(lines[2]).toMatch(/^> \S/);
    expect(lines.filter((line) => line.startsWith('# '))).toHaveLength(1);
  });

  it('lists every post newest first, linking its markdown source with the plain-text excerpt', () => {
    const text = llmsTxt();

    expect(text).toContain(
      '- [How I built it in three days.](https://example.dev/assets/blog/en/new-post.md): Fast builds'
    );
    expect(text).toContain(
      '- [Old title](https://example.dev/assets/blog/en/old-post.md): Old excerpt'
    );
    expect(text.indexOf('new-post.md')).toBeLessThan(text.indexOf('old-post.md'));
  });

  it('links the main pages and the RSS feed of every language with absolute URLs', () => {
    const text = llmsTxt();

    expect(text).toContain('## Blog');
    expect(text).toContain('## Pages');
    expect(text).toContain('](https://example.dev/about-me)');
    expect(text).toContain('](https://example.dev/contact)');
    for (const lang of ['es', 'en', 'pt']) {
      expect(text).toContain(`](https://example.dev/rss/${lang}.xml)`);
    }
  });

  it('ends with a newline and contains no HTML', () => {
    const text = llmsTxt();

    expect(text.endsWith('\n')).toBe(true);
    expect(text).not.toMatch(/<[^>]+>/);
  });
});
