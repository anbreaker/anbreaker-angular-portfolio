import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { SupportedLang } from '@core/interfaces/portfolio.interfaces';
import { LanguageStore } from '@core/store/language.store';

import { TranslocoDirective } from '@jsverse/transloco';

interface NavLink {
  labelKey?: string;
  anchor?: string;
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
  protected readonly menuOpen = signal(false);
  protected readonly isDark = signal(true);
  protected readonly langFlags = LANG_FLAGS;
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  protected readonly navLinks: NavLink[] = [
    { labelKey: 'nav.projects', anchor: 'projects' },
    { labelKey: 'nav.tech', anchor: 'tech' },
    { labelKey: 'nav.testimonials', anchor: 'testimonials' },
    { labelKey: 'nav.about', route: '/about-me' },
    { labelKey: 'nav.blog', route: '/blog' },
  ];

  handleNavigation(link: NavLink): void {
    if (link.anchor) {
      if (this.router.url === '/' || this.router.url.startsWith('/#')) {
        document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.router.navigate(['/'], { fragment: link.anchor });
      }
    } else if (link.route) {
      this.router.navigate([link.route]);
    }
    this.menuOpen.set(false);
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

    const run = () => {
      html.classList.toggle('light');
      this.isDark.set(!html.classList.contains('light'));
    };

    if ('startViewTransition' in this.document) {
      (this.document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(run);
    } else {
      run();
    }
  }
}
