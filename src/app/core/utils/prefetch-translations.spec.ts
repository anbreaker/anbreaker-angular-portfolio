import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { LanguageStore } from '@core/store/language.store';

import { prefetchTranslations } from './prefetch-translations';

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('prefetchTranslations', () => {
  const load = vi.fn(() => of({}));
  const setActiveLang = vi.fn();

  beforeEach(() => {
    load.mockClear();
    localStorage.setItem('portfolio-lang', 'pt');

    TestBed.configureTestingModule({
      providers: [{ provide: TranslocoService, useValue: { load, setActiveLang } }],
    });
  });

  it('starts loading the active language translations at bootstrap', () => {
    TestBed.runInInjectionContext(() => prefetchTranslations());

    expect(load).toHaveBeenCalledExactlyOnceWith('pt');
  });

  it('uses the language resolved by the language store', () => {
    TestBed.runInInjectionContext(() => prefetchTranslations());

    expect(TestBed.inject(LanguageStore).currentLang()).toBe('pt');
  });
});
