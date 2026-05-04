import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '@shared/directives/reveal.directive';

interface TestimonialItem {
  accent: string;
  id: string;
  initials: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TranslocoDirective],
  selector: 'app-testimonials',
  styleUrl: './testimonials.component.scss',
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  protected readonly testimonials: TestimonialItem[] = [
    { id: 't1', initials: 'FM', accent: '#fbcf46' },
    { id: 't2', initials: 'BG', accent: '#f43f5e' },
    { id: 't3', initials: 'JE', accent: '#fb5000' },
  ];

  protected readonly activeIndex = signal(0);

  protected readonly active = computed(() => this.testimonials[this.activeIndex()]);

  protected readonly sideItems = computed(() =>
    this.testimonials.filter((_, testimonialIndex) => testimonialIndex !== this.activeIndex())
  );

  protected readonly progress = computed(
    () => `${((this.activeIndex() + 1) / this.testimonials.length) * 100}%`
  );

  protected readonly counter = computed(
    () => `0${this.activeIndex() + 1} / 0${this.testimonials.length}`
  );

  protected readonly isPaused = signal(false);
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly INTERVAL_MS = 8000;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.activeIndex.update(
        (activeTestimonial) => (activeTestimonial + 1) % this.testimonials.length
      );
    }, this.INTERVAL_MS);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onPause(): void {
    this.isPaused.set(true);
    this.stopTimer();
  }

  onResume(): void {
    this.isPaused.set(false);
    this.startTimer();
  }

  private resetTimer(): void {
    if (!this.isPaused()) {
      this.stopTimer();
      this.startTimer();
    }
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
    this.resetTimer();
  }

  goToById(id: string): void {
    const idx = this.testimonials.findIndex((testimonial) => testimonial.id === id);
    if (idx >= 0) {
      this.activeIndex.set(idx);
      this.resetTimer();
    }
  }

  prev(): void {
    this.activeIndex.update(
      (activeTestimonial) =>
        (activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length
    );
    this.resetTimer();
  }

  next(): void {
    this.activeIndex.update(
      (activeTestimonial) => (activeTestimonial + 1) % this.testimonials.length
    );
    this.resetTimer();
  }
}
