import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(ROOT, 'public');
const POSTS_DIR = resolve(PUBLIC_DIR, 'assets/blog');

type PostImage = { file: string; img: HTMLImageElement };

const postImages: PostImage[] = readdirSync(POSTS_DIR).flatMap((lang) =>
  readdirSync(resolve(POSTS_DIR, lang))
    .filter((name) => name.endsWith('.md'))
    .flatMap((name) => {
      const markdown = readFileSync(resolve(POSTS_DIR, lang, name), 'utf-8');
      const body = new DOMParser().parseFromString(markdown, 'text/html').body;

      return [...body.querySelectorAll('img')].map((img) => ({ file: `${lang}/${name}`, img }));
    })
);

const localPath = (url: string): string => resolve(PUBLIC_DIR, url.replace(/^\//, ''));

const srcsetUrls = (srcset: string): string[] =>
  srcset
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);

describe('images in blog posts', () => {
  it('finds images to check', () => {
    expect(postImages.length).toBeGreaterThan(0);
  });

  it('serves every image from the site itself', () => {
    const remote = postImages
      .filter(({ img }) => !img.getAttribute('src')?.startsWith('/'))
      .map(({ file, img }) => `${file}: ${img.getAttribute('src')}`);

    expect(remote).toEqual([]);
  });

  it('points src at files that exist in public/', () => {
    const missing = postImages
      .filter(({ img }) => !existsSync(localPath(img.getAttribute('src') ?? '')))
      .map(({ file, img }) => `${file}: ${img.getAttribute('src')}`);

    expect(missing).toEqual([]);
  });

  it('adds srcset and sizes to every image that has an 800px variant', () => {
    const withoutSrcset = postImages
      .filter(({ img }) => {
        const variant = (img.getAttribute('src') ?? '').replace(/\.webp$/, '-800.webp');
        return variant.endsWith('-800.webp') && existsSync(localPath(variant));
      })
      .filter(({ img }) => {
        const srcset = img.getAttribute('srcset') ?? '';
        return !srcset.includes('-800.webp 800w') || !img.getAttribute('sizes');
      })
      .map(({ file, img }) => `${file}: ${img.getAttribute('src')}`);

    expect(withoutSrcset).toEqual([]);
  });

  it('only lists files that exist in srcset', () => {
    const missing = postImages.flatMap(({ file, img }) =>
      srcsetUrls(img.getAttribute('srcset') ?? '')
        .filter((url) => !existsSync(localPath(url)))
        .map((url) => `${file}: ${url}`)
    );

    expect(missing).toEqual([]);
  });
});
