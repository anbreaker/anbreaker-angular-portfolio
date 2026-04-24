import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appMagneticButton]',
})
export class MagneticButtonDirective implements OnInit, OnDestroy {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly #isTouchDevice = window.matchMedia('(hover: none)').matches;

  readonly #onMouseMove = (mouseEvent: MouseEvent): void => {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const x = mouseEvent.clientX - (rect.left + rect.width / 2);
    const y = mouseEvent.clientY - (rect.top + rect.height / 2);
    this.elementRef.nativeElement.style.transform = `translate(${x * 0.35}px, ${y * 0.4}px)`;
  };

  readonly #onMouseLeave = (): void => {
    this.elementRef.nativeElement.style.transform = '';
  };

  ngOnInit(): void {
    if (this.#isTouchDevice) return;
    this.elementRef.nativeElement.addEventListener('mousemove', this.#onMouseMove);
    this.elementRef.nativeElement.addEventListener('mouseleave', this.#onMouseLeave);
  }

  ngOnDestroy(): void {
    if (this.#isTouchDevice) return;
    this.elementRef.nativeElement.removeEventListener('mousemove', this.#onMouseMove);
    this.elementRef.nativeElement.removeEventListener('mouseleave', this.#onMouseLeave);
  }
}
