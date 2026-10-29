import { BlogPost } from '../interfaces/portfolio.interfaces';
import { buildRssFeed, RSS_FEED_LANGS, rssFeedPath } from './rss-feed';

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
    imageUrl: { en: '/img/new_EN.webp', es: '/img/new_ES.webp', pt: '/img/new_PT.webp' },
    slug: 'new-post',
    tags: ['Angular', 'AI'],
    titleKey: 'blog.posts.new.title',
  },
];

const TRANSLATIONS = {
  blog: {
    posts: {
      new: {
        excerpt: 'Fast & "safe" <em>builds</em>',
        title: 'How I built it in <em>three days</em>.',
      },
      old: { excerpt: 'Old excerpt', title: 'Old title' },
    },
  },
};

const feed = () =>
  buildRssFeed({
    lang: 'en',
    posts: POSTS,
    siteUrl: 'https://rootdevs.es',
    translations: TRANSLATIONS,
  });

describe('buildRssFeed', () => {
  it('describes the channel in the requested language and links to itself', () => {
    const xml = feed();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<language>en</language>');
    expect(xml).toContain('<link>https://rootdevs.es/blog</link>');
    expect(xml).toContain(
      '<atom:link href="https://rootdevs.es/rss/en.xml" rel="self" type="application/rss+xml"/>'
    );
  });

  it('lists posts newest first with translated, tag-free titles and escaped excerpts', () => {
    const xml = feed();

    expect(xml.indexOf('new-post')).toBeLessThan(xml.indexOf('old-post'));
    expect(xml).toContain('<title>How I built it in three days.</title>');
    expect(xml).toContain('<description>Fast &amp; &quot;safe&quot; builds</description>');
  });

  it('gives each post its permalink, date, categories and cover image', () => {
    const xml = feed();

    expect(xml).toContain('<link>https://rootdevs.es/blog/new-post</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://rootdevs.es/blog/new-post</guid>');
    expect(xml).toContain('<pubDate>Tue, 27 Oct 2026 00:00:00 GMT</pubDate>');
    expect(xml).toContain('<category>Angular</category><category>AI</category>');
    expect(xml).toContain(
      '<media:content medium="image" type="image/webp" url="https://rootdevs.es/img/new_EN.webp"/>'
    );
    expect(xml).toContain('<lastBuildDate>Tue, 27 Oct 2026 00:00:00 GMT</lastBuildDate>');
  });

  it('also sends the cover as an enclosure and as an image in the post content', () => {
    const xml = buildRssFeed({
      imageLength: (path) => (path === '/img/new_EN.webp' ? 72000 : 0),
      lang: 'en',
      posts: POSTS,
      siteUrl: 'https://rootdevs.es',
      translations: TRANSLATIONS,
    });

    expect(xml).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');
    expect(xml).toContain(
      '<enclosure length="72000" type="image/webp" url="https://rootdevs.es/img/new_EN.webp"/>'
    );
    expect(xml).toContain(
      '<content:encoded><![CDATA[<p><img alt="How I built it in three days." src="https://rootdevs.es/img/new_EN.webp"></p><p>Fast &amp; &quot;safe&quot; builds</p>]]></content:encoded>'
    );
    expect(xml.match(/<enclosure/g)).toHaveLength(1);
  });

  it('sends the full post with absolute links and only the dark variant of themed images', () => {
    const xml = buildRssFeed({
      contentHtml: (post) =>
        post.slug === 'new-post'
          ? '<p>Body with a <a href="/blog/old-post">link</a>.</p>' +
            '<img class="theme-img theme-img--dark" src="/img/chart_dark.webp" alt="Chart">\n' +
            '<img class="theme-img theme-img--light" src="/img/chart_light.webp" alt="Chart">'
          : undefined,
      lang: 'en',
      posts: POSTS,
      siteUrl: 'https://rootdevs.es',
      translations: TRANSLATIONS,
    });

    expect(xml).toContain(
      '<p>Body with a <a href="https://rootdevs.es/blog/old-post">link</a>.</p><img class="theme-img theme-img--dark" src="https://rootdevs.es/img/chart_dark.webp" alt="Chart">'
    );
    expect(xml).not.toContain('chart_light.webp');
    expect(xml).not.toContain('<p>Fast &amp; &quot;safe&quot; builds</p>');
    expect(xml).toContain('<content:encoded><![CDATA[<p>Old excerpt</p>]]></content:encoded>');
  });

  it('builds one feed per supported language', () => {
    expect(RSS_FEED_LANGS).toEqual(['es', 'en', 'pt']);
    expect(rssFeedPath('pt')).toBe('rss/pt.xml');
  });
});
