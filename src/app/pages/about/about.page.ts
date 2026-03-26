import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { SectionDividerComponent } from '@shared/components/section-divider/section-divider.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FooterComponent,
    GlassCardComponent,
    NavComponent,
    NeonCardComponent,
    SectionDividerComponent,
    TranslocoDirective,
  ],
  selector: 'app-about-me-page',
  styleUrl: './about.page.scss',
  templateUrl: './about.page.html',
})
export class AboutMePageComponent {}
