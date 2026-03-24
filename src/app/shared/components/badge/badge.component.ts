import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-badge',
  styleUrl: './badge.component.scss',
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  readonly color = input<'blue' | 'purple' | 'orange' | 'green'>('blue');
  readonly label = input.required<string>();
}
