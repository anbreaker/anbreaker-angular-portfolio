import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';

import { BlogResponse } from '@core/interfaces/portfolio.interfaces';
import { BlogService } from '@core/services/blog.service';
import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FooterComponent,
    NavComponent,
    TranslocoDirective,
  ],
  selector: 'app-blog-page',
  styleUrl: './blog.page.scss',
  templateUrl: './blog.page.html',
})
export class BlogPageComponent {
  private readonly blogService = inject(BlogService);

  readonly currentPage = signal(1);
  readonly searchTerm = signal('');

  readonly searchQuery = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      filter((term) => term.length === 0 || term.length >= 3)
    ),
    { initialValue: '' }
  );

  readonly postsResource = rxResource<BlogResponse, { searchTerm: string; page: number }>({
    params: () => ({
      searchTerm: this.searchQuery() ?? '',
      page: this.currentPage(),
    }),
    stream: ({ params }) => this.blogService.searchPosts(params.searchTerm, params.page),
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1);
  }

  nextPage(): void {
    const response = this.postsResource.value();
    if (response && this.currentPage() * response.pageSize < response.totalCount) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }
}
