# FJ Portfolio — Creative Technologist & FullStack Master

Personal portfolio of **Francisco Javier (rootdevs)** — built with Angular 21, Signals, and modern web standards.

## Tech Stack

- **Angular 21** — standalone components, zoneless change detection, signals
- **TypeScript** — strict mode, self-documenting code
- **CSS Nesting** — native CSS nesting, no frameworks
- **Transloco** — i18n in 3 languages (ES · EN · PT)
- **Vitest** — unit testing

## Development

```bash
# Install dependencies
npm install

# Start dev server (Angular CLI)
npm run dev

# Start dev server (Vite — faster HMR)
npm run dev:vite

# Run tests
npm run test

# Lint
npm run lint

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── core/           # Interfaces, stores, services, interceptors
│   ├── features/       # Section components (nav, hero, tech-stack, projects, testimonials, footer)
│   ├── pages/          # Page-level components (home)
│   └── shared/         # Reusable UI components (neon-card, glass-card, badge, section-divider)
├── assets/i18n/        # Translation files (es.json, en.json, pt.json)
└── styles/
    └── base/           # Design tokens, typography, effects, reset
```

## Code Conventions

- All code written in **English** (variables, functions, classes, comments)
- **Self-documenting code** — no comments explaining "what", only "why" when non-obvious
- **Descriptive lambda parameters** — `projects.filter(project => project.featured)` not `(p) =>`
- **Clean code** — small functions, single responsibility, meaningful names
- **Mobile-first CSS** — base styles for mobile, scale up with `min-width` media queries

## Branch Strategy

This project follows **Gitflow**:

```sh
main       ← production
develop    ← integration
feature/*  ← new features (from develop)
release/*  ← release preparation
hotfix/*   ← urgent production fixes
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```sh
feat(hero): add hero section with i18n support
fix(nav): correct language selector active state
chore(deps): install transloco, remove ngx-translate
```

---

# FJ Portfolio — Creative Technologist & FullStack Master

Portfolio personal de **Francisco Javier (rootdevs)** — construido con Angular 21, Signals y estándares web modernos.

## Stack Tecnológico

- **Angular 21** — componentes standalone, change detection zoneless, signals
- **TypeScript** — modo strict, código autodocumentado
- **CSS Nesting** — CSS nativo con nesting, sin frameworks
- **Transloco** — i18n en 3 idiomas (ES · EN · PT)
- **Vitest** — tests unitarios

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (Angular CLI)
npm run dev

# Servidor de desarrollo (Vite — HMR más rápido)
npm run dev:vite

# Ejecutar tests
npm run test

# Lint
npm run lint

# Build de producción
npm run build
```

## Estructura del Proyecto

```sh
src/
├── app/
│   ├── core/           # Interfaces, stores, servicios, interceptores
│   ├── features/       # Componentes de sección (nav, hero, tech-stack, projects, testimonials, footer)
│   ├── pages/          # Componentes de página (home)
│   └── shared/         # Componentes UI reutilizables (neon-card, glass-card, badge, section-divider)
├── assets/i18n/        # Archivos de traducción (es.json, en.json, pt.json)
└── styles/
    └── base/           # Tokens de diseño, tipografía, efectos, reset
```

## Convenciones de Código

- Todo el código en **inglés** (variables, funciones, clases, comentarios)
- **Código autodocumentado** — sin comentarios que expliquen el "qué", solo el "por qué" cuando no sea obvio
- **Parámetros descriptivos en lambdas** — `projects.filter(project => project.featured)` nunca `(p) =>`
- **Clean code** — funciones pequeñas, responsabilidad única, nombres significativos
- **CSS mobile-first** — estilos base para móvil, escalar hacia arriba con `min-width`

## Estrategia de Ramas

Este proyecto sigue **Gitflow**:

```sh
main       ← producción
develop    ← integración
feature/*  ← nuevas features (desde develop)
release/*  ← preparación de releases
hotfix/*   ← fixes urgentes de producción
```

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/).
