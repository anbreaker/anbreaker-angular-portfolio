import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FooterComponent } from '@features/footer/footer.component';
import { HeroComponent } from '@features/hero/hero.component';
import { NavComponent } from '@features/nav/nav.component';
import { ProjectsComponent } from '@features/projects/projects.component';
import { TechStackComponent } from '@features/tech-stack/tech-stack.component';
import { TestimonialsComponent } from '@features/testimonials/testimonials.component';
import { SectionDividerComponent } from '@shared/components/section-divider/section-divider.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, HeroComponent, NavComponent, ProjectsComponent, SectionDividerComponent, TechStackComponent, TestimonialsComponent],
  selector: 'app-home-page',
  styleUrl: './home.page.scss',
  templateUrl: './home.page.html',
})
export class HomePageComponent {}
