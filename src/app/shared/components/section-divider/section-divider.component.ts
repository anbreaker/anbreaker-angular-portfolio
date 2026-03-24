import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-section-divider',
  styleUrl: './section-divider.component.scss',
  templateUrl: './section-divider.component.html',
})
export class SectionDividerComponent {
  readonly fillColor = input<string>('#0a0a0c');
  readonly flip = input<boolean>(false);
}
