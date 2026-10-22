import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { MagneticButtonDirective } from '@shared/directives/magnetic-button.directive';
import { RevealDirective } from '@shared/directives/reveal.directive';

type ProjectType = 'collaboration' | 'consulting' | 'other';
type FormStatus = 'error' | 'idle' | 'loading' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** The same limits `api/contact.ts` checks, so the form never sends what the server refuses. */
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticButtonDirective, RevealDirective, RouterLink, TranslocoDirective],
  selector: 'app-contact',
  styleUrl: './contact.component.scss',
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly injector = inject(Injector);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  protected readonly activeType = signal<ProjectType>('collaboration');
  protected readonly email = signal('');
  protected readonly focusedField = signal<string | null>(null);
  protected readonly message = signal('');
  protected readonly name = signal('');
  /** The first name of whoever just wrote, to thank them by name. */
  protected readonly sentName = computed(() => this.name().trim().split(/\s+/)[0] ?? '');
  protected readonly status = signal<FormStatus>('idle');
  protected readonly touched = signal(false);
  /** A field people never see: only bots fill it in, and the server drops their messages. */
  protected readonly website = signal('');

  protected readonly maxEmailLength = MAX_EMAIL_LENGTH;
  protected readonly maxMessageLength = MAX_MESSAGE_LENGTH;
  protected readonly maxNameLength = MAX_NAME_LENGTH;

  protected readonly nameError = computed(() =>
    this.touched() && !this.name().trim() ? 'name' : null
  );

  protected readonly emailError = computed(() =>
    this.touched() && !EMAIL_RE.test(this.email()) ? 'email' : null
  );

  protected readonly messageError = computed(() =>
    this.touched() && !this.message().trim() ? 'message' : null
  );

  protected readonly isValid = computed(
    () => !this.nameError() && !this.emailError() && !this.messageError()
  );

  protected readonly links = [
    { href: 'mailto:fj@mail.rootdevs.es', label: 'EMAIL', value: 'fj@mail.rootdevs.es' },
    { href: 'https://github.com/anbreaker', label: 'GITHUB', value: 'github.com/anbreaker' },
    {
      href: 'https://www.linkedin.com/in/francisco-javier-antunez-duran/',
      label: 'LINKEDIN',
      value: 'linkedin.com/in/francisco-javier-antunez-duran',
    },
  ];

  protected readonly projectTypes: { i18nKey: string; key: ProjectType }[] = [
    { key: 'collaboration', i18nKey: 'contact.types.collaboration' },
    { key: 'consulting', i18nKey: 'contact.types.consulting' },
    { key: 'other', i18nKey: 'contact.types.other' },
  ];

  async handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    this.touched.set(true);

    if (!this.isValid() || this.status() === 'loading') return;

    this.status.set('loading');

    try {
      const res = await fetch('/api/contact', {
        body: JSON.stringify({
          email: this.email(),
          message: this.message(),
          name: this.name(),
          projectType: this.activeType(),
          website: this.website(),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      this.status.set(res.ok ? 'success' : 'error');
    } catch {
      this.status.set('error');
    }
  }

  onBlur(): void {
    this.focusedField.set(null);
  }

  onFocus(field: string): void {
    this.focusedField.set(field);
  }

  retry(): void {
    this.status.set('idle');
    this.touched.set(false);
  }

  /** Clears the form and brings it back, with the focus on the first field. */
  writeAnother(): void {
    this.name.set('');
    this.email.set('');
    this.message.set('');
    this.website.set('');
    this.activeType.set('collaboration');
    this.retry();

    afterNextRender(
      { write: () => this.nameInput()?.nativeElement.focus() },
      {
        injector: this.injector,
      }
    );
  }

  setType(type: ProjectType): void {
    this.activeType.set(type);
  }
}
