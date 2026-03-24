import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';
import { Testimonial } from '../../core/interfaces/portfolio.interfaces';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlassCardComponent, TranslocoDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  protected readonly testimonials: Testimonial[] = [
    {
      id: 't1',
      quoteKey: 'testimonials.t1.quote',
      author: 'Alex Rivers',
      role: 'CTO',
      handle: '@TechVision',
    },
    {
      id: 't2',
      quoteKey: 'testimonials.t2.quote',
      author: 'Sofia Mendez',
      role: 'Product Lead',
      handle: '@SofiaLeads',
    },
    {
      id: 't3',
      quoteKey: 'testimonials.t3.quote',
      author: 'Marcus Chen',
      role: 'Founder',
      handle: '@MarcusCo',
    },
  ];
}
