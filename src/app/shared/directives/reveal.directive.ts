import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appReveal]',
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() appReveal = '';
  @Input() revealStagger = false;
  @Input() revealDelay = 0;

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const nativeElement = this.el.nativeElement;

    nativeElement.classList.add('reveal');

    if (this.revealStagger) nativeElement.classList.add('reveal-stagger');

    if (this.revealDelay) nativeElement.style.transitionDelay = `${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            nativeElement.classList.add('reveal-in');
            this.observer?.unobserve(nativeElement);
          }
        }
      },
      { threshold: 0.12 }
    );

    this.observer.observe(nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
