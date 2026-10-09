import { projectImageSrcset } from './project-image';

import { describe, expect, it } from 'vitest';

describe('projectImageSrcset', () => {
  it('offers the 800px variant and the original file', () => {
    expect(projectImageSrcset('/assets/images/projects/mimacrameES.webp')).toBe(
      '/assets/images/projects/mimacrameES-800.webp 800w, /assets/images/projects/mimacrameES.webp 1600w'
    );
  });

  it('only rewrites the file extension', () => {
    expect(projectImageSrcset('/assets/images/projects/portfolio.webp.v2/portfolioEn.webp')).toBe(
      '/assets/images/projects/portfolio.webp.v2/portfolioEn-800.webp 800w, /assets/images/projects/portfolio.webp.v2/portfolioEn.webp 1600w'
    );
  });
});
