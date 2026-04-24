import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { LanguageStore } from '@core/store/language.store';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { MagneticButtonDirective } from '@shared/directives/magnetic-button.directive';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { TiltDirective } from '@shared/directives/tilt.directive';

import { PROJECTS_DATA } from './projects.data';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeComponent,
    MagneticButtonDirective,
    NeonCardComponent,
    RevealDirective,
    TiltDirective,
    TranslocoDirective,
  ],
  selector: 'app-projects',
  styleUrl: './projects.component.scss',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  readonly #router = inject(Router);
  protected readonly langStore = inject(LanguageStore);

  protected readonly projects = PROJECTS_DATA;

  navigateToDetail(id: string): void {
    if (!document.startViewTransition) {
      this.#router.navigate(['/projects', id]);
      return;
    }
    document.startViewTransition(() => {
      this.#router.navigate(['/projects', id]);
    });
  }
}
