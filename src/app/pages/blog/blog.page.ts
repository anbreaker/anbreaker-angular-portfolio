import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { BlogResponse } from '@core/interfaces/portfolio.interfaces';
import { BlogService } from '@core/services/blog.service';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, NavComponent, RouterLink, TranslocoDirective],
  selector: 'app-blog-page',
  styleUrl: './blog.page.scss',
  templateUrl: './blog.page.html',
})
export class BlogPageComponent {
  private readonly blogService = inject(BlogService);

  readonly currentPage = signal(1);
  readonly searchTerm = signal('');

  readonly searchQuery = computed(() => {
    const term = this.searchTerm();
    return term.length === 0 || term.length >= 3 ? term : '';
  });

  readonly postsData = computed<BlogResponse>(() =>
    this.blogService.searchPosts(this.searchQuery(), this.currentPage())
  );

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
