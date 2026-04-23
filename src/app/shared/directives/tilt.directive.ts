import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appTilt]',
})
export class TiltDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private shineEl!: HTMLElement;

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const host = this.elementRef.nativeElement;

    this.shineEl = document.createElement('div');
    this.shineEl.setAttribute('aria-hidden', 'true');
    Object.assign(this.shineEl.style, {
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      background:
        'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(34,211,238,0.22), transparent 55%)',
      opacity: '0',
      transition: 'opacity 0.3s',
      pointerEvents: 'none',
      zIndex: '2',
    });
    host.appendChild(this.shineEl);

    host.addEventListener('mousemove', this.onMove);
    host.addEventListener('mouseleave', this.onLeave);

    this.destroyRef.onDestroy(() => {
      host.removeEventListener('mousemove', this.onMove);
      host.removeEventListener('mouseleave', this.onLeave);
      this.shineEl.remove();
    });
  }

  private readonly onMove = (e: MouseEvent): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = this.elementRef.nativeElement;
    const { left, top, width, height } = host.getBoundingClientRect();
    const px = (e.clientX - left) / width;
    const py = (e.clientY - top) / height;
    host.style.transform = `perspective(800px) rotateX(${(py - 0.5) * -14}deg) rotateY(${(px - 0.5) * 14}deg)`;
    host.style.setProperty('--mx', `${px * 100}%`);
    host.style.setProperty('--my', `${py * 100}%`);
    this.shineEl.style.opacity = '1';
  };

  private readonly onLeave = (): void => {
    this.elementRef.nativeElement.style.transform = '';
    this.shineEl.style.opacity = '0';
  };
}
