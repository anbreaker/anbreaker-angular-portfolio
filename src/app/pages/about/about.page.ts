import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FooterComponent } from '@features/footer/footer.component';
import { NavComponent } from '@features/nav/nav.component';
import { SectionDividerComponent } from '@shared/components/section-divider/section-divider.component';
import { RevealDirective } from '@shared/directives/reveal.directive';

type TabId = 'sw' | 'in' | 'ti';

interface Stat {
  accentClass: string;
  key: string;
  numClass: string;
  suffix: string;
  to: number;
}

interface TabPanel {
  descKey: string;
  id: TabId;
  indexClass: string;
  indexNum: string;
  items: { accent: string; name: string; tag: string }[];
  promptKey: string;
  promptPath: string;
  sym: string;
  tabKey: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FooterComponent,
    NavComponent,
    RevealDirective,
    SectionDividerComponent,
    TranslocoDirective,
    UpperCasePipe,
  ],
  selector: 'app-about-me-page',
  styleUrl: './about.page.scss',
  templateUrl: './about.page.html',
})
export class AboutMePageComponent implements OnDestroy {
  private readonly portraitWrapRef = viewChild<ElementRef<HTMLElement>>('portraitWrap');
  private readonly sectionEndRef = viewChild<ElementRef<HTMLElement>>('sectionEnd');
  private readonly statsElRef = viewChild<ElementRef<HTMLElement>>('statsEl');
  private readonly tabBarRef = viewChild<ElementRef<HTMLElement>>('tabBar');
  private readonly tabIndicatorRef = viewChild<ElementRef<HTMLElement>>('tabIndicator');

  protected readonly activeTab = signal<TabId>('sw');
  protected readonly displayValues = signal<number[]>([5, 180, 3, 80]);
  protected readonly showFloatingPortrait = signal(false);

  protected readonly stats: Stat[] = [
    { key: 'years', to: 10, suffix: '+', accentClass: 'cy', numClass: 'stat-num-years' },
    { key: 'repos', to: 180, suffix: '+', accentClass: 'ro', numClass: 'stat-num-repos' },
    { key: 'domains', to: 3, suffix: '·', accentClass: 'cy', numClass: 'stat-num-domains' },
    { key: 'autonomy', to: 100, suffix: '%', accentClass: 'em', numClass: 'stat-num-autonomy' },
  ];

  protected readonly facts = [
    { hasNote: true, key: 'base' },
    { hasNote: true, key: 'role' },
    { hasNote: true, key: 'since' },
    { hasNote: true, key: 'founder' },
    { hasEm: true, hasNote: false, key: 'loves' },
  ];

  protected readonly panels: TabPanel[] = [
    {
      descKey: 'about.domainSw.desc',
      id: 'sw',
      indexClass: 'cy',
      indexNum: '01.',
      items: [
        { accent: 'cy', name: 'Angular 21', tag: 'FRAMEWORK' },
        { accent: 'cy', name: 'JavaScript · TypeScript', tag: 'LANGUAGE' },
        { accent: '', name: 'Vue 3', tag: 'FRAMEWORK' },
        { accent: '', name: 'React', tag: 'LIBRARY' },
        { accent: '', name: 'Lit', tag: 'LIBRARY' },
        { accent: 'cy', name: 'Node.js · Express', tag: 'BACKEND' },
      ],
      promptKey: 'about.domainSw.prompt',
      promptPath: '~/software',
      sym: '</>',
      tabKey: 'about.domainSw.tab',
    },
    {
      descKey: 'about.domainIn.desc',
      id: 'in',
      indexClass: 'ro',
      indexNum: '02.',
      items: [
        { accent: 'ro', name: 'Linux · Arch', tag: 'OS' },
        { accent: 'ro', name: 'Raspberry Pi cluster', tag: 'HARDWARE' },
        { accent: '', name: 'Docker + Compose', tag: 'CONTAINERS' },
        { accent: '', name: 'Home Assistant', tag: 'IOT' },
        { accent: 'ro', name: 'Claude · MCP agents', tag: 'AI' },
      ],
      promptKey: 'about.domainIn.prompt',
      promptPath: '~/infra',
      sym: '>_',
      tabKey: 'about.domainIn.tab',
    },
    {
      descKey: 'about.domainTi.desc',
      id: 'ti',
      indexClass: 'em',
      indexNum: '03.',
      items: [
        { accent: 'em', name: 'Viñedo', tag: 'CULTIVO' },
        { accent: 'em', name: 'Naranjos', tag: 'CULTIVO' },
        { accent: 'em', name: 'Olivos', tag: 'CULTIVO' },
        { accent: '', name: 'Permacultura', tag: 'MÉTODO' },
        { accent: 'em', name: 'Suelo vivo', tag: 'PRINCIPIO' },
      ],
      promptKey: 'about.domainTi.prompt',
      promptPath: '~/tierra',
      sym: '~/',
      tabKey: 'about.domainTi.tab',
    },
  ];

  private readonly onResize = (): void => this.updateIndicator();
  private setupComplete = false;

  constructor() {
    effect(() => {
      const bar = this.tabBarRef();
      const indicator = this.tabIndicatorRef();
      const statsEl = this.statsElRef();
      const portraitWrap = this.portraitWrapRef();
      const sectionEnd = this.sectionEndRef();

      if (!bar || !indicator || !statsEl || !portraitWrap || !sectionEnd) return;
      if (this.setupComplete) return;
      this.setupComplete = true;

      untracked(() => {
        this.updateIndicator();
        this.setupStatsObserver();
        this.setupPortraitObserver();
        window.addEventListener('resize', this.onResize);
      });
    });
  }

  private portraitInView = true;
  private portraitObserver: IntersectionObserver | null = null;
  private sectionInView = true;
  private sectionObserver: IntersectionObserver | null = null;
  private statsAnimated = false;
  private statsObserver: IntersectionObserver | null = null;

  ngOnDestroy(): void {
    this.portraitObserver?.disconnect();
    this.sectionObserver?.disconnect();
    this.statsObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
  }

  protected setTab(id: TabId): void {
    this.activeTab.set(id);
    requestAnimationFrame(() => this.updateIndicator());
  }

  private updateIndicator(): void {
    const bar = this.tabBarRef()?.nativeElement;
    const indicator = this.tabIndicatorRef()?.nativeElement;
    if (!bar || !indicator) return;
    const btn = bar.querySelector<HTMLElement>(`[data-id="${this.activeTab()}"]`);
    if (!btn) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    indicator.style.left = `${btnRect.left - barRect.left}px`;
    indicator.style.width = `${btnRect.width}px`;
  }

  private setupStatsObserver(): void {
    const el = this.statsElRef()?.nativeElement;
    if (!el) return;
    this.statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateCounters();
          this.statsObserver?.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    this.statsObserver.observe(el);
  }

  private setupPortraitObserver(): void {
    const portrait = this.portraitWrapRef()?.nativeElement;
    const sentinel = this.sectionEndRef()?.nativeElement;

    if (portrait) {
      this.portraitObserver = new IntersectionObserver(([entry]) => {
        this.portraitInView = entry.isIntersecting;
        this.updateFloatingPortrait();
      });
      this.portraitObserver.observe(portrait);
    }

    if (sentinel) {
      this.sectionObserver = new IntersectionObserver(([entry]) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        this.sectionInView = !scrolledPast;
        this.updateFloatingPortrait();
      });
      this.sectionObserver.observe(sentinel);
    }
  }

  private updateFloatingPortrait(): void {
    this.showFloatingPortrait.set(!this.portraitInView && this.sectionInView);
  }

  private animateCounters(): void {
    const targets = this.stats.map((s) => s.to);
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      this.displayValues.set(targets.map((to) => Math.round(to * eased)));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        this.displayValues.set(targets);
      }
    };
    requestAnimationFrame(tick);
  }
}
