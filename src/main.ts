import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

import './styles/styles.scss';

inject();
injectSpeedInsights();
bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
