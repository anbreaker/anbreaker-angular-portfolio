import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
  readonly #router = inject(Router);
  protected readonly langStore = inject(LanguageStore);

  readonly projectId = toSignal(
    this.#route.paramMap.pipe(map((routeParam) => routeParam.get('id') ?? ''))
  );

  readonly project = computed(() =>
    PROJECTS_DATA.find((project) => project.id === this.projectId())
  );

  goToProjects(): void {
    this.#router.navigate(['/'], { fragment: 'projects' });
  }
}
