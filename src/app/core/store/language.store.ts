import { inject, Injectable, signal } from '@angular/core';

import { SupportedLang } from '@core/interfaces/portfolio.interfaces';

import { TranslocoService } from '@jsverse/transloco';

const STORAGE_KEY = 'portfolio-lang';
const SUPPORTED_LANGS: SupportedLang[] = ['es', 'en', 'pt'];
const DEFAULT_LANG: SupportedLang = 'en';

function resolveInitialLang(): SupportedLang {
  const stored = localStorage.getItem(STORAGE_KEY) as SupportedLang | null;
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

  const browser = navigator.language.slice(0, 2) as SupportedLang;
  if (SUPPORTED_LANGS.includes(browser)) return browser;

  return DEFAULT_LANG;
}

@Injectable({ providedIn: 'root' })
export class LanguageStore {
  private readonly transloco = inject(TranslocoService);

  readonly supportedLangs = SUPPORTED_LANGS;

  private readonly _currentLang = signal<SupportedLang>(resolveInitialLang());
  readonly currentLang = this._currentLang.asReadonly();

  constructor() {
    this.transloco.setActiveLang(this._currentLang());
  }

  setLang(lang: SupportedLang): void {
    this._currentLang.set(lang);
    this.transloco.setActiveLang(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }
}
