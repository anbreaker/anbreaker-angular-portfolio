import { fromEvent, map, NEVER, startWith, throttleTime } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  resource,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { BlogPost, SupportedLang } from '@core/interfaces/portfolio.interfaces';
import { BlogService } from '@core/services/blog.service';
import { MarkdownService } from '@core/services/markdown.service';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { YoutubePlayerComponent } from '@shared/components/youtube-player/youtube-player.component';

export interface TocHeading {
  id: string;
  text: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, NavComponent, TranslocoDirective, YoutubePlayerComponent],
  selector: 'app-blog-detail-page',
  styleUrl: './blog-detail.page.scss',
  templateUrl: './blog-detail.page.html',
  host: {
    '(window:keydown.escape)': 'onEscape()',
  },
})
export class BlogDetailPageComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly transloco = inject(TranslocoService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly LOCALE_MAP: Record<SupportedLang, string> = {
    en: 'en-US',
    es: 'es-ES',
    pt: 'pt-PT',
  };

  readonly activeHeadingId = signal('');
  readonly lightboxOpen = signal(false);
  readonly miniPlayerActivated = signal(false);
  readonly miniPlayerDismissed = signal(false);
  readonly post = signal<BlogPost | undefined>(undefined);
  readonly scrollProgress = toSignal(
    this.isBrowser
      ? fromEvent(window, 'scroll').pipe(
          throttleTime(50),
          map(() => this.calculateScrollProgress()),
          startWith(this.calculateScrollProgress())
        )
      : NEVER,
    { initialValue: 0 }
  );
  readonly videoModalOpen = signal(false);
  readonly videoSectionInView = signal(false);
  readonly videoSheetOpen = signal(false);

  private videoSectionObserver: IntersectionObserver | null = null;
  readonly currentLang: Signal<SupportedLang> = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang() as SupportedLang,
  }) as Signal<SupportedLang>;

  readonly safeContent = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.contentResource.value() ?? '')
  );

  readonly showFloatingVideo = computed(
    () =>
      !!this.post()?.videoId &&
      this.scrollProgress() > 5 &&
      !this.miniPlayerDismissed() &&
      (!this.videoSectionInView() || this.miniPlayerActivated())
  );

  readonly contentResource = resource({
    params: () => ({
      slug: this.post()?.slug ?? '',
      lang: this.currentLang(),
    }),
    loader: ({ params, abortSignal }) =>
      params.slug
        ? this.markdownService.fetchArticle({
            lang: params.lang,
            signal: abortSignal,
            slug: params.slug,
          })
        : Promise.resolve(''),
  });

  readonly currentImageUrl = computed(() => {
    const imageMap = this.post()?.imageUrl;
    return imageMap ? imageMap[this.currentLang()] : undefined;
  });

  readonly readingTime = computed(() => {
    const html = this.contentResource.value();
    if (!html) return 0;

    const plainText = html.replace(/<[^>]*>/g, ' ');
    const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(wordCount / 200));
  });

  readonly formattedDate = computed(() => {
    const currentPost = this.post();
    if (!currentPost) return '';

    const date = new Date(`${currentPost.date}T00:00:00`);
    return new Intl.DateTimeFormat(this.LOCALE_MAP[this.currentLang()], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  });

  readonly headings = computed<TocHeading[]>(() => {
    const html = this.contentResource.value();
    if (!html) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    return Array.from(div.querySelectorAll('h2[id]')).map((h) => ({
      id: h.getAttribute('id') ?? '',
      text: h.textContent ?? '',
    }));
  });

  private readonly syncHeadingWithScroll = effect(() => {
    this.scrollProgress();
    if (this.isBrowser) this.updateActiveHeading();
  });

  protected onEscape(): void {
    this.lightboxOpen.set(false);
    this.videoModalOpen.set(false);
    this.videoSheetOpen.set(false);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = this.blogService.getPostBySlug(slug);
    if (!found) {
      this.router.navigate(['/blog']);
      return;
    }
    this.post.set(found);
  }

  constructor() {
    afterEveryRender(() => {
      if (!this.isBrowser || this.videoSectionObserver) return;
      const section = document.querySelector('.article__video-bottom');
      if (!section) return;
      this.videoSectionObserver = new IntersectionObserver(
        ([entry]) => this.videoSectionInView.set(entry.isIntersecting),
        { threshold: 0.15 }
      );
      this.videoSectionObserver.observe(section);
    });
  }

  ngOnDestroy(): void {
    this.videoSectionObserver?.disconnect();
  }

  protected goToBlog(): void {
    this.router.navigate(['/blog']);
  }

  protected scrollToHeading(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected closeSheetOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.videoSheetOpen.set(false);
  }

  private calculateScrollProgress(): number {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  }

  private updateActiveHeading(): void {
    const articleHeadings = document.querySelectorAll<HTMLElement>('.article__content h2[id]');
    if (!articleHeadings.length) return;

    let active = articleHeadings[0].id;
    articleHeadings.forEach((articleHeading) => {
      if (articleHeading.getBoundingClientRect().top < 160) active = articleHeading.id;
    });

    this.activeHeadingId.set(active);
  }
}
