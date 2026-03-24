import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-neon-card',
  templateUrl: './neon-card.component.html',
  styleUrl: './neon-card.component.scss',
})
export class NeonCardComponent {
  readonly color = input<'blue' | 'purple' | 'orange' | 'green'>('blue');

  @HostBinding('class')
  get hostClass(): string {
    return `neon-card neon-card--${this.color()}`;
  }
}
