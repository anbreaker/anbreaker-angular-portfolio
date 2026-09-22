import { ChangeDetectionStrategy, Component, effect, ElementRef, viewChild } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { GradientTrackDirective } from '@shared/directives/gradient-track.directive';
import { RevealDirective } from '@shared/directives/reveal.directive';

import QRCodeStyling from 'qr-code-styling';

const CARD_QR_URL = 'https://rootdevs.es/';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GradientTrackDirective, RevealDirective, TranslocoDirective],
  selector: 'app-card',
  styleUrl: './card.component.scss',
  templateUrl: './card.component.html',
})
export class CardComponent {
  private readonly qrContainerRef = viewChild<ElementRef<HTMLElement>>('qrContainer');

  constructor() {
    // The QR container sits inside `*transloco`, an async structural directive, so the
    // viewChild ref isn't guaranteed to exist on the first render. `effect()` re-runs once
    // the signal resolves instead of firing (and silently no-op'ing) too early.
    effect(() => {
      const container = this.qrContainerRef()?.nativeElement;
      if (!container || container.childElementCount > 0) return;

      new QRCodeStyling({
        backgroundOptions: { color: 'transparent' },
        cornersDotOptions: { color: '#ffffff', type: 'dot' },
        cornersSquareOptions: { color: '#ffffff', type: 'extra-rounded' },
        data: CARD_QR_URL,
        dotsOptions: { color: '#ffffff', type: 'dots' },
        height: 240,
        image: '/assets/images/logoGear.webp',
        imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 8 },
        margin: 0,
        qrOptions: { errorCorrectionLevel: 'H' },
        type: 'svg',
        width: 240,
      }).append(container);
    });
  }
}
