import { CV_DATA } from '@features/cv/cv.data';

import { buildCvMarkdown, CV_MARKDOWN_PATH } from './cv-markdown';

import { describe, expect, it } from 'vitest';

const markdown = buildCvMarkdown({ cv: CV_DATA, siteUrl: 'https://example.dev' });
const headings = (level: string): string[] =>
  markdown.split('\n').filter((line) => line.startsWith(`${level} `));

describe('buildCvMarkdown', () => {
  it('is served from the site root, next to llms.txt', () => {
    expect(CV_MARKDOWN_PATH).toBe('cv.md');
  });

  it('starts with the full name as the only H1, followed by the role', () => {
    const lines = markdown.split('\n');

    expect(lines[0]).toBe('# Francisco Javier Antúnez Durán');
    expect(lines[2]).toBe('Senior Frontend Developer');
    expect(headings('#')).toHaveLength(1);
  });

  it('keeps the sections of the web page, in the same order', () => {
    expect(headings('##')).toEqual([
      '## Perfil',
      '## Trabajo público',
      '## Qué hago',
      '## Experiencia',
      '## Lo que dicen',
      '## Formación',
      '## Idiomas',
      '## Cómo trabajo',
    ]);
  });

  it('lists every job with its dates and every bullet', () => {
    for (const job of CV_DATA.experience) {
      expect(markdown).toContain(`### ${job.role}`);
      expect(markdown).toContain(`${job.startDate} – ${job.endDate}`);
      for (const bullet of job.bullets) {
        expect(markdown).toContain(`- ${bullet}`);
      }
    }
  });

  it('links the profiles, projects and PDFs with absolute URLs', () => {
    expect(markdown).toContain('[github.com/anbreaker](https://github.com/anbreaker)');
    expect(markdown).toContain('(https://github.com/anbreaker/framed-by-santi)');
    expect(markdown).toContain(
      '[Descargar PDF](https://example.dev/assets/cv/cv-francisco-javier-antunez.pdf)'
    );
    expect(markdown).not.toMatch(/\]\(\//);
  });

  it('includes the public work figures and every capability tag', () => {
    expect(markdown).toContain('- 857 tests en nueve días');
    for (const tag of CV_DATA.capabilities.flatMap((capability) => capability.tags)) {
      expect(markdown).toContain(tag);
    }
  });

  it('ends with a newline and contains no HTML', () => {
    expect(markdown.endsWith('\n')).toBe(true);
    expect(markdown).not.toMatch(/<[^>]+>/);
  });
});
