import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const SITE_URL = 'https://rootdevs.es';
const ROOT = resolve(__dirname, '..');

const indexHtml = readFileSync(resolve(ROOT, 'src/index.html'), 'utf-8');
const head = new DOMParser().parseFromString(indexHtml, 'text/html').head;

const metaContent = (attribute: 'name' | 'property', key: string): string | null =>
  head.querySelector(`meta[${attribute}="${key}"]`)?.getAttribute('content') ?? null;

const pngSize = (bytes: Buffer): { height: number; width: number } => ({
  height: bytes.readUInt32BE(20),
  width: bytes.readUInt32BE(16),
});

describe('social preview meta tags in index.html', () => {
  const title = head.querySelector('title')?.textContent;
  const description = metaContent('name', 'description');

  it('declares the Open Graph tags that link previews read', () => {
    expect(metaContent('property', 'og:type')).toBe('website');
    expect(metaContent('property', 'og:site_name')).toBe('Rootdevs');
    expect(metaContent('property', 'og:url')).toBe(`${SITE_URL}/`);
    expect(metaContent('property', 'og:title')).toBe(title);
    expect(metaContent('property', 'og:description')).toBe(description);
  });

  it('declares a large Twitter card that mirrors the Open Graph data', () => {
    expect(metaContent('name', 'twitter:card')).toBe('summary_large_image');
    expect(metaContent('name', 'twitter:title')).toBe(title);
    expect(metaContent('name', 'twitter:description')).toBe(description);
    expect(metaContent('name', 'twitter:image')).toBe(metaContent('property', 'og:image'));
  });

  it('points og:image to an absolute URL of a 1200x630 PNG shipped in public/', () => {
    const image = metaContent('property', 'og:image') ?? '';

    expect(image.startsWith(`${SITE_URL}/`)).toBe(true);
    expect(metaContent('property', 'og:image:width')).toBe('1200');
    expect(metaContent('property', 'og:image:height')).toBe('630');
    expect(metaContent('property', 'og:image:type')).toBe('image/png');
    expect(metaContent('property', 'og:image:alt')).toBeTruthy();

    const publicPath = resolve(ROOT, 'public', image.slice(SITE_URL.length + 1));
    expect(pngSize(readFileSync(publicPath))).toEqual({ height: 630, width: 1200 });
  });
});
