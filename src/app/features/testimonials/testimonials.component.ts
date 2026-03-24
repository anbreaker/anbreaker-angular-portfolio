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
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAz95W9-DQpX2gIDPSGO2tRzFiTv795xuH3kgjrSRuAMsVjQtOpVUKa0mH5lIG3Y1-uG-7riRQ4vteSpZ0D8CCdG-12j5ndEhutb2P2gPpdTUCF81dx01vYXWpXJOLzA05Bao8Nq0AZXZcsTceIsLxf8NOx6FQ0oVBXCqIfkg_QW9fbbk4a8UoBVOJO2x6P6HUe-kY6eifsC198D14MYXsvS05K3v01L8kXV9BDr8dR2GslL_rIMMqLWNPuolluY0mf55RLnH41NTg',
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
