import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Testimonial } from '../../core/interfaces/portfolio.interfaces';
import { GlassCardComponent } from '../../shared/components/glass-card/glass-card.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GlassCardComponent, TranslocoDirective],
  selector: 'app-testimonials',
  styleUrl: './testimonials.component.scss',
  templateUrl: './testimonials.component.html',
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
