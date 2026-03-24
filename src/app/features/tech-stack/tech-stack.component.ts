import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TechItem } from '../../core/interfaces/portfolio.interfaces';
import { NeonCardComponent } from '../../shared/components/neon-card/neon-card.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NeonCardComponent, TranslocoDirective],
  selector: 'app-tech-stack',
  styleUrl: './tech-stack.component.scss',
  templateUrl: './tech-stack.component.html',
})
export class TechStackComponent {
  protected readonly techItems: TechItem[] = [
    {
      id: 'angular',
      name: 'Angular 21',
      description: 'Architecture',
      iconUrl: 'assets/icons/angular.svg',
      glowColor: 'orange',
    },
    {
      id: 'signals',
      name: 'Signals',
      description: 'Fine-grained State',
      iconUrl: 'assets/icons/signals.svg',
      glowColor: 'blue',
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      description: 'Type Safety',
      iconUrl: 'assets/icons/typescript.svg',
      glowColor: 'blue',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'Reactive Flows',
      iconUrl: 'assets/icons/rxjs.svg',
      glowColor: 'purple',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'High Speed Backend',
      iconUrl: 'assets/icons/nodejs.svg',
      glowColor: 'green',
    },
    {
      id: 'vitest',
      name: 'Vitest',
      description: 'Lightning Tests',
      iconUrl: 'assets/icons/vitest.svg',
      glowColor: 'green',
    },
    {
      id: 'css',
      name: 'CSS Nesting',
      description: 'Modern Styling',
      iconUrl: 'assets/icons/css.svg',
      glowColor: 'blue',
    },
    {
      id: 'git',
      name: 'Git & GitHub',
      description: 'Version Control',
      iconUrl: 'assets/icons/github.svg',
      glowColor: 'purple',
    },
  ];
}
