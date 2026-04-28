import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  resource,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { BlogPost, SupportedLang } from '@core/interfaces/portfolio.interfaces';
import { BlogService } from '@core/services/blog.service';
import { MarkdownService } from '@core/services/markdown.service';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { YoutubePlayerComponent } from '@shared/components/youtube-player/youtube-player.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, NavComponent, TranslocoDirective, YoutubePlayerComponent],
  selector: 'app-blog-detail-page',
  styleUrl: './blog-detail.page.scss',
  templateUrl: './blog-detail.page.html',
})
export class BlogDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly markdownService = inject(MarkdownService);
  private readonly transloco = inject(TranslocoService);

  private readonly LOCALE_MAP: Record<SupportedLang, string> = {
    en: 'en-US',
    es: 'es-ES',
    pt: 'pt-PT',
  };

  readonly post = signal<BlogPost | undefined>(undefined);
  readonly currentLang: Signal<SupportedLang> = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang() as SupportedLang,
  }) as Signal<SupportedLang>;

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

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    const found = this.blogService.getPostBySlug(slug);
    if (!found) {
      this.router.navigate(['/blog']);
      return;
    }

    this.post.set(found);
  }

  goToBlog(): void {
    this.router.navigate(['/blog']);
  }
}
