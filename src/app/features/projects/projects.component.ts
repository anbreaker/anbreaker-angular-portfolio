import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { NeonCardComponent } from '../../shared/components/neon-card/neon-card.component';
import { Project } from '../../core/interfaces/portfolio.interfaces';

interface TiltState {
  x: number;
  y: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, NeonCardComponent, TranslocoDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef<HTMLElement>>;

  protected readonly tiltStates = signal<TiltState[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  protected readonly projects: Project[] = [
    {
      id: 'neoflow',
      titleKey: 'projects.neoflow.title',
      descriptionKey: 'projects.neoflow.description',
      tags: ['Angular 21', 'Signals', 'D3.js', 'Node.js'],
      demoUrl: '#',
      codeUrl: '#',
    },
    {
      id: 'root-commerce',
      titleKey: 'projects.rootCommerce.title',
      descriptionKey: 'projects.rootCommerce.description',
      tags: ['Angular 21', 'TypeScript', 'Stripe', 'Firebase'],
      demoUrl: '#',
      codeUrl: '#',
    },
  ];

  onTilt(event: MouseEvent, index: number): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = this.projectCards.get(index)?.nativeElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((event.clientY - centerY) / (rect.height / 2)) * -6;
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * 6;

    this.tiltStates.update(states =>
      states.map((state, stateIndex) =>
        stateIndex === index ? { x: rotateX, y: rotateY } : state,
      ),
    );
  }

  resetTilt(index: number): void {
    this.tiltStates.update(states =>
      states.map((state, stateIndex) =>
        stateIndex === index ? { x: 0, y: 0 } : state,
      ),
    );
  }
}
