import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly color = input<'blue' | 'purple' | 'orange' | 'green'>('blue');
  readonly label = input.required<string>();
}
