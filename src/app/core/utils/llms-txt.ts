import type { BlogPost, SupportedLang } from '../interfaces/portfolio.interfaces';
import { RSS_FEED_LANGS, rssFeedPath } from './rss-feed';
import { translationText } from './translation-text';

export const LLMS_TXT_PATH = 'llms.txt';

const FEED_LANGUAGE_NAMES: Record<SupportedLang, string> = {
  en: 'English',
  es: 'Spanish',
  pt: 'Portuguese',
};

export interface LlmsTxtOptions {
  /** Blog posts; listed newest first. */
  posts: BlogPost[];
  siteUrl: string;
  /** English translations, used for post titles and excerpts. */
  translations: object;
}

/** Builds /llms.txt (https://llmstxt.org) so AI agents can find the site's content in plain text. */
export function buildLlmsTxt({ posts, siteUrl, translations }: LlmsTxtOptions): string {
  const translate = (key: string): string => translationText(translations, key);
  const newestFirst = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return [
    '# Rootdevs',
    '',
    '> Portfolio and technical blog of Francisco Javier Antúnez Durán, a Creative Technologist and full-stack web developer writing about Angular, performance, tooling and AI.',
    '',
    'The site is available in English, Spanish and Portuguese. Blog posts are linked below as their English Markdown source; the same posts in Spanish and Portuguese live under /assets/blog/es/ and /assets/blog/pt/.',
    '',
    '## Blog',
    '',
    ...newestFirst.map(
      (post) =>
        `- [${translate(post.titleKey)}](${siteUrl}/assets/blog/en/${post.slug}.md): ${translate(post.excerptKey)}`
    ),
    '',
    '## Pages',
    '',
    `- [Home](${siteUrl}/): Introduction, skills and featured projects`,
    `- [About me](${siteUrl}/about-me): Background and professional experience`,
    `- [Blog](${siteUrl}/blog): All blog posts`,
    `- [Contact](${siteUrl}/contact): Contact form`,
    '',
    '## Optional',
    '',
    ...RSS_FEED_LANGS.map(
      (lang) =>
        `- [RSS feed (${FEED_LANGUAGE_NAMES[lang]})](${siteUrl}/${rssFeedPath(lang)}): Full posts in ${FEED_LANGUAGE_NAMES[lang]}`
    ),
    '',
  ].join('\n');
}
