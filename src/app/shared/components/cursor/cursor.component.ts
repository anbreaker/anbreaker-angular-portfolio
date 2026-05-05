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
  private readonly destroyRef = inject(DestroyRef);

  private readonly dotEl = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ringEl = viewChild.required<ElementRef<HTMLElement>>('ring');

  private animationFrameId = 0;
  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;

  constructor() {
    afterNextRender(() => {
      const dot = this.dotEl().nativeElement;
      const ring = this.ringEl().nativeElement;

      const onMove = (mouseEvent: MouseEvent): void => {
        this.mouseX = mouseEvent.clientX;
        this.mouseY = mouseEvent.clientY;
        dot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) translate(-50%,-50%)`;
      };

      const onOver = (mouseEvent: MouseEvent): void => {
        if (
          (mouseEvent.target as Element).closest(
            'a, button, [role="button"], [data-cursor-hover], input, label, select, textarea'
          )
        ) {
          ring.classList.add('active');
        }
      };

      const onOut = (mouseEvent: MouseEvent): void => {
        if (
          (mouseEvent.target as Element).closest(
            'a, button, [role="button"], [data-cursor-hover], input, label, select, textarea'
          )
        ) {
          ring.classList.remove('active');
        }
      };

      const lerp = (): void => {
        this.ringX += (this.mouseX - this.ringX) * 0.22;
        this.ringY += (this.mouseY - this.ringY) * 0.22;
        ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%,-50%)`;
        this.animationFrameId = requestAnimationFrame(lerp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseover', onOver);
      document.addEventListener('mouseout', onOut);
      this.animationFrameId = requestAnimationFrame(lerp);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseover', onOver);
        document.removeEventListener('mouseout', onOut);
        cancelAnimationFrame(this.animationFrameId);
      });
    });
  }
}
