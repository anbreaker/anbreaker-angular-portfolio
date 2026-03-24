import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';

import { authInterceptor } from './core/interceptor/auth.interceptor';
import { I18nLoaderService } from './core/services/i18n-loader.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['es', 'en', 'pt'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: false,
      },
      loader: I18nLoaderService,
    }),
    provideRouter(routes),
  ],
};
