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
      date: '2026-09-30',
      excerptKey: 'blog.posts.youtube-hdmi-audio.excerpt',
      id: '2',
      imageUrl: {
        en: '/assets/images/blog/youtubeHdmiAudio/infographic_EN_dark.webp',
        es: '/assets/images/blog/youtubeHdmiAudio/infographic_ES_dark.webp',
        pt: '/assets/images/blog/youtubeHdmiAudio/infographic_PT_dark.webp',
      },
      imageUrlLight: {
        en: '/assets/images/blog/youtubeHdmiAudio/infographic_EN_light.webp',
        es: '/assets/images/blog/youtubeHdmiAudio/infographic_ES_light.webp',
        pt: '/assets/images/blog/youtubeHdmiAudio/infographic_PT_light.webp',
      },
      slug: 'youtube-no-reproduce-mac-audio-hdmi',
      tags: ['macOS', 'Debugging', 'CoreAudio', 'YouTube'],
      titleKey: 'blog.posts.youtube-hdmi-audio.title',
    },
    {
      author: this.AUTHOR,
      date: '2026-05-04',
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
      videoId: { en: '5yVhdCj9Bps', es: 'zjPeO-7TuMw', pt: 'kFDbIUBhv3I' },
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
