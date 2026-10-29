import { Injectable } from '@angular/core';

import { BLOG_POSTS } from '../const/blog-posts';
import { BlogPost, BlogResponse } from '../interfaces/portfolio.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly posts = BLOG_POSTS;

  getPostBySlug(slug: string): BlogPost | undefined {
    return this.posts.find((post) => post.slug === slug);
  }

  searchPosts(
    query: string = '',
    page: number = 1,
    pageSize: number = 3,
    translate: (key: string) => string = (key) => key
  ): BlogResponse {
    let filtered = [...this.posts];

    if (query.trim().length >= 3) {
      const searchQuery = this.normalize(query);
      filtered = filtered.filter((blogPost) =>
        [translate(blogPost.titleKey), translate(blogPost.excerptKey), ...blogPost.tags].some(
          (text) => this.normalize(text).includes(searchQuery)
        )
      );
    }

    const totalCount = filtered.length;
    const posts = filtered.slice((page - 1) * pageSize, page * pageSize);

    return { pageSize, posts, totalCount };
  }

  private normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }
}
