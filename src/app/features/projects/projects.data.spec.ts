import { TestBed } from '@angular/core/testing';

import { BlogService } from '@core/services/blog.service';

import { PROJECTS_DATA } from './projects.data';

import { describe, expect, it } from 'vitest';

describe('PROJECTS_DATA', () => {
  const blog = TestBed.inject(BlogService);

  // An unknown slug sends the visitor back to the blog list, so a card must never point to a missing post.
  it('links every project post to a registered post', () => {
    const slugs = PROJECTS_DATA.flatMap((project) => (project.postSlug ? [project.postSlug] : []));

    expect(slugs).toContain('how-i-built-framed-by-santi');
    for (const slug of slugs) {
      expect(blog.getPostBySlug(slug), slug).toBeDefined();
    }
  });
});
