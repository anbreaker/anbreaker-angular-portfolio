import type { BlogPost, SupportedLang } from '../interfaces/portfolio.interfaces';

export const RSS_FEED_LANGS: SupportedLang[] = ['es', 'en', 'pt'];

const CHANNEL: Record<SupportedLang, { description: string; title: string }> = {
  en: {
    description:
      'Technical posts by Francisco Javier Antúnez Durán about Angular, performance, tooling and AI.',
    title: 'Rootdevs · Blog',
  },
  es: {
    description:
      'Posts técnicos de Francisco Javier Antúnez Durán sobre Angular, rendimiento, herramientas e IA.',
    title: 'Rootdevs · Blog',
  },
  pt: {
    description:
      'Artigos técnicos de Francisco Javier Antúnez Durán sobre Angular, desempenho, ferramentas e IA.',
    title: 'Rootdevs · Blog',
  },
};

const XML_ENTITIES: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&apos;',
  '<': '&lt;',
  '>': '&gt;',
};

export interface RssFeedOptions {
  /** Rendered HTML of a post's full text; the excerpt is sent when it returns nothing. */
  contentHtml?: (post: BlogPost) => string | undefined;
  /** Size in bytes of a cover image, given its site path; RSS enclosures require it. */
  imageLength?: (path: string) => number;
  lang: SupportedLang;
  posts: BlogPost[];
  siteUrl: string;
  translations: object;
}

export const rssFeedPath = (lang: SupportedLang): string => `rss/${lang}.xml`;

/** Builds the RSS 2.0 feed of the blog for one language from the posts and that language's translations. */
export function buildRssFeed({
  contentHtml = (): undefined => undefined,
  imageLength = (): number => 0,
  lang,
  posts,
  siteUrl,
  translations,
}: RssFeedOptions): string {
  const translate = (key: string): string => stripTags(lookup(translations, key));
  const newestFirst = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const items = newestFirst.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    const image = post.imageUrl?.[lang];
    const title = escapeXml(translate(post.titleKey));
    const excerpt = escapeXml(translate(post.excerptKey));

    return [
      '<item>',
      `<title>${title}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${toRfc822(post.date)}</pubDate>`,
      `<description>${excerpt}</description>`,
      post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join(''),
      image ? `<media:content medium="image" type="image/webp" url="${siteUrl}${image}"/>` : '',
      image
        ? `<enclosure length="${imageLength(image)}" type="image/webp" url="${siteUrl}${image}"/>`
        : '',
      cdata(
        `content:encoded`,
        (image ? `<p><img alt="${title}" src="${siteUrl}${image}"></p>` : '') +
          toFeedHtml(contentHtml(post) ?? `<p>${excerpt}</p>`, siteUrl)
      ),
      '</item>',
    ].join('');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">',
    '<channel>',
    `<title>${escapeXml(CHANNEL[lang].title)}</title>`,
    `<link>${siteUrl}/blog</link>`,
    `<description>${escapeXml(CHANNEL[lang].description)}</description>`,
    `<language>${lang}</language>`,
    newestFirst.length ? `<lastBuildDate>${toRfc822(newestFirst[0].date)}</lastBuildDate>` : '',
    `<atom:link href="${siteUrl}/${rssFeedPath(lang)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '</channel>',
    '</rss>',
    '',
  ].join('\n');
}

function cdata(tag: string, html: string): string {
  return `<${tag}><![CDATA[${html.replaceAll(']]>', ']]]]><![CDATA[>')}]]></${tag}>`;
}

/** Makes site paths absolute and keeps only the dark variant of light/dark image pairs. */
function toFeedHtml(html: string, siteUrl: string): string {
  return html
    .replace(/\n?<img[^>]*theme-img--light[^>]*>/g, '')
    .replace(/(src|href)="\/(?!\/)/g, `$1="${siteUrl}/`);
}

function lookup(source: object, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], source);

  return typeof value === 'string' ? value : key;
}

function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

function escapeXml(text: string): string {
  return text.replace(/["&'<>]/g, (char) => XML_ENTITIES[char]);
}

function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}
