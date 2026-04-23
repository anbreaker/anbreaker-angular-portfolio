import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appGradientTrack]',
})
export class GradientTrackDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly angleVar = input<string>('--gradient-angle');

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const { left, top, width, height } = this.elementRef.nativeElement.getBoundingClientRect();
    const angle =
      Math.atan2(event.clientY - (top + height / 2), event.clientX - (left + width / 2)) *
        (180 / Math.PI) +
      90;
    this.elementRef.nativeElement.style.setProperty(this.angleVar(), `${angle}deg`);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.elementRef.nativeElement.style.removeProperty(this.angleVar());
  }
}
