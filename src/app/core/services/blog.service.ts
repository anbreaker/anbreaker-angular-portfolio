import { delay, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { BlogPost, BlogResponse } from '../interfaces/portfolio.interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly mockPosts: BlogPost[] = [
    {
      id: '1',
      titleKey: 'blog.posts.angular21.title',
      excerptKey: 'blog.posts.angular21.excerpt',
      date: '2026-03-20',
      tags: ['Angular', 'Signals', 'RXResource'],
      slug: 'angular-21-signals-revolution',
      imageUrl:
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop',
    },
    {
      id: '2',
      titleKey: 'blog.posts.graffiti-ui.title',
      excerptKey: 'blog.posts.graffiti-ui.excerpt',
      date: '2026-03-15',
      tags: ['Design', 'CSS', 'Aesthetics'],
      slug: 'building-urban-graffiti-ui',
      imageUrl:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop',
    },
    {
      id: '3',
      titleKey: 'blog.posts.performance.title',
      excerptKey: 'blog.posts.performance.excerpt',
      date: '2026-03-10',
      tags: ['Performance', 'Lighthouse', 'Vite'],
      slug: 'optimizing-angular-vitest',
      imageUrl:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    },
    {
      id: '4',
      titleKey: 'blog.posts.typescript-tips.title',
      excerptKey: 'blog.posts.typescript-tips.excerpt',
      date: '2026-03-05',
      tags: ['TypeScript', 'Best Practices'],
      slug: 'advanced-typescript-patterns',
      imageUrl:
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop',
    },
    {
      id: '5',
      titleKey: 'blog.posts.pwa-evolution.title',
      excerptKey: 'blog.posts.pwa-evolution.excerpt',
      date: '2026-03-01',
      tags: ['PWA', 'Service Workers'],
      slug: 'pwa-evolution-2026',
      imageUrl:
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
    },
    {
      id: '6',
      titleKey: 'blog.posts.cybersecurity.title',
      excerptKey: 'blog.posts.cybersecurity.excerpt',
      date: '2026-02-25',
      tags: ['Security', 'OIDC', 'JWT'],
      slug: 'modern-web-security',
      imageUrl:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop',
    },
  ];

  searchPosts(query?: string, page: number = 1, pageSize: number = 3): Observable<BlogResponse> {
    let filteredPosts = [...this.mockPosts];

    if (query && query.trim().length >= 3) {
      const lowerQuery = query.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.titleKey.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    const totalCount = filteredPosts.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

    return of({
      posts: paginatedPosts,
      totalCount,
      pageSize,
    }).pipe(delay(500));
  }
}
