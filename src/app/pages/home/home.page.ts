import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroComponent } from '../../features/hero/hero.component';
import { NavComponent } from '../../features/nav/nav.component';
import { ProjectsComponent } from '../../features/projects/projects.component';
import { SectionDividerComponent } from '../../shared/components/section-divider/section-divider.component';
import { TechStackComponent } from '../../features/tech-stack/tech-stack.component';
import { TestimonialsComponent } from '../../features/testimonials/testimonials.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, NavComponent, ProjectsComponent, SectionDividerComponent, TechStackComponent, TestimonialsComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePageComponent {}
