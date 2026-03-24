import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styleUrl: './glass-card.component.scss',
})
export class GlassCardComponent {
  @HostBinding('class') readonly hostClass = 'glass-card';
}
