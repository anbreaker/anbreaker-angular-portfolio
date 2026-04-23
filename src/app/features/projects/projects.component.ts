import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Project } from '@core/interfaces/portfolio.interfaces';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { NeonCardComponent } from '@shared/components/neon-card/neon-card.component';
import { RevealDirective } from '@shared/directives/reveal.directive';
import { TiltDirective } from '@shared/directives/tilt.directive';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, NeonCardComponent, TranslocoDirective, RevealDirective, TiltDirective],
  selector: 'app-projects',
  styleUrl: './projects.component.scss',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {

  protected readonly projects: Project[] = [
    {
      id: 'neoflow',
      titleKey: 'projects.neoflow.title',
      descriptionKey: 'projects.neoflow.description',
      tags: ['Angular 21', 'Signals', 'D3.js', 'Node.js'],
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCY7ZJZHuIwuSEWY1JJVI_EbKEddgTV8ETWvLcOifExbM62CdHT8w9yjUote-iosalkY4HuaKF1O1fLVSqVPLnw6zzLjn8Jag_0p3tT_k-hE6pvRVq6fxoECWbo5MFd9tTaF5RMGe-KtrJAxtMCavFIY6vhwXShuoNz4smjHMnay4bFPNRnjJP4lrRzgfYC5r3GgUu7SxFMzyX7Bknbv8OKm0CCFyjQ82j1nA_BKCZKZRRtnNlmIgpqF_kOsVACcCz38qqYN6vISN4',
      demoUrl: '#',
      codeUrl: '#',
    },
    {
      id: 'mimacrame',
      titleKey: 'projects.mimacrame.title',
      descriptionKey: 'projects.mimacrame.description',
      tags: ['Angular 21', 'Signals', 'Transloco', 'SCSS'],
      demoUrl: 'https://mimacrame.com',
      codeUrl: 'https://github.com/anbreaker/mimacrame-studio-2026',
    },
  ];

}
