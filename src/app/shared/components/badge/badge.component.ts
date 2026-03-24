import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge badge--{{ color() }}">{{ label() }}</span>`,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly color = input<'blue' | 'purple' | 'orange' | 'green'>('blue');
}
