import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-glass-card',
  styleUrl: './glass-card.component.scss',
  template: `
    <ng-content />
  `,
})
export class GlassCardComponent {
  @HostBinding('class') readonly hostClass = 'glass-card';
}
