import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';

import { RevealDirective } from '@shared/directives/reveal.directive';
import { TranslocoDirective } from '@jsverse/transloco';

interface TestimonialItem {
  id: string;
  initials: string;
  accentClass: 'av-a' | 'av-b' | 'av-c';
  accent: string;
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
    { id: 't1', initials: 'AR', accentClass: 'av-a', accent: '#22d3ee' },
    { id: 't2', initials: 'SM', accentClass: 'av-b', accent: '#f43f5e' },
    { id: 't3', initials: 'MC', accentClass: 'av-c', accent: '#a78bfa' },
  ];

  protected readonly activeIndex = signal(0);

  protected readonly active = computed(() => this.testimonials[this.activeIndex()]);

  protected readonly sideItems = computed(() =>
    this.testimonials.filter((_, i) => i !== this.activeIndex())
  );

  protected readonly progress = computed(
    () => `${((this.activeIndex() + 1) / this.testimonials.length) * 100}%`
  );

  protected readonly counter = computed(
    () =>
      `0${this.activeIndex() + 1} / 0${this.testimonials.length}`
  );

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.activeIndex.update((i) => (i + 1) % this.testimonials.length);
    }, 6000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
  }

  goToById(id: string): void {
    const idx = this.testimonials.findIndex((t) => t.id === id);
    if (idx >= 0) this.activeIndex.set(idx);
  }

  prev(): void {
    this.activeIndex.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.testimonials.length);
  }
}
