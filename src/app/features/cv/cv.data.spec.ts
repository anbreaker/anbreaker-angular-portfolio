import { TestBed } from '@angular/core/testing';

import { BlogService } from '@core/services/blog.service';

import { CV_DATA } from './cv.data';

import { describe, expect, it } from 'vitest';

const BLOG_URL = 'https://rootdevs.es/blog/';
const MONTH_YEAR = /^(0[1-9]|1[0-2])\/\d{4}$/;

describe('CV_DATA', () => {
  // ATS parsers expect MM/YYYY dates; "actualidad" is the only open end allowed.
  it('dates every job as MM/YYYY', () => {
    for (const job of CV_DATA.experience) {
      expect(job.startDate, job.role).toMatch(MONTH_YEAR);
      expect(job.endDate === 'actualidad' || MONTH_YEAR.test(job.endDate), job.role).toBe(true);
    }
  });

  it('lists the most recent job first', () => {
    const toKey = (date: string): string => `${date.slice(3)}${date.slice(0, 2)}`;
    const starts = CV_DATA.experience.map((job) => toKey(job.startDate));

    expect(starts).toEqual([...starts].sort().reverse());
  });

  // The PDFs are rendered from this page, so a site-relative link would point to wherever it was printed.
  it('only links to absolute https addresses, except the downloads', () => {
    const hrefs = [
      ...CV_DATA.profiles.map((link) => link.href),
      ...CV_DATA.projects.flatMap((project) => project.links.map((link) => link.href)),
    ];

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href.startsWith('https://'), href).toBe(true);
    }
  });

  it('includes the GitHub profile', () => {
    expect(CV_DATA.profiles.map((link) => link.href)).toContain('https://github.com/anbreaker');
  });

  // A broken "cómo lo hice" link would send a recruiter to the blog list instead of the case study.
  it('links project posts to registered posts', () => {
    const blog = TestBed.inject(BlogService);
    const postLinks = CV_DATA.projects
      .flatMap((project) => project.links)
      .filter((link) => link.href.startsWith(BLOG_URL));

    expect(postLinks.length).toBeGreaterThan(0);
    for (const link of postLinks) {
      expect(blog.getPostBySlug(link.href.replace(BLOG_URL, '')), link.href).toBeDefined();
    }
  });
});
