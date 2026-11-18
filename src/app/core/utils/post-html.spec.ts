import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { BlogPost } from '../interfaces/portfolio.interfaces';
import { buildPostHtml, postHtmlPath, postPageTitle, SITE_TITLE } from './post-html';

import { describe, expect, it } from 'vitest';

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <title>Site title</title>
    <meta content="Site description" name="description" />
    <meta content="website" property="og:type" />
    <meta content="https://example.com/" property="og:url" />
    <meta content="Site title" property="og:title" />
    <meta content="Site description" property="og:description" />
    <meta content="https://example.com/assets/images/og-image.png" property="og:image" />
    <meta content="image/png" property="og:image:type" />
    <meta content="1200" property="og:image:width" />
    <meta content="630" property="og:image:height" />
    <meta content="Site image alt" property="og:image:alt" />
    <meta content="Site title" name="twitter:title" />
    <meta content="Site description" name="twitter:description" />
    <meta content="https://example.com/assets/images/og-image.png" name="twitter:image" />
  </head>
  <body><app-root></app-root></body>
</html>
`;

const POST: BlogPost = {
  author: { initials: 'FJ', name: 'Jane "JD" Doe' },
  date: '2026-11-18',
  excerptKey: 'blog.posts.demo.excerpt',
  id: '4',
  imageUrl: {
    en: '/assets/images/blog/demo/cover.webp',
    es: '/assets/images/blog/demo/cover.webp',
    pt: '/assets/images/blog/demo/cover.webp',
  },
  slug: 'demo-post',
  tags: ['Python', 'Maps'],
  titleKey: 'blog.posts.demo.title',
};

const TRANSLATIONS = {
  blog: {
    posts: {
      demo: { excerpt: '1,928 photos & a <em>script</em>', title: 'Photos of <em>New York</em>' },
    },
  },
};

const build = (post: BlogPost = POST): string =>
  buildPostHtml({
    indexHtml: INDEX_HTML,
    post,
    siteUrl: 'https://example.com',
    translations: TRANSLATIONS,
  });

const jsonLd = (html: string): Record<string, unknown> =>
  JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html)?.[1] ?? '{}');

describe('postPageTitle', () => {
  it('strips markup and appends the site name', () => {
    expect(postPageTitle('Photos of <em>New York</em>')).toBe('Photos of New York · Rootdevs');
  });
});

describe('postHtmlPath', () => {
  it('serves the post page at /blog/<slug>', () => {
    expect(postHtmlPath(POST)).toBe('blog/demo-post/index.html');
  });
});

describe('buildPostHtml', () => {
  const html = build();

  it('uses the post title and excerpt as plain, escaped text', () => {
    expect(html).toContain('<title>Photos of New York · Rootdevs</title>');
    expect(html).toContain('<meta content="1,928 photos &amp; a script" name="description" />');
    expect(html).toContain('<meta content="Photos of New York" property="og:title" />');
    expect(html).toContain(
      '<meta content="1,928 photos &amp; a script" property="og:description" />'
    );
    expect(html).toContain('<meta content="Photos of New York" name="twitter:title" />');
    expect(html).toContain(
      '<meta content="1,928 photos &amp; a script" name="twitter:description" />'
    );
  });

  it('marks the page as an article at its own URL, with a canonical link', () => {
    expect(html).toContain('<meta content="article" property="og:type" />');
    expect(html).toContain(
      '<meta content="https://example.com/blog/demo-post" property="og:url" />'
    );
    expect(html).toContain('<link href="https://example.com/blog/demo-post" rel="canonical" />');
  });

  it('uses the English cover image and drops the default image size, type and alt', () => {
    const image = 'https://example.com/assets/images/blog/demo/cover.webp';
    expect(html).toContain(`<meta content="${image}" property="og:image" />`);
    expect(html).toContain(`<meta content="${image}" name="twitter:image" />`);
    expect(html).not.toContain('og:image:type');
    expect(html).not.toContain('og:image:width');
    expect(html).not.toContain('og:image:alt');
  });

  it('keeps the default share image when the post has no cover', () => {
    const page = build({ ...POST, imageUrl: undefined });
    expect(page).toContain(
      '<meta content="https://example.com/assets/images/og-image.png" property="og:image" />'
    );
    expect(page).toContain('<meta content="1200" property="og:image:width" />');
  });

  it('adds publication date and tags as article metadata', () => {
    expect(html).toContain('<meta content="2026-11-18" property="article:published_time" />');
    expect(html).toContain('<meta content="Python" property="article:tag" />');
    expect(html).toContain('<meta content="Maps" property="article:tag" />');
  });

  it('describes the post as schema.org BlogPosting', () => {
    expect(jsonLd(html)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      author: { '@type': 'Person', name: 'Jane "JD" Doe', url: 'https://example.com/about-me' },
      datePublished: '2026-11-18',
      description: '1,928 photos & a script',
      headline: 'Photos of New York',
      image: 'https://example.com/assets/images/blog/demo/cover.webp',
      inLanguage: 'en',
      keywords: 'Python, Maps',
      mainEntityOfPage: 'https://example.com/blog/demo-post',
      url: 'https://example.com/blog/demo-post',
    });
  });

  it('cannot break out of the JSON-LD script', () => {
    const page = buildPostHtml({
      indexHtml: INDEX_HTML,
      post: POST,
      siteUrl: 'https://example.com',
      translations: {
        blog: { posts: { demo: { excerpt: 'x', title: '</script><script>alert(1)' } } },
      },
    });
    expect(page.match(/<\/script>/g)).toHaveLength(1);
  });

  it('keeps dollar signs in post text literal', () => {
    const page = buildPostHtml({
      indexHtml: INDEX_HTML,
      post: POST,
      siteUrl: 'https://example.com',
      translations: { blog: { posts: { demo: { excerpt: 'Costs $& and $1', title: 'T' } } } },
    });
    expect(page).toContain('<meta content="Costs $&amp; and $1" name="description" />');
  });

  it('indents the added head tags like the rest of the head', () => {
    expect(html).toContain(
      '\n    <link href="https://example.com/blog/demo-post" rel="canonical" />\n'
    );
    expect(html).toContain('</script>\n  </head>');
  });

  it('leaves the rest of the page untouched', () => {
    expect(html).toContain('<body><app-root></app-root></body>');
    expect(html.startsWith('<!doctype html>\n<html lang="en">')).toBe(true);
  });

  it('fails loudly when the index.html head no longer has a tag it must replace', () => {
    expect(() =>
      buildPostHtml({
        indexHtml: INDEX_HTML.replace(/.*og:url.*\n/, ''),
        post: POST,
        siteUrl: 'https://example.com',
        translations: TRANSLATIONS,
      })
    ).toThrow(/og:url/);
  });
});

describe('SITE_TITLE', () => {
  it('matches the <title> of src/index.html, which the post page restores on leave', () => {
    const indexHtml = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');
    expect(/<title>(.*?)<\/title>/.exec(indexHtml)?.[1].replace(/&amp;/g, '&')).toBe(SITE_TITLE);
  });
});
