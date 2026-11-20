import { Location, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { CV_DATA } from '@features/cv/cv.data';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Print rules need @page and html-level selectors, so styles are global and scoped under .cv by hand.
  encapsulation: ViewEncapsulation.None,
  imports: [FooterComponent, NavComponent, NgTemplateOutlet],
  selector: 'app-cv-page',
  styleUrl: './cv.page.scss',
  templateUrl: './cv.page.html',
})
export class CvPageComponent {
  private readonly location = inject(Location);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  private readonly openedFromAnotherPage = !!this.router.currentNavigation()?.previousNavigation;

  protected readonly cv = CV_DATA;

  constructor() {
    this.title.setTitle('CV · Francisco Javier Antúnez Durán — Senior Frontend Developer');
    this.meta.updateTag({
      content:
        'Curriculum de Francisco Javier Antúnez Durán, Senior Frontend Developer: TypeScript, Angular, React, Vue y Lit, testing, rendimiento y desarrollo asistido por IA. Descarga en PDF.',
      name: 'description',
    });
  }

  protected goBack(): void {
    if (this.openedFromAnotherPage) {
      this.location.back();
      return;
    }
    void this.router.navigateByUrl('/');
  }
}
