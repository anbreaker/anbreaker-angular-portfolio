import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { MagneticButtonDirective } from '@shared/directives/magnetic-button.directive';
import { RevealDirective } from '@shared/directives/reveal.directive';

type ProjectType = 'collaboration' | 'consulting' | 'other';
type FormStatus = 'error' | 'idle' | 'loading' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticButtonDirective, RevealDirective, TranslocoDirective],
  selector: 'app-contact',
  styleUrl: './contact.component.scss',
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  protected readonly activeType = signal<ProjectType>('collaboration');
  protected readonly email = signal('');
  protected readonly focusedField = signal<string | null>(null);
  protected readonly message = signal('');
  protected readonly name = signal('');
  protected readonly status = signal<FormStatus>('idle');
  protected readonly touched = signal(false);

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
    { href: 'mailto:hi@rootdevs.es', label: 'EMAIL', value: 'hi@rootdevs.es' },
    { href: 'https://github.com/anbreaker', label: 'GITHUB', value: 'github.com/anbreaker' },
    {
      href: 'https://www.linkedin.com/in/francisco-javier-antunez-duran/',
      label: 'LINKEDIN',
      value: 'linkedin.com/in/anbreaker',
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

  setType(type: ProjectType): void {
    this.activeType.set(type);
  }
}
