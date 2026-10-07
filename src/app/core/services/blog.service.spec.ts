import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

import { describe, expect, it } from 'vitest';

const TRANSLATIONS: Record<string, string> = {
  'blog.posts.prettier-multiconsultora.excerpt': 'Cómo Prettier y Husky eliminan las guerras de estilo',
  'blog.posts.prettier-multiconsultora.title': 'Código Impecable en Equipos Multi-Consultora',
  'blog.posts.youtube-hdmi-audio.excerpt': 'Cómo un hub USB-C dejó atascado el audio HDMI',
  'blog.posts.youtube-hdmi-audio.title': 'YouTube no reproduce en mi Mac',
};
const translate = (key: string): string => TRANSLATIONS[key] ?? key;

describe('BlogService.searchPosts', () => {
  const service = TestBed.inject(BlogService);

  it('matches the translated title', () => {
    const { posts } = service.searchPosts('Código', 1, 10, translate);
    expect(posts.map((post) => post.id)).toEqual(['1']);
  });

  it('ignores accents and case', () => {
    const { totalCount } = service.searchPosts('CODIGO impecable', 1, 10, translate);
    expect(totalCount).toBe(1);
  });

  it('matches the translated excerpt', () => {
    const { posts } = service.searchPosts('atascado', 1, 10, translate);
    expect(posts.map((post) => post.id)).toEqual(['2']);
  });

  it('still matches tags', () => {
    const { posts } = service.searchPosts('husky', 1, 10, translate);
    expect(posts.map((post) => post.id)).toEqual(['1']);
  });

  it('returns nothing when there is no match', () => {
    expect(service.searchPosts('zzzzz', 1, 10, translate).totalCount).toBe(0);
  });

  it('does not filter queries shorter than 3 characters', () => {
    expect(service.searchPosts('Có', 1, 10, translate).totalCount).toBe(2);
  });
});
