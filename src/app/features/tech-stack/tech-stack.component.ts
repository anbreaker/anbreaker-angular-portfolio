import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { RevealDirective } from '@shared/directives/reveal.directive';

type TechColor = 'amber' | 'cyan' | 'emerald' | 'rose' | 'violet';

interface OrbitalTech {
  color: TechColor;
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
  private readonly techDictionary: Record<string, OrbitalTech> = {
    // Core languages
    ts: { color: 'cyan', iconSlug: 'typescript', id: 'ts', name: 'TypeScript' },
    js: { color: 'amber', iconSlug: 'javascript', id: 'js', name: 'JavaScript' },
    html5: { color: 'amber', iconSlug: 'html5', id: 'html5', name: 'HTML5' },
    // Frameworks
    angular: { color: 'rose', iconSlug: 'angular', id: 'angular', name: 'Angular' },
    react: { color: 'cyan', iconSlug: 'react', id: 'react', name: 'React' },
    vue: { color: 'emerald', iconSlug: 'vuedotjs', id: 'vue', name: 'Vue' },
    lit: { color: 'cyan', iconSlug: 'lit', id: 'lit', name: 'Lit' },
    astro: { color: 'rose', iconSlug: 'astro', id: 'astro', name: 'Astro' },
    signals: { color: 'rose', iconSlug: '', id: 'signals', name: 'Signals' },
    // Backend / runtime
    node: { color: 'emerald', iconSlug: 'nodedotjs', id: 'node', name: 'Node.js' },
    express: {
      color: 'violet',
      iconSlug: 'express',
      id: 'express',
      lightIcon: true,
      name: 'Express',
    },
    mongo: { color: 'emerald', iconSlug: 'mongodb', id: 'mongo', name: 'MongoDB' },
    postgres: { color: 'cyan', iconSlug: 'postgresql', id: 'postgres', name: 'PostgreSQL' },
    firebase: { color: 'amber', iconSlug: 'firebase', id: 'firebase', name: 'Firebase' },
    // Tooling
    git: { color: 'rose', iconSlug: 'git', id: 'git', name: 'Git' },
    bash: { color: 'emerald', iconSlug: 'gnubash', id: 'bash', name: 'Bash' },
    vitest: { color: 'amber', iconSlug: 'vitest', id: 'vitest', name: 'Vitest' },
    gha: { color: 'cyan', iconSlug: 'githubactions', id: 'gha', name: 'GitHub Actions' },
    css: { color: 'cyan', iconSlug: 'css', id: 'css', name: 'CSS Nesting' },
    tailwind: { color: 'cyan', iconSlug: 'tailwindcss', id: 'tailwind', name: 'Tailwind CSS' },
    // Infra
    docker: { color: 'violet', iconSlug: 'docker', id: 'docker', name: 'Docker' },
    linux: { color: 'amber', iconSlug: 'linux', id: 'linux', name: 'Linux' },
    // AI
    claude: {
      color: 'amber',
      iconSlug: 'anthropic',
      id: 'claude',
      lightIcon: true,
      name: 'Claude AI',
    },
    gemini: { color: 'violet', iconSlug: 'googlegemini', id: 'gemini', name: 'Gemini' },
    // Homelab
    raspi: { color: 'rose', iconSlug: 'raspberrypi', id: 'raspi', name: 'Raspberry Pi' },
    cf: { color: 'amber', iconSlug: 'cloudflare', id: 'cf', name: 'Cloudflare' },
  };

  private readonly orbitalRingDefinitions = [
    { animClass: 'r1', ids: ['ts', 'html5', 'angular', 'react', 'vue', 'signals'], radius: 160 },
    {
      animClass: 'r2',
      ids: ['js', 'lit', 'astro', 'tailwind', 'node', 'git', 'bash', 'css'],
      radius: 270,
    },
    {
      animClass: 'r3',
      ids: [
        'express',
        'mongo',
        'postgres',
        'firebase',
        'vitest',
        'gha',
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

  protected readonly rings: OrbitalRing[] = this.orbitalRingDefinitions.map(
    (ringDefinition, ringIndex) => ({
      animClass: ringDefinition.animClass,
      nodes: ringDefinition.ids.map((techId, nodeIndex) => {
        const techDetail = this.techDictionary[techId] ?? {
          color: 'cyan' as const,
          iconSlug: '',
          id: techId,
          name: techId,
        };

        const angleRadians =
          (nodeIndex / ringDefinition.ids.length) * Math.PI * 2 + ringIndex * (Math.PI / 6);

        return {
          ...techDetail,
          x: Math.round(Math.cos(angleRadians) * ringDefinition.radius),
          y: Math.round(Math.sin(angleRadians) * ringDefinition.radius),
        };
      }),
    })
  );

  private readonly topMarqueeIds = [
    'ts',
    'js',
    'html5',
    'angular',
    'react',
    'vue',
    'signals',
    'lit',
    'astro',
    'tailwind',
    'git',
  ];

  private readonly bottomMarqueeIds = [
    'node',
    'express',
    'mongo',
    'postgres',
    'firebase',
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
  ];

  private readonly topMarqueeUniqueItems = this.topMarqueeIds
    .map((techId) => this.techDictionary[techId])
    .filter(Boolean);

  private readonly bottomMarqueeUniqueItems = this.bottomMarqueeIds
    .map((techId) => this.techDictionary[techId])
    .filter(Boolean);

  protected readonly tickerAItems: OrbitalTech[] = ([] as OrbitalTech[]).concat(
    this.topMarqueeUniqueItems,
    this.topMarqueeUniqueItems,
    this.topMarqueeUniqueItems,
    this.topMarqueeUniqueItems
  );

  protected readonly tickerBItems: OrbitalTech[] = ([] as OrbitalTech[]).concat(
    this.bottomMarqueeUniqueItems,
    this.bottomMarqueeUniqueItems,
    this.bottomMarqueeUniqueItems,
    this.bottomMarqueeUniqueItems
  );
}
