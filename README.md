# 🚀 FJ Portfolio

<p align="center">
  <b>Angular 21 · Signals · SCSS · Vite · Modern Architecture</b><br/>
  <i>High-performance personal portfolio with a modern frontend stack</i>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-red?logo=angular" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-8-purple?logo=vite" />
  <img src="https://img.shields.io/badge/SCSS-Architecture-pink?logo=sass" />
  <img src="https://img.shields.io/badge/Signals-First-green" />
  <img src="https://img.shields.io/badge/i18n-ES%20%7C%20EN%20%7C%20PT-orange" />
</p>

---

Personal portfolio for Francisco Javier (rootdevs), built with Angular 21 and a modern frontend stack: standalone components, Signals, zoneless change detection, modular SCSS, Vite, Transloco-based i18n, and Markdown-driven blog content.

## 🇬🇧 English

### 🧭 Overview

- Angular 21 with standalone components, `OnPush`, and `provideZonelessChangeDetection()`.
- SCSS is the official styling convention. Native CSS is no longer the primary strategy.
- Vite powers both local development and production builds.
- Internationalization is available in ES, EN, and PT and loaded from `assets/i18n`.
- Technical blog posts are rendered from Markdown using `marked`, `marked-highlight`, and `highlight.js`.
- The contact form uses a Vercel serverless function with Resend.
- The project enforces strict linting, custom Angular rules, and automated formatting.

### 🧱 Current stack

- Angular 21
- TypeScript 5.9 in strict mode
- SCSS with `@use`, `includePaths`, and design tokens
- Vite 8 + `@analogjs/vite-plugin-angular`
- Transloco
- Vitest + JSDOM
- ESLint 10 + `angular-eslint` + project-specific custom rules
- Prettier 3 + plugins for CSS and JSON ordering
- Vercel Functions + Resend

### 🔄 What changed

The previous README still documented a native CSS nesting approach. That no longer reflects the repository.

The current project uses SCSS consistently:

- `angular.json` sets `inlineStyleLanguage: "scss"`.
- Angular schematics generate components with `style: "scss"`.
- Global styles are loaded from `src/styles/styles.scss`.
- Styling is organized into `base`, `components`, and `mixins`.
- `@use` is the standard import mechanism for style layers.

### 🏗️ Architecture

#### 🖥️ Frontend

- Bootstrapped with `bootstrapApplication()`.
- Centralized `ApplicationConfig` in `src/app/app.config.ts`.
- Router-based lazy loading per page.
- `withInMemoryScrolling()` and `withViewTransitions()` enabled.
- HTTP client configured with interceptors.
- Translation files loaded from `/assets/i18n/*.json`.

#### ⚡ State and reactivity

- Signals are the default mechanism for local state.
- `computed()` is used for derived state.
- `toSignal()` is used for targeted bridging from observable flows.
- RxJS is not the default solution; it is used only when interoperability justifies it.

#### 📄 Content and pages

- Home, About, Blog, Blog Detail, Contact, and Project Detail load as independent pages.
- Blog content is served from Markdown files in `public/assets/blog/<lang>`.
- Article rendering supports syntax highlighting and language fallback.

#### ☁️ Lightweight backend

- `api/contact.ts` exposes the serverless handler for the contact form.
- Email delivery is handled through Resend.
- Vercel rewrites `/api/*` and serves the SPA for the rest.

### 📁 Relevant structure

```sh
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── pages/
│   └── shared/
├── environments/
├── styles/
│   ├── base/
│   ├── components/
│   └── mixins/
└── types/
public/
├── assets/
│   ├── blog/
│   ├── i18n/
│   └── images/
└── favicon.ico
api/
└── contact.ts
```

### 🧠 Project best practices

- All code and comments are written in English.
- Every component is standalone and uses `ChangeDetectionStrategy.OnPush`.
- Signals are preferred over scattered mutable state or manual subscriptions.
- Pages are lazy loaded to reduce the initial cost.
- Styling is organized with modular SCSS, not ad hoc style files.
- Visual tokens live in the global styles layer rather than being duplicated per component.
- `any` is avoided; ESLint treats it as an error outside tests.
- Imports, JSON keys, and object keys are sorted to keep diffs predictable.
- Custom ESLint rules enforce consistency in decorators, signal placement, and imports.
- For high-frequency events, the convention is to avoid `@HostListener` and prefer `host` bindings or reactive bridges such as `fromEvent + toSignal`.
- The codebase favors self-documenting code: clear names, small functions, and comments only when they explain intent or a real constraint.

### 📜 Scripts

```bash
# Install dependencies
npm install

# Local development
npm run dev
npm start

# Local development with mock API + frontend
npm run dev:api

# Tests
npm run test
npm run test:watch
npm run test:ui

# Quality
npm run lint
npm run lint:fix
npm run format

# Build and preview
npm run build
npm run preview
```

### ⚙️ Environment requirements

- Node.js `>= 22.19.0`
- npm `>= 10.9.3`

### ⚙️ Environment variables

Create a `.env` file based on `.env.example`:

```bash
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=your-email
```

These variables are required for `api/contact.ts` to send emails.

### 🧪 Testing and quality

- Vitest runs in a `jsdom` environment.
- Tests use `src/test-setup.ts` as shared bootstrap.
- ESLint validates TypeScript, Angular HTML templates, and JSON files.
- Prettier automatically sorts CSS declarations and JSON keys.
- Additional consistency rules live in `.eslint/rules/`.

### 🌍 i18n and assets

- Translations live in `public/assets/i18n` and are served as `/assets/i18n/*.json`.
- Blog articles are split by language under `public/assets/blog`.
- If translations return 404, the first place to inspect is the `assets` configuration in `angular.json`.

### 🧾 Commit convention

The project uses Conventional Commits with this format:

```sh
<type>(<scope>): <description>
```

Allowed types:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `perf`
- `ci`
- `build`
- `revert`

Examples:

```sh
feat(blog): add markdown article loader
fix(contact): validate invalid email payload
docs(readme): document scss architecture and tooling
```

### 🌿 Branching

The repository follows Gitflow:

```sh
main       <- production
develop    <- integration
feature/*  <- new features
release/*  <- release preparation
hotfix/*   <- urgent fixes
```

### 📝 Operational note

Even though the workspace still contains Angular CLI configuration for schematics and targets, the day-to-day development and production build flow for this portfolio runs on top of Vite.

---

## 🇪🇸 Español

### 🧭 Resumen

- Angular 21 con standalone components, `OnPush` y `provideZonelessChangeDetection()`.
- SCSS es la convención oficial de estilos. CSS nativo ya no es la estrategia principal.
- Vite impulsa tanto el desarrollo local como el build de producción.
- La internacionalización está disponible en ES, EN y PT y se carga desde `assets/i18n`.
- El blog técnico se renderiza desde Markdown usando `marked`, `marked-highlight` y `highlight.js`.
- El formulario de contacto usa una función serverless en Vercel con Resend.
- El proyecto aplica linting estricto, reglas custom de Angular y formateo automatizado.

### 🧱 Stack actual

- Angular 21
- TypeScript 5.9 en modo estricto
- SCSS con `@use`, `includePaths` y design tokens
- Vite 8 + `@analogjs/vite-plugin-angular`
- Transloco
- Vitest + JSDOM
- ESLint 10 + `angular-eslint` + reglas custom del proyecto
- Prettier 3 + plugins para ordenar CSS y JSON
- Vercel Functions + Resend

### 🔄 Que cambio

El README anterior seguía documentando una estrategia basada en CSS nativo con nesting. Eso ya no representa el estado real del repositorio.

Hoy el proyecto usa SCSS de forma consistente:

- `angular.json` define `inlineStyleLanguage: "scss"`.
- Los schematics de Angular generan componentes con `style: "scss"`.
- Los estilos globales se cargan desde `src/styles/styles.scss`.
- La arquitectura de estilos se organiza en `base`, `components` y `mixins`.
- `@use` es el mecanismo estándar para importar capas de estilos.

### 🏗️ Arquitectura

#### 🖥️ Frontend

- Bootstrap con `bootstrapApplication()`.
- `ApplicationConfig` centralizado en `src/app/app.config.ts`.
- Lazy loading por página mediante el router.
- `withInMemoryScrolling()` y `withViewTransitions()` activados.
- HTTP client configurado con interceptores.
- Traducciones cargadas desde `/assets/i18n/*.json`.

#### ⚡ Estado y reactividad

- Signals es el mecanismo por defecto para estado local.
- `computed()` se usa para estado derivado.
- `toSignal()` se usa como puente puntual desde flujos observables.
- RxJS no es la solución por defecto; sólo se usa cuando la interoperabilidad realmente lo justifica.

#### 📄 Contenido y paginas

- Home, About, Blog, Blog Detail, Contact y Project Detail cargan como páginas independientes.
- El contenido del blog se sirve desde archivos Markdown en `public/assets/blog/<lang>`.
- El renderizado de artículos soporta syntax highlighting y fallback de idioma.

#### ☁️ Backend liviano

- `api/contact.ts` expone el handler serverless del formulario de contacto.
- El envio de correos se resuelve con Resend.
- Vercel reescribe `/api/*` y sirve la SPA para el resto.

### 📁 Estructura relevante

```sh
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── pages/
│   └── shared/
├── environments/
├── styles/
│   ├── base/
│   ├── components/
│   └── mixins/
└── types/
public/
├── assets/
│   ├── blog/
│   ├── i18n/
│   └── images/
└── favicon.ico
api/
└── contact.ts
```

### 🧠 Buenas practicas del proyecto

- Todo el codigo y los comentarios se escriben en ingles.
- Cada componente es standalone y usa `ChangeDetectionStrategy.OnPush`.
- Preferimos Signals antes que estado mutable disperso o suscripciones manuales.
- Las paginas se cargan con lazy loading para reducir el costo inicial.
- El styling se organiza con SCSS modular, no con hojas de estilo ad hoc.
- Los tokens visuales viven en la capa global de estilos y no duplicados por componente.
- Evitamos `any`; ESLint lo trata como error fuera de tests.
- Ordenamos imports, claves JSON y claves de objetos para mantener diffs predecibles.
- Las reglas custom de ESLint fuerzan consistencia en decoradores, posicion de signals e imports.
- Para eventos de alta frecuencia, la convención es evitar `@HostListener` y preferir `host` o puentes reactivos como `fromEvent + toSignal`.
- El codebase favorece codigo autodocumentado: nombres claros, funciones pequeñas y comentarios solo cuando explican una intencion o restriccion real.

### 📜 Scripts

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev
npm start

# Desarrollo local con API mock + frontend
npm run dev:api

# Tests
npm run test
npm run test:watch
npm run test:ui

# Calidad
npm run lint
npm run lint:fix
npm run format

# Build y preview
npm run build
npm run preview
```

### ⚙️ Requisitos de entorno

- Node.js `>= 22.19.0`
- npm `>= 10.9.3`

### ⚙️ Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```bash
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=your-email
```

Estas variables son necesarias para que `api/contact.ts` pueda enviar correos.

### 🧪 Testing y calidad

- Vitest corre en entorno `jsdom`.
- Los tests usan `src/test-setup.ts` como bootstrap compartido.
- ESLint valida TypeScript, templates HTML de Angular y archivos JSON.
- Prettier ordena automaticamente declaraciones CSS y claves JSON.
- Las reglas adicionales de consistencia viven en `.eslint/rules/`.

### 🌍 i18n y assets

- Las traducciones viven en `public/assets/i18n` y se sirven como `/assets/i18n/*.json`.
- Los articulos del blog se separan por idioma dentro de `public/assets/blog`.
- Si las traducciones devuelven 404, el primer lugar a revisar es la configuracion de `assets` en `angular.json`.

### 🧾 Convencion de commits

El proyecto usa Conventional Commits con este formato:

```sh
<type>(<scope>): <description>
```

Tipos permitidos:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `perf`
- `ci`
- `build`
- `revert`

Ejemplos:

```sh
feat(blog): add markdown article loader
fix(contact): validate invalid email payload
docs(readme): document scss architecture and tooling
```

### 🌿 Branching

El repositorio sigue Gitflow:

```sh
main       <- produccion
develop    <- integracion
feature/*  <- nuevas features
release/*  <- preparacion de releases
hotfix/*   <- fixes urgentes
```

### 📝 Nota operativa

Aunque el workspace conserva configuracion de Angular CLI para schematics y targets, el flujo diario de desarrollo y el build de produccion del portfolio corren sobre Vite.

---

````markdown
## 🇵🇹 Português

### 🧭 Resumo

- Angular 21 com componentes _standalone_, `OnPush` e `provideZonelessChangeDetection()`.
- SCSS e a convenção oficial de estilos. CSS nativo já não é a estratégia principal.
- Vite conduz tanto o desenvolvimento local quanto o _build_ de produção.
- A internacionalização está disponível em ES, EN e PT e é carregada a partir de `assets/i18n`.
- O _blog_ técnico é renderizado a partir de Markdown usando `marked`, `marked-highlight` e `highlight.js`.
- O formulário de contacto usa uma função _serverless_ na Vercel com Resend.
- O projeto aplica _linting_ rigoroso, regras personalizadas de Angular e formatação automática.

### 🧱 _Stack_ atual

- Angular 21
- TypeScript 5.9 em modo rigoroso
- SCSS com `@use`, `includePaths` e _design tokens_
- Vite 8 + `@analogjs/vite-plugin-angular`
- Transloco
- Vitest + JSDOM
- ESLint 10 + `angular-eslint` + regras personalizadas do projeto
- Prettier 3 + _plugins_ para ordenar CSS e JSON
- Vercel Functions + Resend

### 🔄 O que mudou

O README anterior ainda descrevia uma estratégia baseada em CSS nativo com _nesting_. Isso já não representa o estado real do repositório.

Hoje o projeto usa SCSS de forma consistente:

- `angular.json` define `inlineStyleLanguage: "scss"`.
- Os _schematics_ do Angular geram componentes com `style: "scss"`.
- Os estilos globais são carregados a partir de `src/styles/styles.scss`.
- A arquitetura de estilos está organizada em `base`, `components` e `mixins`.
- `@use` é o mecanismo padrão para importar camadas de estilo.

### 🏗️ Arquitetura

#### 🖥️ _Frontend_

- _Bootstrap_ com `bootstrapApplication()`.
- `ApplicationConfig` centralizado em `src/app/app.config.ts`.
- _Lazy loading_ por página com o _router_.
- `withInMemoryScrolling()` e `withViewTransitions()` ativados.
- Cliente HTTP configurado com _interceptors_.
- Traduções carregadas a partir de `/assets/i18n/*.json`.

#### ⚡ Estado e reatividade

- _Signals_ são o mecanismo padrão para estado local.
- `computed()` é usado para estado derivado.
- `toSignal()` é usado como ponte pontual a partir de fluxos observáveis.
- RxJS não é a solução padrão; só é usado quando a interoperabilidade realmente compensa.

#### 📄 Conteúdo e páginas

- _Home_, _About_, _Blog_, _Blog Detail_, _Contact_ e _Project Detail_ carregam como páginas independentes.
- O conteúdo do _blog_ é servido a partir de ficheiros Markdown em `public/assets/blog/<lang>`.
- A renderização dos artigos suporta _syntax highlighting_ e _fallback_ de idioma.

#### ☁️ _Backend_ leve

- `api/contact.ts` expõe o _handler serverless_ do formulário de contacto.
- O envio de e-mails é resolvido com Resend.
- A Vercel reescreve `/api/*` e serve a SPA para o restante.

### 📁 Estrutura relevante

```sh
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── pages/
│   └── shared/
├── environments/
├── styles/
│   ├── base/
│   ├── components/
│   └── mixins/
└── types/
public/
├── assets/
│   ├── blog/
│   ├── i18n/
│   └── images/
└── favicon.ico
api/
└── contact.ts
```
````

### 🧠 Boas práticas do projeto

- Todo o código e comentários são escritos em inglês.
- Cada componente é _standalone_ e usa `ChangeDetectionStrategy.OnPush`.
- Preferimos _Signals_ em vez de estado mutável disperso ou subscrições manuais.
- As páginas são carregadas com _lazy loading_ para reduzir o custo inicial.
- O _styling_ está organizado com SCSS modular, não com ficheiros avulso.
- Os tokens visuais residem na camada global de estilos, não duplicados por componente.
- Evitamos `any`; o ESLint trata isso como erro fora dos testes.
- Ordenamos _imports_, chaves JSON e chaves de objetos para manter _diffs_ previsíveis.
- Regras personalizadas do ESLint impõem consistência em _decorators_, posicionamento de _signals_ e _imports_.
- Para eventos de alta frequência, a convenção é evitar `@HostListener` e preferir `host` ou pontes reativas como `fromEvent + toSignal`.
- O _codebase_ favorece código autodocumentado: nomes claros, funções pequenas e comentários apenas quando explicam intenção ou uma restrição real.

### 📜 _Scripts_

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev
npm start

# Desenvolvimento local com API mock + frontend
npm run dev:api

# Testes
npm run test
npm run test:watch
npm run test:ui

# Qualidade
npm run lint
npm run lint:fix
npm run format

# Build e preview
npm run build
npm run preview
```

### ⚙️ Requisitos de ambiente

- Node.js `>= 22.19.0`
- npm `>= 10.9.3`

### ⚙️ Variáveis de ambiente

Crie um ficheiro `.env` a partir de `.env.example`:

```bash
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=your-email
```

Estas variáveis são necessárias para que `api/contact.ts` possa enviar e-mails.

### 🧪 Testes e qualidade

- Vitest corre em ambiente `jsdom`.
- Os testes usam `src/test-setup.ts` como _bootstrap_ partilhado.
- ESLint valida TypeScript, templates HTML do Angular e ficheiros JSON.
- Prettier ordena automaticamente declarações CSS e chaves JSON.
- As regras adicionais de consistência ficam em `.eslint/rules/`.

### 🌍 i18n e _assets_

- As traduções residem em `public/assets/i18n` e são servidas como `/assets/i18n/*.json`.
- Os artigos do _blog_ estão separados por idioma dentro de `public/assets/blog`.
- Se as traduções retornarem 404, o primeiro local a verificar é a configuração de `assets` em `angular.json`.

### 🧾 Convenção de _commits_

O projeto usa _Conventional Commits_ com este formato:

```sh
<type>(<scope>): <description>
```

Tipos permitidos:

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `chore`
- `perf`
- `ci`
- `build`
- `revert`

Exemplos:

```sh
feat(blog): add markdown article loader
fix(contact): validate invalid email payload
docs(readme): document scss architecture and tooling
```

### 🌿 _Branching_

O repositório segue Gitflow:

```sh
main       <- produção
develop    <- integração
feature/*  <- novas funcionalidades
release/*  <- preparação de *releases*
hotfix/*   <- correções urgentes
```

### 📝 Nota operacional

Embora o _workspace_ ainda mantenha configuração do Angular CLI para _schematics_ e _targets_, o fluxo diário de desenvolvimento e o _build_ de produção deste _portfolio_ correm sobre Vite.

---

<p align="center">
  Built with ⚡ Angular + ❤️ Clean Architecture
</p>
```
