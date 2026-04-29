import { Injectable } from '@angular/core';

import { SupportedLang } from '@core/interfaces/portfolio.interfaces';

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

marked.use({
  renderer: {
    heading({ depth, text }) {
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/<[^>]*>/g, '')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

const DEFAULT_LANG: SupportedLang = 'es';

export type FetchArticleParams = {
  lang?: SupportedLang;
  signal?: AbortSignal;
  slug: string;
};

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  async fetchArticle({ lang = DEFAULT_LANG, signal, slug }: FetchArticleParams): Promise<string> {
    try {
      const response = await fetch(`/assets/blog/${lang}/${slug}.md`, { signal });
      if (!response.ok) throw new Error('not found');

      return marked.parse(await response.text()) as string;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;

      if (lang !== DEFAULT_LANG) {
        const fallbackResponse = await fetch(`/assets/blog/${DEFAULT_LANG}/${slug}.md`, { signal });

        return marked.parse(await fallbackResponse.text()) as string;
      }
      throw error;
    }
  }
}
