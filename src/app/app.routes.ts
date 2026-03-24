import { Routes } from '@angular/router';

import { ROUTES } from './core/const/routes';

export const routes: Routes = [
  // Example lazy-loaded route:
  // {
  //   path: ROUTES.HOME,
  //   loadComponent: async () =>
  //     (await import('./pages/home/home.component')).HomeComponent,
  // },
  { path: '**', redirectTo: ROUTES.HOME },
];
