import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { SupportedLang } from '../../core/interfaces/portfolio.interfaces';
import { LanguageStore } from '../../core/store/language.store';

import { TranslocoDirective } from '@jsverse/transloco';

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

  protected readonly navLinks = [
    { labelKey: 'nav.projects', anchor: 'projects' },
    { labelKey: 'nav.tech', anchor: 'tech' },
    { labelKey: 'nav.testimonials', anchor: 'testimonials' },
  ];

  scrollTo(anchor: string): void {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen.set(false);
  }

  setLang(lang: SupportedLang): void {
    this.languageStore.setLang(lang);
  }

  toggleMenu(): void {
    this.menuOpen.update(isOpen => !isOpen);
  }
}
