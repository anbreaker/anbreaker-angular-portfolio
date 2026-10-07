import { Pipe, PipeTransform } from '@angular/core';

import { SupportedLang } from '@core/interfaces/portfolio.interfaces';

const LOCALE_MAP: Record<SupportedLang, string> = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-PT',
};

/** Formats an ISO date (`YYYY-MM-DD`) in the language selected on the site, not the browser's. */
@Pipe({ name: 'localizedDate' })
export class LocalizedDatePipe implements PipeTransform {
  transform(isoDate: string, lang: SupportedLang): string {
    if (!isoDate) return '';

    // Local midnight keeps the same calendar day in every time zone
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
}
