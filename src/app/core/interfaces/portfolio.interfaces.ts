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
  /** Slug of a blog post about the project; the card links to it when set. */
  postSlug?: string;
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

export interface BlogAuthor {
  initials: string;
  name: string;
}

export interface BlogPost {
  author?: BlogAuthor;
  date: string;
  excerptKey: string;
  id: string;
  imageUrl?: Record<SupportedLang, string>;
  imageUrlLight?: Record<SupportedLang, string>;
  slug: string;
  tags: string[];
  titleKey: string;
  videoId?: Record<SupportedLang, string>;
}

export interface BlogResponse {
  pageSize: number;
  posts: BlogPost[];
  totalCount: number;
}

export type MonthYear = `${number}${number}/${number}${number}${number}${number}`;

export interface CvLink {
  displayText?: string;
  href: string;
  label: string;
}

export interface CvStat {
  label: string;
  value: string;
}

export interface CvProject {
  description: string;
  isFeatured?: boolean;
  kicker?: string;
  links: CvLink[];
  stats?: CvStat[];
  tags: string[];
  title: string;
}

export interface CvCapability {
  description: string;
  isHighlighted?: boolean;
  subtitle: string;
  tags: string[];
  title: string;
}

export interface CvExperience {
  bullets: string[];
  clientAndLocation?: string;
  commitLabel: string;
  endDate: MonthYear | 'actualidad';
  handwrittenNote?: string;
  isBeforeSoftware?: boolean;
  role: string;
  startDate: MonthYear;
}

export interface CvTestimonial {
  author: string;
  quote: string;
  role: string;
}

export interface CvFactItem {
  detail?: string;
  title: string;
}

export interface CvThesis {
  emphasis: string;
  intro: string;
  outro: string;
}

export interface CvData {
  capabilities: CvCapability[];
  contact: string[];
  downloads: CvLink[];
  education: CvFactItem[];
  experience: CvExperience[];
  headlineMeta: string;
  languages: CvFactItem[];
  name: { family: string; given: string };
  portraitCaption: string;
  profile: string;
  profiles: CvLink[];
  projects: CvProject[];
  role: string;
  testimonials: CvTestimonial[];
  thesis: CvThesis;
  workStyle: string[];
}
