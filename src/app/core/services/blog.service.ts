import { Injectable } from '@angular/core';

import { BlogAuthor, BlogPost, BlogResponse } from '../interfaces/portfolio.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly AUTHOR: BlogAuthor = {
    initials: 'FJ',
    name: 'Francisco Javier Antúnez Durán',
  };

  private readonly posts: BlogPost[] = [
    {
      author: this.AUTHOR,
      date: '2026-04-28',
      excerptKey: 'blog.posts.prettier-multiconsultora.excerpt',
      id: '1',
      imageUrl: {
        en: '/assets/images/blog/prettierPost/infographic_EN.webp',
        es: '/assets/images/blog/prettierPost/infographic_ES.webp',
        pt: '/assets/images/blog/prettierPost/infographic_PT.webp',
      },
      slug: 'codigo-impecable-equipos-multi-consultora',
      tags: ['Prettier', 'Git', 'DevEx', 'Husky'],
      titleKey: 'blog.posts.prettier-multiconsultora.title',
      // TODO: per-lang video — upload EN and PT versions and switch to Record<SupportedLang, string>
      videoId: 'zjPeO-7TuMw',
    },
  ];

  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  searchPosts(query: string = '', page: number = 1, pageSize: number = 3): BlogResponse {
    let filtered = [...this.posts];

    if (query.trim().length >= 3) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(
        (blogPost) =>
          blogPost.titleKey.toLowerCase().includes(searchQuery) ||
          blogPost.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
      );
    }

    const totalCount = filtered.length;
    const posts = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { pageSize, posts, totalCount };
  }
}
