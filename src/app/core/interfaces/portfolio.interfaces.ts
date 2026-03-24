export type SupportedLang = 'es' | 'en' | 'pt';

export interface TechItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  glowColor: 'blue' | 'purple' | 'orange' | 'green';
  cardBg?: string;
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  imageUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
}

export interface Testimonial {
  id: string;
  quoteKey: string;
  author: string;
  role: string;
  handle: string;
  avatarUrl?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
  icon: string;
}
