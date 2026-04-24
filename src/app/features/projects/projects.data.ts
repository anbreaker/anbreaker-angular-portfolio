import { Project } from '@core/interfaces/portfolio.interfaces';

export const PROJECTS_DATA: Project[] = [
  {
    codeUrl: 'https://github.com/anbreaker/mimacrame-studio-2026',
    demoUrl: 'https://mimacrame.com',
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
