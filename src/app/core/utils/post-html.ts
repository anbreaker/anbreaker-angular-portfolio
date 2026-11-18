import type { BlogPost } from '../interfaces/portfolio.interfaces';
import { translationText } from './translation-text';

/** Language of the static page; matches index.html (`lang="en"`) and llms.txt. */
const PAGE_LANG = 'en';

const HTML_ENTITIES: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  "'": '&#39;',
  '<': '&lt;',
  '>': '&gt;',
};

const escapeHtml = (text: string): string =>
  text.replace(/["&'<>]/g, (char) => HTML_ENTITIES[char]);

const metaTag = (attribute: 'name' | 'property', key: string, content: string): string =>
  `<meta content="${escapeHtml(content)}" ${attribute}="${key}" />`;

export interface PostHtmlOptions {
  /** The built index.html of the app. */
  indexHtml: string;
  post: BlogPost;
  siteUrl: string;
  /** English translations, used for the post title and excerpt. */
  translations: object;
}

/** Title of every page that is not a post; must match the <title> in src/index.html. */
export const SITE_TITLE = 'Rootdevs | Creative Technologist & FullStack Web Master';

/** Browser tab title of a post page, shared by the static page and the app. */
export const postPageTitle = (title: string): string =>
  `${title.replace(/<[^>]*>/g, '')} · Rootdevs`;

/** Path of the static page served for /blog/<slug>. */
export const postHtmlPath = (post: BlogPost): string => `blog/${post.slug}/index.html`;

/**
 * Builds the static page of a blog post: the app's index.html with the post's title, description,
 * Open Graph, canonical URL and schema.org BlogPosting, so crawlers and link previews that do not
 * run JavaScript see the post instead of the site defaults.
 */
export function buildPostHtml({ indexHtml, post, siteUrl, translations }: PostHtmlOptions): string {
  const title = translationText(translations, post.titleKey);
  const description = translationText(translations, post.excerptKey);
  const url = `${siteUrl}/blog/${post.slug}`;
  const cover = post.imageUrl?.[PAGE_LANG];
  const image = cover ? `${siteUrl}${cover}` : undefined;

  let html = indexHtml;
  const replace = (pattern: RegExp, replacement: string, label: string): void => {
    if (!pattern.test(html)) throw new Error(`index.html has no ${label} to replace`);
    // A function replacement keeps `$&`, `$1`… in post text from being read as patterns.
    html = html.replace(pattern, () => replacement);
  };
  const replaceMeta = (attribute: 'name' | 'property', key: string, content: string): void =>
    replace(
      new RegExp(`<meta\\s[^>]*${attribute}="${key}"[^>]*>`),
      metaTag(attribute, key, content),
      key
    );

  replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(postPageTitle(title))}</title>`, 'title');
  replaceMeta('name', 'description', description);
  replaceMeta('property', 'og:type', 'article');
  replaceMeta('property', 'og:url', url);
  replaceMeta('property', 'og:title', title);
  replaceMeta('property', 'og:description', description);
  replaceMeta('name', 'twitter:title', title);
  replaceMeta('name', 'twitter:description', description);

  if (image) {
    replaceMeta('property', 'og:image', image);
    replaceMeta('name', 'twitter:image', image);
    // Size, type and alt describe the default share image, not the cover.
    html = html.replace(/[ \t]*<meta\s[^>]*property="og:image:[^"]+"[^>]*>\n?/g, '');
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: { '@type': 'Person', name: post.author?.name, url: `${siteUrl}/about-me` },
    datePublished: post.date,
    description,
    headline: title,
    image,
    inLanguage: PAGE_LANG,
    keywords: post.tags.join(', '),
    mainEntityOfPage: url,
    url,
  };

  const extraTags = [
    `<link href="${escapeHtml(url)}" rel="canonical" />`,
    metaTag('property', 'article:published_time', post.date),
    ...post.tags.map((tag) => metaTag('property', 'article:tag', tag)),
    // `<` is escaped so no string in the data can close the script element.
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ];

  replace(
    /[ \t]*<\/head>/,
    `${extraTags.map((tag) => `    ${tag}\n`).join('')}  </head>`,
    '</head>'
  );

  return html;
}
