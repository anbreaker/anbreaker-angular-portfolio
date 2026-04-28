import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-youtube-player',
  styleUrl: './youtube-player.component.scss',
  templateUrl: './youtube-player.component.html',
})
export class YoutubePlayerComponent implements AfterViewInit, OnDestroy {
  readonly videoId = input.required<string>();
  readonly videoTitle = input<string>('Video');

  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly wrapperRef = viewChild<ElementRef<HTMLElement>>('wrapper');

  readonly activated = signal(false);
  private observer: IntersectionObserver | null = null;
  private preconnected = false;

  get thumbnailUrl(): string {
    return `https://img.youtube.com/vi/${this.videoId()}/maxresdefault.jpg`;
  }

  get iframeSrc(): SafeResourceUrl {
    const url = `https://www.youtube-nocookie.com/embed/${this.videoId()}?autoplay=1&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.preconnected) {
          this.warmUpConnections();
          this.preconnected = true;
        }
      },
      { threshold: 0.1 }
    );
    const element = this.wrapperRef()?.nativeElement;
    if (element) this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  activate(): void {
    this.activated.set(true);
  }

  private warmUpConnections(): void {
    ['https://www.youtube-nocookie.com', 'https://i.ytimg.com'].forEach((href) => {
      if (this.document.querySelector(`link[href="${href}"][rel="preconnect"]`)) return;
      const link = this.document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      this.document.head.appendChild(link);
    });
  }
}
