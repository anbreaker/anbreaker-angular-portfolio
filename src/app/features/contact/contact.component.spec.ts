import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { ContactComponent } from './contact.component';

const es = {
  'contact.form.sendAnother': 'Escribir otro mensaje',
  'contact.form.successMsg': 'Gracias por escribirme, {{ name }}.',
  'contact.form.successTitle': 'Mensaje recibido.',
};

const render = async () => {
  await TestBed.configureTestingModule({
    imports: [
      ContactComponent,
      TranslocoTestingModule.forRoot({
        langs: { es },
        preloadLangs: true,
        translocoConfig: { availableLangs: ['es'], defaultLang: 'es' },
      }),
    ],
    providers: [provideRouter([]), provideZonelessChangeDetection()],
  }).compileComponents();

  const fixture = TestBed.createComponent(ContactComponent);
  await fixture.whenStable();

  return fixture;
};

const query = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const type = (root: HTMLElement, selector: string, value: string): void => {
  const field = query<HTMLInputElement | HTMLTextAreaElement>(root, selector);
  field.value = value;
  field.dispatchEvent(new Event('input'));
};

const sendMessage = async (fixture: Awaited<ReturnType<typeof render>>): Promise<HTMLElement> => {
  const root = fixture.nativeElement as HTMLElement;
  type(root, '#contact-name', 'Ana García');
  type(root, '#contact-email', 'ana@example.com');
  type(root, '#contact-msg', 'Hola');
  query(root, 'form').dispatchEvent(new Event('submit'));
  await vi.waitFor(() => expect(root.querySelector('.contact__sent')).not.toBeNull());
  await fixture.whenStable();

  return root;
};

describe('ContactComponent sent notice', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"ok":true}')));
    // jsdom has no IntersectionObserver or matchMedia; the reveal and magnetic directives only need them to exist.
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        disconnect = vi.fn();
        observe = vi.fn();
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('thanks the visitor by first name and announces it', async () => {
    const root = await sendMessage(await render());
    const notice = query(root, '.contact__sent');

    expect(notice.getAttribute('role')).toBe('status');
    expect(notice.textContent).toContain('Mensaje recibido.');
    expect(notice.textContent).toContain('Gracias por escribirme, Ana.');
  });

  it('brings back an empty form focused on the name to write another message', async () => {
    const fixture = await render();
    const root = await sendMessage(fixture);

    query<HTMLButtonElement>(root, '.contact__sent-again').click();
    await fixture.whenStable();

    const name = query<HTMLInputElement>(root, '#contact-name');
    expect(root.querySelector('.contact__sent')).toBeNull();
    expect(name.value).toBe('');
    expect(query<HTMLTextAreaElement>(root, '#contact-msg').value).toBe('');
    expect(root.querySelectorAll('.contact__field-error')).toHaveLength(0);
    expect(document.activeElement).toBe(name);
  });
});
