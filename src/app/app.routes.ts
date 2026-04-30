import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('@pages/home/home.page')).HomePageComponent,
  },
  {
    path: 'about-me',
    loadComponent: async () => (await import('@pages/about/about.page')).AboutMePageComponent,
  },
  {
    path: 'blog',
    loadComponent: async () => (await import('@pages/blog/blog.page')).BlogPageComponent,
  },
  {
    path: 'blog/:slug',
    loadComponent: async () =>
      (await import('@pages/blog-detail/blog-detail.page')).BlogDetailPageComponent,
  },
  {
    path: 'contact',
    loadComponent: async () => (await import('@pages/contact/contact.page')).ContactPageComponent,
  },
  {
    path: 'projects/:id',
    loadComponent: async () =>
      (await import('@pages/project-detail/project-detail.page')).ProjectDetailPageComponent,
  },
  { path: '**', redirectTo: '' },
];
