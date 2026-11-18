import { BlogPost } from '../interfaces/portfolio.interfaces';
import { buildSitemap, SITEMAP_PATH } from './sitemap';

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

const locs = (xml: string): string[] => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

describe('buildSitemap', () => {
  const xml = buildSitemap({
    posts: POSTS,
    projectIds: ['portfolio'],
    siteUrl: 'https://example.com',
  });

  it('is served at the path robots.txt points to', () => {
    expect(SITEMAP_PATH).toBe('sitemap.xml');
  });

  it('is a sitemaps.org urlset', () => {
    expect(xml).toMatch(
      /^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/
    );
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('lists the main pages, the projects and every post, newest post first', () => {
    expect(locs(xml)).toEqual([
      'https://example.com/',
      'https://example.com/about-me',
      'https://example.com/blog',
      'https://example.com/contact',
      'https://example.com/projects/portfolio',
      'https://example.com/blog/new-post',
      'https://example.com/blog/old-post',
    ]);
  });

  it('dates each post with its publication date', () => {
    expect(xml).toContain(
      '<url><loc>https://example.com/blog/new-post</loc><lastmod>2026-10-27</lastmod></url>'
    );
  });

  it('dates the blog index with the newest post', () => {
    expect(xml).toContain(
      '<url><loc>https://example.com/blog</loc><lastmod>2026-10-27</lastmod></url>'
    );
  });
});
