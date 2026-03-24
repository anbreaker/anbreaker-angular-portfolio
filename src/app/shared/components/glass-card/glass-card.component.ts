import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-glass-card',
  templateUrl: './glass-card.component.html',
  styleUrl: './glass-card.component.scss',
})
export class GlassCardComponent {
  @HostBinding('class') readonly hostClass = 'glass-card';
}
