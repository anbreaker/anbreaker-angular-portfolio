import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { CardComponent } from '@features/card/card.component';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, FooterComponent, NavComponent],
  selector: 'app-card-page',
  styleUrl: './card.page.scss',
  templateUrl: './card.page.html',
})
export class CardPageComponent {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  constructor() {
    this.title.setTitle('Francisco Javier — Full Stack Developer');
    this.meta.updateTag({
      name: 'description',
      content:
        'Tarjeta de visita digital de Francisco Javier (anbreaker), Full Stack Developer especializado en Angular y Node. Contacto: hola@anbreaker.dev · github.com/anbreaker · linkedin.com/in/anbreaker.',
    });
  }
}
