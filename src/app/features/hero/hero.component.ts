import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
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
