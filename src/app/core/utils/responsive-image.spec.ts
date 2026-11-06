import { BLOG_IMAGE_SIZES, blogImageSrcset } from './responsive-image';

import { describe, expect, it } from 'vitest';

describe('blogImageSrcset', () => {
  it('pairs a local blog webp with its 800px variant', () => {
    expect(blogImageSrcset('/assets/images/blog/post/hero_EN_dark.webp')).toBe(
      '/assets/images/blog/post/hero_EN_dark-800.webp 800w, /assets/images/blog/post/hero_EN_dark.webp 1600w'
    );
  });

  it('returns undefined for images outside the blog folder', () => {
    expect(blogImageSrcset('/assets/images/fj.webp')).toBeUndefined();
  });

  it('returns undefined for non-webp and remote images', () => {
    expect(blogImageSrcset('/assets/images/blog/post/hero.png')).toBeUndefined();
    expect(
      blogImageSrcset('https://example.com/assets/images/blog/post/hero.webp')
    ).toBeUndefined();
  });

  it('does not double the suffix when given the variant itself', () => {
    expect(blogImageSrcset('/assets/images/blog/post/hero-800.webp')).toBeUndefined();
  });

  it('exposes sizes matching the article column', () => {
    expect(BLOG_IMAGE_SIZES).toBe('(min-width: 1100px) 920px, min(100vw - 3rem, 752px)');
  });
});
