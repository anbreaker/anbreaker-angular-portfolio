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
  { path: '**', redirectTo: '' },
];
