import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');

const indexHtml = readFileSync(resolve(ROOT, 'src/index.html'), 'utf-8');
const head = new DOMParser().parseFromString(indexHtml, 'text/html').head;

const fontFaceStyles = ['src/styles/base/_fonts.scss', 'src/styles/base/_typography.scss']
  .map((path) => readFileSync(resolve(ROOT, path), 'utf-8'))
  .join('\n');

const declaredFontUrls = [
  ...fontFaceStyles.matchAll(/url\('\/(assets\/fonts\/[^']+\.woff2)'\)/g),
].map(([, path]) => path);

const preloads = [...head.querySelectorAll('link[rel="preload"][as="font"]')];

describe('font preloads in index.html', () => {
  it('preloads at least one font', () => {
    expect(preloads.length).toBeGreaterThan(0);
  });

  it('marks every font preload as a crossorigin woff2 request', () => {
    for (const link of preloads) {
      expect(link.hasAttribute('crossorigin')).toBe(true);
      expect(link.getAttribute('type')).toBe('font/woff2');
    }
  });

  it('preloads only files that exist in public/', () => {
    const missing = preloads
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => !existsSync(resolve(ROOT, 'public', href)));

    expect(missing).toEqual([]);
  });

  it('preloads only files that a @font-face declares', () => {
    const undeclared = preloads
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => !declaredFontUrls.includes(href));

    expect(undeclared).toEqual([]);
  });
});
