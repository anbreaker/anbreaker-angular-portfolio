export type SupportedLang = 'es' | 'en' | 'pt';

export interface TechItem {
  cardBg?: string;
  description: string;
  glowColor: 'blue' | 'purple' | 'orange' | 'green';
  iconUrl: string;
  id: string;
  name: string;
}

export interface ProjectDetail {
  impactKey: string;
  kickerKey?: string;
  longDescriptionKey: string;
  stack: string[];
}

export interface Project {
  codeUrl?: string;
  demoUrl?: string;
  descriptionKey: string;
  detail?: ProjectDetail;
  id: string;
  imageUrl?: Record<SupportedLang, string>;
  tags: string[];
  titleKey: string;
}

export interface Testimonial {
  author: string;
  avatarUrl?: string;
  handle: string;
  id: string;
  quoteKey: string;
  role: string;
}

export interface SocialLink {
  ariaLabel: string;
  icon: string;
  platform: string;
  url: string;
}

export interface BlogPost {
  date: string;
  excerptKey: string;
  id: string;
  imageUrl?: string;
  slug: string;
  tags: string[];
  titleKey: string;
}

export interface BlogResponse {
  pageSize: number;
  posts: BlogPost[];
  totalCount: number;
}
