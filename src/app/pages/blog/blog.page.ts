import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { BlogResponse } from '@core/interfaces/portfolio.interfaces';
import { BlogService } from '@core/services/blog.service';
import { LanguageStore } from '@core/store/language.store';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { LocalizedDatePipe } from '@shared/pipes/localized-date.pipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, LocalizedDatePipe, NavComponent, RouterLink, TranslocoDirective],
  selector: 'app-blog-page',
  styleUrl: './blog.page.scss',
  templateUrl: './blog.page.html',
})
export class BlogPageComponent {
  private readonly blogService = inject(BlogService);
  private readonly transloco = inject(TranslocoService);

  readonly currentLang = inject(LanguageStore).currentLang;

  readonly currentPage = signal(1);
  readonly searchTerm = signal('');

  readonly searchQuery = computed(() => {
    const term = this.searchTerm();
    return term.length === 0 || term.length >= 3 ? term : '';
  });

  readonly postsData = computed<BlogResponse>(() => {
    const lang = this.currentLang();
    return this.blogService.searchPosts(this.searchQuery(), this.currentPage(), undefined, (key) =>
      this.transloco.translate(key, {}, lang)
    );
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1);
  }

  nextPage(): void {
    const { pageSize, totalCount } = this.postsData();
    if (this.currentPage() * pageSize < totalCount) {
      this.currentPage.update((pageIndex) => pageIndex + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((pageIndex) => pageIndex - 1);
    }
  }
}
