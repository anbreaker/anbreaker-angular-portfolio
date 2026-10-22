import { Project } from '@core/interfaces/portfolio.interfaces';

export const PROJECTS_DATA: Project[] = [
  {
    codeUrl: 'https://github.com/anbreaker/framed-by-santi',
    demoUrl: 'https://framedbysanti.rootdevs.es',
    descriptionKey: 'projects.framed-by-santi.description',
    detail: {
      impactKey: 'projects.framed-by-santi.detail.impact',
      kickerKey: 'projects.detail.kicker.caseStudy',
      longDescriptionKey: 'projects.framed-by-santi.detail.longDescription',
      stack: [
        'Angular 22',
        'Signals',
        'Firebase',
        'Cloudinary',
        'Vercel',
        'DeepL',
        'Transloco',
        'Vitest',
      ],
    },
    id: 'framed-by-santi',
    imageUrl: {
      en: '/assets/images/projects/framedBySantiEN.webp',
      es: '/assets/images/projects/framedBySantiES.webp',
      pt: '/assets/images/projects/framedBySantiPT.webp',
    },
    postSlug: 'how-i-built-framed-by-santi',
    tags: ['Angular 22', 'Firebase', 'Cloudinary', 'Vercel', 'Signals'],
    titleKey: 'projects.framed-by-santi.title',
  },
  {
    codeUrl: 'https://github.com/anbreaker/mimacrame-studio-2026',
    // demoUrl: 'https://mimacrame.',
    descriptionKey: 'projects.mimacrame.description',
    detail: {
      impactKey: 'projects.mimacrame.detail.impact',
      kickerKey: 'projects.detail.kicker.caseStudy',
      longDescriptionKey: 'projects.mimacrame.detail.longDescription',
      stack: ['Angular 21', 'Firebase Spark', 'Stripe', 'Signals', 'Transloco', 'SCSS'],
    },
    id: 'mimacrame',
    imageUrl: {
      en: '/assets/images/projects/mimacrameEN.webp',
      es: '/assets/images/projects/mimacrameES.webp',
      pt: '/assets/images/projects/mimacramePT.webp',
    },
    tags: ['Angular 21', 'Firebase', 'Stripe', 'Signals', 'Transloco'],
    titleKey: 'projects.mimacrame.title',
  },
  {
    codeUrl: 'https://github.com/anbreaker/anbreaker-angular-portfolio',
    demoUrl: '#',
    descriptionKey: 'projects.portfolio.description',
    detail: {
      impactKey: 'projects.portfolio.detail.impact',
      kickerKey: 'projects.detail.kicker.inProgress',
      longDescriptionKey: 'projects.portfolio.detail.longDescription',
      stack: ['Angular 21', 'Signals', 'Transloco', 'SCSS', 'View Transitions API', 'Zoneless'],
    },
    id: 'portfolio',
    imageUrl: {
      en: '/assets/images/projects/portfolioEn.webp',
      es: '/assets/images/projects/portfolioES.webp',
      pt: '/assets/images/projects/portfolioPT.webp',
    },
    tags: ['Angular 21', 'Signals', 'Transloco', 'SCSS', 'View Transitions'],
    titleKey: 'projects.portfolio.title',
  },
];
