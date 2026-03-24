import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HeroComponent } from '../../features/hero/hero.component';
import { NavComponent } from '../../features/nav/nav.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroComponent, NavComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePageComponent {}
