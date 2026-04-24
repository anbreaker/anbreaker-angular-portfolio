import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { GlassCardComponent } from '@shared/components/glass-card/glass-card.component';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { SectionDividerComponent } from '@shared/components/section-divider/section-divider.component';

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
export class AboutMePageComponent {
  protected readonly domains = [
    {
      key: 'code',
      icon: '</>',
      accent: 'cyan',
      tags: ['TypeScript', 'Vue.js', 'React', 'Angular', 'Lit', 'Vanilla JS', 'Node.js', 'Express'],
    },
    {
      key: 'infra',
      icon: '>_',
      accent: 'blue',
      tags: ['Linux', 'Raspberry Pi', 'Docker', 'Home Assistant', 'AI Agents', 'Claude'],
    },
    {
      key: 'nature',
      icon: '~/',
      accent: 'green',
      tags: ['Viñedos', 'Naranjos', 'Olivos', 'Permacultura', 'Suelo vivo'],
    },
  ];
}
