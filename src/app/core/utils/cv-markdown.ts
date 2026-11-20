import type { CvData, CvLink } from '../interfaces/portfolio.interfaces';

export const CV_MARKDOWN_PATH = 'cv.md';

export interface CvMarkdownOptions {
  cv: CvData;
  siteUrl: string;
}

/** Builds /cv.md, the plain-text CV for AI agents that cannot run the /cv page. */
export function buildCvMarkdown({ cv, siteUrl }: CvMarkdownOptions): string {
  const absolute = (href: string): string => (href.startsWith('/') ? `${siteUrl}${href}` : href);
  const link = ({ displayText, href, label }: CvLink): string =>
    `[${displayText ?? label}](${absolute(href)})`;
  const tagLine = (tags: string[]): string => `Tecnologías: ${tags.join(', ')}`;

  return [
    `# ${cv.name.given} ${cv.name.family}`,
    '',
    cv.role,
    '',
    cv.headlineMeta,
    '',
    `${cv.thesis.intro} **${cv.thesis.emphasis}** ${cv.thesis.outro}`,
    '',
    ...cv.contact.map((item) => `- ${item}`),
    ...cv.profiles.map((profile) => `- ${profile.label}: ${link(profile)}`),
    '',
    cv.downloads.map(link).join(' · '),
    '',
    '## Perfil',
    '',
    cv.profile,
    '',
    '## Trabajo público',
    '',
    ...cv.projects.flatMap((project) => [
      `### ${project.title}`,
      '',
      project.description,
      '',
      ...(project.stats
        ? [...project.stats.map((stat) => `- ${stat.value} ${stat.label}`), '']
        : []),
      tagLine(project.tags),
      '',
      `Enlaces: ${project.links.map(link).join(' · ')}`,
      '',
    ]),
    '## Qué hago',
    '',
    ...cv.capabilities.flatMap((capability) => [
      `### ${capability.title} (${capability.subtitle})`,
      '',
      capability.description,
      '',
      tagLine(capability.tags),
      '',
    ]),
    '## Experiencia',
    '',
    ...cv.experience.flatMap((job) => [
      `### ${job.role}`,
      '',
      [`${job.startDate} – ${job.endDate}`, job.clientAndLocation].filter(Boolean).join(' · '),
      '',
      ...job.bullets.map((bullet) => `- ${bullet}`),
      '',
      ...(job.handwrittenNote ? [`_${job.handwrittenNote}_`, ''] : []),
    ]),
    '## Lo que dicen',
    '',
    ...cv.testimonials.flatMap((voice) => [
      `> “${voice.quote}” — ${voice.author}, ${voice.role}`,
      '',
    ]),
    '## Formación',
    '',
    ...cv.education.map((item) => `- ${item.title}${item.detail ? ` · ${item.detail}` : ''}`),
    '',
    '## Idiomas',
    '',
    ...cv.languages.map((item) => `- ${item.title}${item.detail ? `: ${item.detail}` : ''}`),
    '',
    '## Cómo trabajo',
    '',
    ...cv.workStyle.map((item) => `- ${item}`),
    '',
  ].join('\n');
}
