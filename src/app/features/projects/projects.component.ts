import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';

import { Project } from '../../core/interfaces/portfolio.interfaces';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { NeonCardComponent } from '../../shared/components/neon-card/neon-card.component';

import { TranslocoDirective } from '@jsverse/transloco';

interface TiltState {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, NeonCardComponent, TranslocoDirective],
  selector: 'app-projects',
  styleUrl: './projects.component.scss',
  templateUrl: './projects.component.html',
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
      id: 'mimacrame',
      titleKey: 'projects.mimacrame.title',
      descriptionKey: 'projects.mimacrame.description',
      tags: ['Angular 21', 'Signals', 'Transloco', 'SCSS'],
      demoUrl: 'https://mimacrame.com',
      codeUrl: 'https://github.com/anbreaker/mimacrame-studio-2026',
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
