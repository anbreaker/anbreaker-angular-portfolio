import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { SupportedLang } from '@core/interfaces/portfolio.interfaces';
import { LanguageStore } from '@core/store/language.store';

interface NavLink {
  anchor?: string;
  labelKey?: string;
  route?: string;
}

const LANG_FLAGS: Record<SupportedLang, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  pt: '🇵🇹',
};

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  selector: 'app-nav',
  styleUrl: './nav.component.scss',
  templateUrl: './nav.component.html',
})
export class NavComponent {
  protected readonly languageStore = inject(LanguageStore);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  protected readonly isDark = signal(true);
  protected readonly menuOpen = signal(false);

  protected readonly langFlags = LANG_FLAGS;

  protected readonly navLinks: NavLink[] = [
    { labelKey: 'nav.tech', anchor: 'tech' },
    { labelKey: 'nav.projects', anchor: 'projects' },
    { labelKey: 'nav.testimonials', anchor: 'testimonials' },
    { labelKey: 'nav.blog', route: '/blog' },
    { labelKey: 'nav.about', route: '/about-me' },
  ];

  handleNavigation(link: NavLink): void {
    if (link.anchor) {
      if (this.router.url === '/' || this.router.url.startsWith('/#')) {
        this.scrollToElement(link.anchor);
      } else {
        this.router.navigate(['/'], { fragment: link.anchor });
      }
    } else if (link.route) {
      this.router.navigate([link.route]);
    }
    this.menuOpen.set(false);
  }

  private scrollToElement(anchor: string): void {
    const anchorElement = this.document.getElementById(anchor);
    if (!anchorElement) return;

    const fontSize = parseFloat(getComputedStyle(this.document.documentElement).fontSize);
    const top =
      anchorElement.getBoundingClientRect().top +
      (this.document.defaultView?.scrollY ?? 0) -
      6 * fontSize;

    this.document.defaultView?.scrollTo({ top, behavior: 'smooth' });
  }

  scrollToAnchor(anchor: string): void {
    this.handleNavigation({ anchor });
  }

  setLang(lang: SupportedLang): void {
    this.languageStore.setLang(lang);
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  toggleTheme(event: MouseEvent): void {
    const html = this.document.documentElement;
    html.style.setProperty('--theme-x', `${event.clientX}px`);
    html.style.setProperty('--theme-y', `${event.clientY}px`);

    const run = (): void => {
      html.classList.toggle('light');
      this.isDark.set(!html.classList.contains('light'));
    };

    if ('startViewTransition' in this.document) {
      (
        this.document as Document & { startViewTransition: (cb: () => void) => void }
      ).startViewTransition(run);
    } else {
      run();
    }
  }
}
