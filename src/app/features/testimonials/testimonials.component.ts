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
    { id: 't1', initials: 'FM', accent: '#22d3ee' },
    { id: 't2', initials: 'SM', accent: '#f43f5e' },
    { id: 't3', initials: 'MC', accent: '#a78bfa' },
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

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.activeIndex.update(
        (activeTestimonial) => (activeTestimonial + 1) % this.testimonials.length
      );
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }

  goToById(id: string): void {
    const idx = this.testimonials.findIndex((testimonial) => testimonial.id === id);
    if (idx >= 0) this.activeIndex.set(idx);
  }

  prev(): void {
    this.activeIndex.update(
      (activeTestimonial) =>
        (activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length
    );
  }

  next(): void {
    this.activeIndex.update(
      (activeTestimonial) => (activeTestimonial + 1) % this.testimonials.length
    );
  }
}
