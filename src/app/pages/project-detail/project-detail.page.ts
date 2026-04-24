import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { LanguageStore } from '@core/store/language.store';
import { PROJECTS_DATA } from '@features/projects/projects.data';
import { MagneticButtonDirective } from '@shared/directives/magnetic-button.directive';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticButtonDirective, TranslocoDirective],
  selector: 'app-project-detail-page',
  styleUrl: './project-detail.page.scss',
  templateUrl: './project-detail.page.html',
})
export class ProjectDetailPageComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  protected readonly langStore = inject(LanguageStore);

  readonly projectId = toSignal(
    this.#route.paramMap.pipe(map((routeParam) => routeParam.get('id') ?? ''))
  );

  readonly project = computed(() =>
    PROJECTS_DATA.find((project) => project.id === this.projectId())
  );

  goBack(): void {
    if (!document.startViewTransition) {
      this.#location.back();
      return;
    }

    document.startViewTransition(() => this.#location.back());
  }
}
