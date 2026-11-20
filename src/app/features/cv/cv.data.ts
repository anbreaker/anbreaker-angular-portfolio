import { CvData } from '@core/interfaces/portfolio.interfaces';

export const CV_DATA: CvData = {
  capabilities: [
    {
      description:
        'Componentes reutilizables, estado predecible y HTML semántico y accesible. He llevado a producción los cuatro grandes y Web Components.',
      isHighlighted: true,
      subtitle: 'el framework que pida el equipo',
      tags: [
        'TypeScript',
        'JavaScript',
        'Angular (Signals, zoneless)',
        'React (Zustand)',
        'Vue (Vuex, Pinia)',
        'Lit / Web Components',
        'Astro',
        'HTML5',
        'CSS3 / SCSS',
        'Tailwind CSS',
      ],
      title: 'Interfaces',
    },
    {
      description:
        'Arquitectura limpia y hexagonal, separación contenedor/presentación, microfrontends y diseño atómico.',
      subtitle: 'que aguante cambios',
      tags: ['Clean Architecture', 'Microfrontends', 'Atomic design', 'SOLID'],
      title: 'Arquitectura',
    },
    {
      description:
        'Primero el test que falla, luego el código. Linters propios y revisión de cada cambio antes de producción.',
      subtitle: 'tests primero',
      tags: ['Vitest', 'TDD', 'ESLint', 'Code review'],
      title: 'Calidad',
    },
    {
      description:
        'Carga diferida, SDKs fuera de las páginas públicas y Core Web Vitals revisados en cada entrega.',
      subtitle: 'medido, no supuesto',
      tags: ['Lighthouse', 'Core Web Vitals', 'Lazy loading'],
      title: 'Rendimiento',
    },
    {
      description:
        'APIs pequeñas, bases de datos, funciones serverless, CI y despliegue. Mantengo mi propio homelab.',
      subtitle: 'de punta a punta',
      tags: [
        'Node.js',
        'Express',
        'Firebase',
        'MongoDB',
        'PostgreSQL',
        'GitHub Actions',
        'Docker',
        'Vercel',
        'Cloudflare',
        'Linux',
        'Git',
      ],
      title: 'Producción',
    },
    {
      description:
        'Trabajo con el stack Gentle AI y Organic-Driven Development (ODD): requisitos por escrito, tests antes del código y verificación humana de cada cambio. Elijo el modelo según la tarea.',
      subtitle: 'con método',
      tags: [
        'Claude Code',
        'OpenAI',
        'Gemini',
        'Grok',
        'Servidores MCP',
        'Gentle AI',
        'Organic-Driven Development (ODD)',
        'Spec-Driven Development',
      ],
      title: 'IA aplicada',
    },
  ],
  contact: ['Badajoz, España · remoto', '+34 637 128 809', 'antunez19@gmail.com'],
  downloads: [
    { href: '/assets/cv/cv-francisco-javier-antunez.pdf', label: 'Descargar PDF' },
    { href: '/assets/cv/cv-francisco-javier-antunez-ats.pdf', label: 'Versión ATS' },
  ],
  education: [
    {
      detail: 'Universidad de Extremadura · en curso',
      title: 'Grado en Ingeniería de Telecomunicaciones (Telemática)',
    },
    { detail: 'KeepCoding', title: 'Bootcamp Full Stack Web Developer' },
  ],
  experience: [
    {
      bullets: [
        'Rol transversal: soporte a varios equipos, incidencias críticas y visión global del producto.',
        'Angular moderno con Signals y standalone components, TypeScript y testing con Vitest.',
        'Desarrollo asistido por IA con Claude Code y MCP siguiendo Spec-Driven Development.',
        'Arquitectura limpia, buenas prácticas y calidad de código.',
      ],
      clientAndLocation: 'Cliente: Vitaly (salud) · Remoto',
      commitLabel: 'feat(lead)',
      endDate: 'actualidad',
      role: 'Senior Frontend Developer · Sngular',
      startDate: '03/2026',
    },
    {
      bullets: ['Desarrollo frontend con Angular y TypeScript.'],
      clientAndLocation: 'Cliente: Vitaly (salud) · Remoto',
      commitLabel: 'feat',
      endDate: '02/2026',
      role: 'Frontend Developer · Sngular',
      startDate: '03/2025',
    },
    {
      bullets: [
        'Interfaces con Web Components (Lit), TypeScript y JavaScript.',
        'Componentes reutilizables integrados en las aplicaciones del banco.',
        'Equipos grandes junto a otras consultoras, con foco en código limpio y mantenible.',
      ],
      clientAndLocation: 'Cliente: BBVA (banca) · Remoto',
      commitLabel: 'feat(ui)',
      endDate: '02/2025',
      role: 'Frontend Developer · Sngular',
      startDate: '12/2022',
    },
    {
      bullets: [
        'Vue con Vuex y Pinia, APIs con Express (Node.js) y arquitectura de microfrontends.',
      ],
      clientAndLocation: 'Cliente: Navantia (naval) · Remoto',
      commitLabel: 'feat(arch)',
      endDate: '12/2022',
      role: 'Full Stack Developer · ViewNext',
      startDate: '12/2021',
    },
    {
      bullets: ['Vue y Vuex. Primer puesto como desarrollador tras el cambio desde la industria.'],
      clientAndLocation: 'Cliente: eléctrica de EE. UU. · Remoto',
      commitLabel: 'init',
      endDate: '12/2021',
      role: 'Junior Frontend Developer · Indra',
      startDate: '06/2021',
    },
    {
      bullets: [
        'PepsiCo · Operador de planta y electromecánico · 11/2015 – 06/2021',
        'Agraz · Controlador de planta industrial y responsable de grupo de trabajo · 06/2008 – 10/2015',
        'Telefónica (TalentumSchools) · Mentor en talleres de programación para niños · 11/2013 – 04/2014',
        'Wayra / Onfan food · Beca Talentum en sistemas y AWS · 11/2013 – 02/2014',
      ],
      commitLabel: 'build',
      endDate: '06/2021',
      handwrittenNote:
        'De la planta me traje una regla: diagnosticar con evidencia antes de tocar nada.',
      isBeforeSoftware: true,
      role: 'Antes del código: industria',
      startDate: '06/2008',
    },
  ],
  headlineMeta: 'Curriculum vitae · 5 años en frontend · 13 en industria',
  languages: [
    { detail: 'nativo', title: 'Español' },
    { detail: 'buena comprensión y expresión', title: 'Portugués' },
    { detail: 'lectura técnica', title: 'Inglés' },
  ],
  name: { family: 'Antúnez Durán', given: 'Francisco Javier' },
  portraitCaption: '13 años en planta antes del primer commit',
  profile:
    'Desarrollador frontend con más de cinco años en equipos de consultoría para salud, banca, naval y energía. He entregado producto con Angular, React, Vue y Lit, y me adapto al stack de cada equipo. Trabajo con tests primero, arquitectura limpia y medición de rendimiento. Uso agentes de IA (Claude Code, MCP) con método: requisitos por escrito, pruebas antes del código y revisión humana de cada cambio. Hoy tengo un rol transversal de soporte a varios equipos. Me gusta enseñar lo que sé y aprender de los demás.',
  profiles: [
    { displayText: 'github.com/anbreaker', href: 'https://github.com/anbreaker', label: 'GitHub' },
    {
      displayText: 'linkedin.com/in/francisco-javier-antunez-duran',
      href: 'https://www.linkedin.com/in/francisco-javier-antunez-duran/',
      label: 'LinkedIn',
    },
    { displayText: 'rootdevs.es', href: 'https://rootdevs.es', label: 'Web' },
  ],
  projects: [
    {
      description:
        'Web de un fotógrafo de Nueva York: galería pública en tres idiomas y panel privado para publicar series sin depender de nadie. Traducción automática, subida de fotos optimizada y formulario de contacto serverless.',
      isFeatured: true,
      kicker: 'Caso de estudio',
      links: [
        { href: 'https://framedbysanti.rootdevs.es', label: 'framedbysanti.rootdevs.es' },
        {
          href: 'https://github.com/anbreaker/framed-by-santi',
          label: 'github.com/anbreaker/framed-by-santi',
        },
        { href: 'https://rootdevs.es/blog/how-i-built-framed-by-santi', label: 'cómo lo hice' },
      ],
      stats: [
        { label: 'días hasta producción', value: '3' },
        { label: 'tests en nueve días', value: '857' },
        { label: 'en las 4 categorías de Lighthouse', value: '100' },
        { label: 'pull requests revisadas', value: '35' },
      ],
      tags: ['Angular', 'Signals', 'Firebase', 'Cloudinary', 'DeepL', 'Vercel', 'Vitest'],
      title: 'Framed by Santi',
    },
    {
      description:
        'E-commerce artesanal en producción con ventas reales. Arquitectura limpia por features, catálogo multilingüe y pagos con Stripe.',
      links: [
        {
          href: 'https://github.com/anbreaker/mimacrame-studio-2026',
          label: 'github.com/anbreaker/mimacrame-studio-2026',
        },
      ],
      tags: ['Angular', 'Firebase', 'Stripe', 'Transloco'],
      title: 'Mi Macramé Studio',
    },
    {
      description:
        'Mi portfolio y blog técnico sobre arquitectura, testing, rendimiento y desarrollo con IA. Zoneless, View Transitions y linter estricto.',
      links: [
        { href: 'https://rootdevs.es', label: 'rootdevs.es' },
        {
          href: 'https://github.com/anbreaker/anbreaker-angular-portfolio',
          label: 'github.com/anbreaker/anbreaker-angular-portfolio',
        },
      ],
      tags: ['Angular', 'View Transitions', 'SCSS'],
      title: 'rootdevs.es',
    },
  ],
  role: 'Senior Frontend Developer',
  testimonials: [
    {
      author: 'Fran Méndez',
      quote: 'Siempre dispuesto a compartir su conocimiento y elevar el nivel del equipo.',
      role: 'Creador de AsyncAPI',
    },
    {
      author: 'Barbaño González',
      quote:
        'Me ha estado enseñando a programar con mucha paciencia, introduciéndome al mundo del open source.',
      role: 'Education Program Manager en Postman',
    },
    {
      author: 'Joaquín Engelmo',
      quote: 'Aprende rápido y trabaja duro, siempre dispuesto a probar cosas nuevas sin miedo.',
      role: 'DevRel en Criteo',
    },
  ],
  thesis: {
    emphasis: 'El framework lo elige el problema.',
    intro: 'Construyo interfaces web rápidas, probadas y fáciles de mantener.',
    outro: 'El método no cambia.',
  },
  workStyle: [
    'Trabajo en equipo y soporte a varios equipos a la vez.',
    'Formar y aprender: mentor en TalentumSchools y divulgación en el blog.',
    'Incidencias críticas resueltas con diagnóstico basado en evidencia.',
  ],
};
