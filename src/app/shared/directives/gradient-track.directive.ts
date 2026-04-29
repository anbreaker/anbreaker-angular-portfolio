import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appGradientTrack]',
  host: {
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class GradientTrackDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly angleVar = input<string>('--gradient-angle');

  onMouseMove(event: MouseEvent): void {
    const { left, top, width, height } = this.elementRef.nativeElement.getBoundingClientRect();
    const angle =
      Math.atan2(event.clientY - (top + height / 2), event.clientX - (left + width / 2)) *
        (180 / Math.PI) +
      90;
    this.elementRef.nativeElement.style.setProperty(this.angleVar(), `${angle}deg`);
  }

  onMouseLeave(): void {
    this.elementRef.nativeElement.style.removeProperty(this.angleVar());
  }
}
