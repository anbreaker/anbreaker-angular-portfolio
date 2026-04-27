import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '@shared/directives/reveal.directive';

interface OrbitalTech {
  color: 'amber' | 'cyan' | 'emerald' | 'rose' | 'violet';
  iconSlug: string;
  id: string;
  lightIcon?: true;
  name: string;
}

interface OrbitalNode extends OrbitalTech {
  x: number;
  y: number;
}

interface OrbitalRing {
  animClass: string;
  nodes: OrbitalNode[];
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, TranslocoDirective],
  selector: 'app-tech-stack',
  styleUrl: './tech-stack.component.scss',
  templateUrl: './tech-stack.component.html',
})
export class TechStackComponent {
  private readonly tech: OrbitalTech[] = [
    // Core languages
    { color: 'cyan', iconSlug: 'typescript', id: 'ts', name: 'TypeScript' },
    { color: 'amber', iconSlug: 'javascript', id: 'js', name: 'JavaScript' },
    { color: 'amber', iconSlug: 'html5', id: 'html5', name: 'HTML5' },
    // Frameworks
    { color: 'rose', iconSlug: 'angular', id: 'angular', name: 'Angular' },
    { color: 'cyan', iconSlug: 'react', id: 'react', name: 'React' },
    { color: 'emerald', iconSlug: 'vuedotjs', id: 'vue', name: 'Vue' },
    { color: 'cyan', iconSlug: 'lit', id: 'lit', name: 'Lit' },
    { color: 'rose', iconSlug: '', id: 'signals', name: 'Signals' },
    // Backend / runtime
    { color: 'emerald', iconSlug: 'nodedotjs', id: 'node', name: 'Node.js' },
    { color: 'violet', iconSlug: 'express', id: 'express', lightIcon: true, name: 'Express' },
    // Tooling
    { color: 'rose', iconSlug: 'git', id: 'git', name: 'Git' },
    { color: 'emerald', iconSlug: 'gnubash', id: 'bash', name: 'Bash' },
    { color: 'amber', iconSlug: 'vitest', id: 'vitest', name: 'Vitest' },
    { color: 'cyan', iconSlug: 'githubactions', id: 'gha', name: 'GitHub Actions' },
    { color: 'cyan', iconSlug: 'css', id: 'css', name: 'CSS Nesting' },
    // Infra
    { color: 'violet', iconSlug: 'docker', id: 'docker', name: 'Docker' },
    { color: 'amber', iconSlug: 'linux', id: 'linux', name: 'Linux' },
    // AI
    { color: 'amber', iconSlug: 'anthropic', id: 'claude', lightIcon: true, name: 'Claude AI' },
    { color: 'violet', iconSlug: 'googlegemini', id: 'gemini', name: 'Gemini' },
    // Homelab
    { color: 'rose', iconSlug: 'raspberrypi', id: 'raspi', name: 'Raspberry Pi' },
    { color: 'amber', iconSlug: 'cloudflare', id: 'cf', name: 'Cloudflare' },
  ];

  private readonly ringDefs = [
    { animClass: 'r1', ids: ['ts', 'html5', 'angular', 'react', 'signals'], radius: 160 },
    { animClass: 'r2', ids: ['js', 'vue', 'lit', 'node', 'git', 'bash'], radius: 270 },
    {
      animClass: 'r3',
      ids: [
        'express',
        'vitest',
        'gha',
        'css',
        'docker',
        'linux',
        'claude',
        'gemini',
        'raspi',
        'cf',
      ],
      radius: 380,
    },
  ];

  protected readonly rings: OrbitalRing[] = this.ringDefs.map((ring, ringIdx) => ({
    animClass: ring.animClass,
    nodes: ring.ids.map((id, index) => {
      const techItem = this.tech.find((tech) => tech.id === id) ?? {
        color: 'cyan' as const,
        iconSlug: '',
        id,
        name: id,
      };

      const angle = (index / ring.ids.length) * Math.PI * 2 + ringIdx * (Math.PI / 6);

      return {
        ...techItem,
        x: Math.round(Math.cos(angle) * ring.radius),
        y: Math.round(Math.sin(angle) * ring.radius),
      };
    }),
  }));

  private readonly tickerA = this.tech.filter((t) =>
    ['ts', 'js', 'html5', 'angular', 'react', 'vue', 'signals', 'lit', 'git'].includes(t.id)
  );

  private readonly tickerB = this.tech.filter((t) =>
    [
      'node',
      'express',
      'bash',
      'vitest',
      'gha',
      'css',
      'docker',
      'linux',
      'claude',
      'gemini',
      'raspi',
      'cf',
    ].includes(t.id)
  );

  protected readonly tickerAItems: OrbitalTech[] = ([] as OrbitalTech[]).concat(
    this.tickerA,
    this.tickerA,
    this.tickerA,
    this.tickerA
  );

  protected readonly tickerBItems: OrbitalTech[] = ([] as OrbitalTech[]).concat(
    this.tickerB,
    this.tickerB,
    this.tickerB,
    this.tickerB
  );
}
