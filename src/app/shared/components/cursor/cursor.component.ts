import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cursor',
  styleUrl: './cursor.component.scss',
  templateUrl: './cursor.component.html',
})
export class CursorComponent {
  private readonly dotEl = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ringEl = viewChild.required<ElementRef<HTMLElement>>('ring');
  private readonly destroyRef = inject(DestroyRef);

  private mx = 0; private my = 0;
  private rx = 0; private ry = 0;
  private rafId = 0;

  constructor() {
    afterNextRender(() => {
      document.addEventListener('mousemove', this.onMove);
      document.addEventListener('mouseover', this.onOver);
      document.addEventListener('mouseout', this.onOut);
      this.rafId = requestAnimationFrame(this.lerp);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('mousemove', this.onMove);
        document.removeEventListener('mouseover', this.onOver);
        document.removeEventListener('mouseout', this.onOut);
        cancelAnimationFrame(this.rafId);
      });
    });
  }

  private readonly onMove = (e: MouseEvent): void => {
    this.mx = e.clientX;
    this.my = e.clientY;
    this.dotEl().nativeElement.style.transform = `translate(${this.mx}px, ${this.my}px) translate(-50%,-50%)`;
  };

  private readonly onOver = (e: MouseEvent): void => {
    if ((e.target as Element).closest('a, button, [role="button"], [data-cursor-hover], input, label, select, textarea')) {
      this.ringEl().nativeElement.classList.add('active');
    }
  };

  private readonly onOut = (e: MouseEvent): void => {
    if ((e.target as Element).closest('a, button, [role="button"], [data-cursor-hover], input, label, select, textarea')) {
      this.ringEl().nativeElement.classList.remove('active');
    }
  };

  private readonly lerp = (): void => {
    this.rx += (this.mx - this.rx) * 0.18;
    this.ry += (this.my - this.ry) * 0.18;
    this.ringEl().nativeElement.style.transform = `translate(${this.rx}px, ${this.ry}px) translate(-50%,-50%)`;
    this.rafId = requestAnimationFrame(this.lerp);
  };
}
