import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-neon-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './neon-card.component.scss',
})
export class NeonCardComponent {
  readonly color = input<'blue' | 'purple' | 'orange' | 'green'>('blue');

  @HostBinding('class')
  get hostClass(): string {
    return `neon-card neon-card--${this.color()}`;
  }
}
