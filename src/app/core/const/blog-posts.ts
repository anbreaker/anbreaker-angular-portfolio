import type { BlogAuthor, BlogPost } from '../interfaces/portfolio.interfaces';

export const BLOG_AUTHOR: BlogAuthor = {
  initials: 'FJ',
  name: 'Francisco Javier Antúnez Durán',
};

/** Blog posts, newest first. Plain data so the build can read it too (RSS feeds). */
export const BLOG_POSTS: BlogPost[] = [
  {
    author: BLOG_AUTHOR,
    date: '2026-10-27',
    excerptKey: 'blog.posts.framed-by-santi.excerpt',
    id: '3',
    imageUrl: {
      en: '/assets/images/blog/framedBySanti/infographic_EN_dark.webp',
      es: '/assets/images/blog/framedBySanti/infographic_ES_dark.webp',
      pt: '/assets/images/blog/framedBySanti/infographic_PT_dark.webp',
    },
    imageUrlLight: {
      en: '/assets/images/blog/framedBySanti/infographic_EN_light.webp',
      es: '/assets/images/blog/framedBySanti/infographic_ES_light.webp',
      pt: '/assets/images/blog/framedBySanti/infographic_PT_light.webp',
    },
    slug: 'how-i-built-framed-by-santi',
    tags: ['Angular', 'Firebase', 'Performance', 'AI'],
    titleKey: 'blog.posts.framed-by-santi.title',
  },
  {
    author: BLOG_AUTHOR,
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
    slug: 'youtube-not-playing-mac-hdmi-audio',
    tags: ['macOS', 'Debugging', 'CoreAudio', 'YouTube'],
    titleKey: 'blog.posts.youtube-hdmi-audio.title',
  },
  {
    author: BLOG_AUTHOR,
    date: '2026-05-04',
    excerptKey: 'blog.posts.prettier-multiconsultora.excerpt',
    id: '1',
    imageUrl: {
      en: '/assets/images/blog/prettierPost/infographic_EN.webp',
      es: '/assets/images/blog/prettierPost/infographic_ES.webp',
      pt: '/assets/images/blog/prettierPost/infographic_PT.webp',
    },
    slug: 'spotless-code-multi-vendor-teams',
    tags: ['Prettier', 'Git', 'DevEx', 'Husky'],
    titleKey: 'blog.posts.prettier-multiconsultora.title',
    videoId: { en: '5yVhdCj9Bps', es: 'zjPeO-7TuMw', pt: 'kFDbIUBhv3I' },
  },
];
