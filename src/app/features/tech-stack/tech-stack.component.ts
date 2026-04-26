import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { TechItem } from '@core/interfaces/portfolio.interfaces';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NeonCardComponent, RevealDirective, TranslocoDirective],
  selector: 'app-tech-stack',
  styleUrl: './tech-stack.component.scss',
  templateUrl: './tech-stack.component.html',
})
export class TechStackComponent {
  protected readonly marqueeItems = [
    'JavaScript',
    'TypeScript',
    'React',
    'Angular',
    'Signals',
    'Lit',
    'Vue',
    'Vitest',
    'Node.js',
    'Express',
    'GitHub Actions',
    'CSS Nesting',
    'Docker',
  ];

  protected readonly techItems: TechItem[] = [
    {
      cardBg: '#c2410c',
      description: 'Architecture',
      glowColor: 'orange',
      iconUrl: 'https://cdn.simpleicons.org/angular/ffffff',
      id: 'angular',
      name: 'Angular 21',
    },
    {
      cardBg: '#6d28d9',
      description: 'State Management',
      glowColor: 'purple',
      iconUrl: 'https://cdn.simpleicons.org/lightning/ffffff',
      id: 'signals',
      name: 'Signals',
    },
    {
      cardBg: '#1d4ed8',
      description: 'Type Safety',
      glowColor: 'blue',
      iconUrl: 'https://cdn.simpleicons.org/typescript/ffffff',
      id: 'typescript',
      name: 'TypeScript',
    },
    {
      cardBg: '#047857',
      description: 'Component Systems',
      glowColor: 'green',
      iconUrl: 'https://cdn.simpleicons.org/vuedotjs/ffffff',
      id: 'vue',
      name: 'Vue',
    },
    {
      cardBg: '#166534',
      description: 'High Speed Backend',
      glowColor: 'green',
      iconUrl: 'https://cdn.simpleicons.org/nodedotjs/ffffff',
      id: 'nodejs',
      name: 'Node.js',
    },
    {
      cardBg: '#3f6212',
      description: 'Lightning Tests',
      glowColor: 'green',
      iconUrl: 'https://cdn.simpleicons.org/vitest/ffffff',
      id: 'vitest',
      name: 'Vitest',
    },
    {
      cardBg: '#075985',
      description: 'Modern Styling',
      glowColor: 'blue',
      iconUrl: 'https://cdn.simpleicons.org/css/ffffff',
      id: 'css',
      name: 'CSS Nesting',
    },
    {
      cardBg: '#1f2937',
      description: 'CI/CD Automation',
      glowColor: 'purple',
      iconUrl: 'https://cdn.simpleicons.org/githubactions/ffffff',
      id: 'git',
      name: 'GitHub Actions',
    },
  ];
}
