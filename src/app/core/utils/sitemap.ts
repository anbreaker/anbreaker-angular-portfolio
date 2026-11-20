import type { BlogPost } from '../interfaces/portfolio.interfaces';

export const SITEMAP_PATH = 'sitemap.xml';

const MAIN_PAGES = ['/', '/about-me', '/blog', '/contact', '/cv'];

export interface SitemapOptions {
  posts: BlogPost[];
  /** Ids of the projects that have a detail page at /projects/<id>. */
  projectIds: string[];
  siteUrl: string;
}

/** Builds /sitemap.xml (https://www.sitemaps.org) with the main pages, project pages and blog posts. */
export function buildSitemap({ posts, projectIds, siteUrl }: SitemapOptions): string {
  const newestFirst = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const newestPostDate = newestFirst[0]?.date;

  const url = (path: string, lastmod?: string): string =>
    `<url><loc>${siteUrl}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...MAIN_PAGES.map((path) => url(path, path === '/blog' ? newestPostDate : undefined)),
    ...projectIds.map((id) => url(`/projects/${encodeURIComponent(id)}`)),
    ...newestFirst.map((post) => url(`/blog/${encodeURIComponent(post.slug)}`, post.date)),
    '</urlset>',
    '',
  ].join('\n');
}
