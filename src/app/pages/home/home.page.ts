import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroComponent } from '../../features/hero/hero.component';
import { NavComponent } from '../../features/nav/nav.component';
import { SectionDividerComponent } from '../../shared/components/section-divider/section-divider.component';
import { TechStackComponent } from '../../features/tech-stack/tech-stack.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, NavComponent, SectionDividerComponent, TechStackComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePageComponent {}
