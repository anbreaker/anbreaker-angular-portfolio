import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { GradientTrackDirective } from '@shared/directives/gradient-track.directive';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientTrackDirective, TranslocoDirective],
  selector: 'app-hero',
  styleUrl: './hero.component.scss',
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  }
}
