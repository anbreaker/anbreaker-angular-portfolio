import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavComponent } from '../../features/nav/nav.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePageComponent {}
