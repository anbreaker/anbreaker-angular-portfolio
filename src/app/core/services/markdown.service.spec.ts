import { TestBed } from '@angular/core/testing';

import { MarkdownService } from './markdown.service';

import { afterEach, describe, expect, it, vi } from 'vitest';

const render = async (markdown: string): Promise<string> => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(markdown))
  );
  return TestBed.inject(MarkdownService).fetchArticle({ slug: 'post' });
};

describe('MarkdownService code highlighting', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('highlights python blocks', async () => {
    const html = await render('```python\ndef locate(t):\n    return None\n```');
    expect(html).toContain('<span class="hljs-keyword">def</span>');
  });

  it('highlights http blocks', async () => {
    const html = await render('```http\nPUT /api/assets/{id}\nContent-Type: application/json\n```');
    expect(html).toContain('hljs-attribute');
  });

  it('still highlights typescript blocks', async () => {
    const html = await render('```ts\nconst a = 1;\n```');
    expect(html).toContain('<span class="hljs-keyword">const</span>');
  });

  it('leaves unknown languages as escaped plain text', async () => {
    const html = await render('```cobol\n<b>x</b>\n```');
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).not.toContain('hljs-');
  });
});
