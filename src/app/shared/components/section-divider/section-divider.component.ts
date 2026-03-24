import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-divider.component.html',
  styleUrl: './section-divider.component.scss',
})
export class SectionDividerComponent {
  readonly fillColor = input<string>('#0a0a0c');
  readonly flip = input<boolean>(false);
}
