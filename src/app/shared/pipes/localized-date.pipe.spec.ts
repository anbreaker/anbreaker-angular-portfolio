import { LocalizedDatePipe } from './localized-date.pipe';

describe('LocalizedDatePipe', () => {
  const pipe = new LocalizedDatePipe();

  it('formats an ISO date in the site language', () => {
    expect(pipe.transform('2026-09-30', 'en')).toBe('Sep 30, 2026');
    expect(pipe.transform('2026-09-30', 'es')).toBe('30 sept 2026');
    expect(pipe.transform('2026-09-30', 'pt')).toBe('30/09/2026');
  });

  it('keeps the calendar day regardless of the visitor time zone', () => {
    // A plain `new Date('2026-09-01')` is UTC midnight and would render as Aug 31 west of UTC
    expect(pipe.transform('2026-09-01', 'en')).toBe('Sep 1, 2026');
  });

  it('returns an empty string for an empty date', () => {
    expect(pipe.transform('', 'en')).toBe('');
  });
});
