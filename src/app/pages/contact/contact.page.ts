import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactComponent } from '@features/contact/contact.component';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactComponent, FooterComponent, NavComponent],
  selector: 'app-contact-page',
  styleUrl: './contact.page.scss',
  templateUrl: './contact.page.html',
})
export class ContactPageComponent {}
