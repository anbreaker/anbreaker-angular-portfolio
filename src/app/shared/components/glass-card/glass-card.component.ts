import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-glass-card',
  styleUrl: './glass-card.component.scss',
  templateUrl: './glass-card.component.html',
})
export class GlassCardComponent {
  @HostBinding('class') readonly hostClass = 'glass-card';
}
