import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TechItem } from '@core/interfaces/portfolio.interfaces';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NeonCardComponent, TranslocoDirective, RevealDirective],
  selector: 'app-tech-stack',
  styleUrl: './tech-stack.component.scss',
  templateUrl: './tech-stack.component.html',
})
export class TechStackComponent {
  protected readonly marqueeItems = [
    'Angular', 'NestJS', 'TypeScript', 'RxJS', 'Signals', 'Vitest',
    'Node.js', 'GitHub Actions', 'CSS Nesting', 'Docker',
  ];

  protected readonly techItems: TechItem[] = [
    {
      id: 'angular',
      name: 'Angular 21',
      description: 'Architecture',
      iconUrl: 'https://cdn.simpleicons.org/angular/ffffff',
      glowColor: 'orange',
      cardBg: '#c2410c',
    },
    {
      id: 'signals',
      name: 'Signals',
      description: 'Fine-grained State',
      iconUrl: 'https://cdn.simpleicons.org/lightning/ffffff',
      glowColor: 'purple',
      cardBg: '#6d28d9',
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      description: 'Type Safety',
      iconUrl: 'https://cdn.simpleicons.org/typescript/ffffff',
      glowColor: 'blue',
      cardBg: '#1d4ed8',
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      description: 'Reactive Flows',
      iconUrl: 'https://cdn.simpleicons.org/reactivex/ffffff',
      glowColor: 'purple',
      cardBg: '#92400e',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      description: 'High Speed Backend',
      iconUrl: 'https://cdn.simpleicons.org/nodedotjs/ffffff',
      glowColor: 'green',
      cardBg: '#166534',
    },
    {
      id: 'vitest',
      name: 'Vitest',
      description: 'Lightning Tests',
      iconUrl: 'https://cdn.simpleicons.org/vitest/ffffff',
      glowColor: 'green',
      cardBg: '#3f6212',
    },
    {
      id: 'css',
      name: 'CSS Nesting',
      description: 'Modern Styling',
      iconUrl: 'https://cdn.simpleicons.org/css3/ffffff',
      glowColor: 'blue',
      cardBg: '#075985',
    },
    {
      id: 'git',
      name: 'Git & GitHub',
      description: 'Version Control',
      iconUrl: 'https://cdn.simpleicons.org/github/ffffff',
      glowColor: 'purple',
      cardBg: '#1f2937',
    },
  ];
}
