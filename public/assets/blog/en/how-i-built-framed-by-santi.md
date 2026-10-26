## 📸 Introduction: a photography portfolio in production on day three

[Framed by Santi](https://framedbysanti.rootdevs.es) is the website of [@framedbysanti](https://www.instagram.com/framedbysanti), an amateur photographer who shoots the streets of New York with a Fujifilm X100VI. It has two sides: a public site to show his photos and a private dashboard so he can publish on his own, without depending on anyone.

It started as a gift for a friend, but this post isn't about that: it's about **how I built it in very little time, assisted by Claude Code, without giving up on quality**.

The numbers, straight from the repository:

- 📅 **9 days with commits**, from October 13 to 26, 2026.
- 🚀 **In production on day 3**: public site and private dashboard.
- 🔀 **189 commits** and **35 pull requests**; I tested every change myself, as a visitor and as the admin, before it reached production.
- 🧪 **117 test files** with **857 cases**.
- 🌍 **Three languages**: English, Spanish and Portuguese.
- 💯 **100 in all four Lighthouse categories** (desktop, 4G network).

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/commits_EN_dark.webp" alt="Bar chart of commits per day from October 13 to 26, 2026: 1, 43, 75 (the day it went to production), 3, none over the weekend, 22, 7, 23, 3, none from the 23rd to the 25th and 12">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/commits_EN_light.webp" alt="Bar chart of commits per day from October 13 to 26, 2026: 1, 43, 75 (the day it went to production), 3, none over the weekend, 22, 7, 23, 3, none from the 23rd to the 25th and 12">

---

## 🤖 How I worked: AI agents, but with a method

I built it in the terminal with AI agents (Claude Code) configured through [gentle-ai](https://github.com/Gentleman-Programming/gentle-ai), the open-source tool by [Alan Buscaglia](https://www.linkedin.com/in/alanbuscaglia/) (Gentleman Programming). This isn't "asking the AI for a website": it's a workflow with rules.

- **ODD (Organic-Driven Development):** small changes are made directly; big work gets a task document with the requirements copied word for word, so nothing gets lost between sessions.
- **Engram:** persistent memory. Every decision, solved bug or preference is saved and the agent recovers it in the next session. For example: "ask before pushing, even to staging".
- **Tests first:** for every new rule, first a failing test and then the code that makes it pass.
- **Branches and review:** every change starts on a branch, goes up to `develop`, I test it on `staging`, and it only reaches `main` (production) when I approve it.

The split was clear:

- 🤖 **The agent:** wrote the code and the tests, investigated the bugs, proposed solutions and opened the PRs.
- 🙋 **Me:** decided what to build and how it had to work, reviewed every change, corrected the agent when it got things wrong and approved every release to production.

> 💡 AI writes fast; what makes the result good is **verifying**. Every PR passed lint, tests and build, and no change reached production without my approval.

---

## 🧱 Stack and architecture

<img class="theme-img theme-img--dark" src="/assets/images/blog/framedBySanti/architecture_EN_dark.webp" alt="Framed by Santi architecture diagram: the browser gets the static app from Vercel, reads Firestore over REST on public pages and uses Firebase Auth and the SDK only in the dashboard; photos come from the Cloudinary CDN and the dashboard uploads them directly with a signature; the Vercel functions clean up Cloudinary, send the email with Resend, translate with DeepL and sign the uploads, and all the dashboard ones check in Firestore that the user is an admin with their own token">
<img class="theme-img theme-img--light" src="/assets/images/blog/framedBySanti/architecture_EN_light.webp" alt="Framed by Santi architecture diagram: the browser gets the static app from Vercel, reads Firestore over REST on public pages and uses Firebase Auth and the SDK only in the dashboard; photos come from the Cloudinary CDN and the dashboard uploads them directly with a signature; the Vercel functions clean up Cloudinary, send the email with Resend, translate with DeepL and sign the uploads, and all the dashboard ones check in Firestore that the user is an admin with their own token">

**Frontend**

- **Angular 22** without Zone.js (*zoneless*), with **Signals** for all state and *standalone* components.
- **TypeScript 6** in strict mode: no `any` and explicit return types.
- **Native CSS** with *nesting*, BEM and *mobile-first*. No preprocessor.
- **Vite 8** with `@analogjs/vite-plugin-angular` as the only build tool.
- **Transloco** for the three languages.

**Services**

- **Vercel:** hosting and four *serverless* functions.
- **Firebase Auth and Firestore:** dashboard login and data (sets, themes, settings).
- **Cloudinary:** photo storage and delivery, with signed uploads.
- **DeepL:** automatic translation of the texts.
- **Resend:** the contact form email.

**The four `api/` functions**

| Function | What it does |
| --- | --- |
| `sign-upload` | Checks that the caller is an admin and signs the Cloudinary upload. |
| `translate` | Proxy to DeepL, admins only, with a 10-second limit. |
| `cleanup-photos` | Deletes from Cloudinary the photos nothing uses anymore. |
| `contact` | Validates the form and sends the email with Resend. |

The three dashboard functions check that the user is an admin the same way: they read their document in Firestore **with the user's own token**, so it's the Firestore security rules that decide, not a secret on the server.

---

## 🖼️ The public site

- **Posts are sets**, like an Instagram carousel: several photos with a title and a story.
- **Home** with the latest set in a draggable carousel.
- **Gallery** with a section per set and a theme filter.
- **Full-screen viewer:** zoom and pan (pinch, drag, double tap, wheel), swipe gestures, thumbnails, preloading of the next photo and a dissolve between photos.
- **View Transitions** between pages, with an iris effect like a camera aperture.
- **About** with Santi's story in his own words and a contact form. His email never reaches the page.
- **Real languages:** dates, numbers and plurals follow the active language (`en-US`, `es-ES`, `pt-PT`).
- With `prefers-reduced-motion`, nothing animates.

<p align="center"><a href="https://framedbysanti.rootdevs.es/" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/home_EN.webp" alt="Framed by Santi home page: a full-screen photo of the Flatiron with Santi's name and the buttons to the gallery and Instagram" width="720"></a><br><em>The home page. Click to see it live.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/gallery_EN.webp" alt="Framed by Santi gallery: theme filter and a set with its photo carousel" width="720"></a><br><em>The gallery with the theme filter.</em></p>

<p align="center"><a href="https://framedbysanti.rootdevs.es/gallery" target="_blank" rel="noopener"><img src="/assets/images/blog/framedBySanti/viewer_EN.webp" alt="Framed by Santi viewer: a large photo with arrows, zoom controls and the thumbnail strip" width="720"></a><br><em>The viewer: zoom, arrows and thumbnails.</em></p>

---

## 🔐 The private dashboard

The dashboard lives at `/admin` and has no public link: you only get there by typing the path.

- **Set library:** published or draft switch, edit and delete.
- **Set editor:** drag photos in, preview them, reorder them and write the texts in one tab per language.
- **Photos prepared in the browser:** before uploading, each photo is resized and recompressed to at most 6000 px and 10 MB, lowering the JPEG quality step by step until it fits. That way the limits of Cloudinary's free plan are respected without Santi having to think about it.
- **Automatic translation:** Santi writes in one language and, when he publishes, DeepL fills in the missing ones. Each language can be corrected by hand.
- **Themes:** created and deleted from the dashboard.
- **Automatic cleanup:** when the library opens, the Cloudinary photos no set uses anymore are deleted in the background.
- **Settings:** profile photo and password change.
- **On the phone too:** the dashboard fits the phone screen, and the sign-in form lets you show or hide the password.
- **And an *easter egg*** just for the admin: a corner to keep going strong. 💪

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-library_EN.webp" alt="Private dashboard library: the sets with their cover, the published and drafts filter, and the publish switch" width="720"><br><em>The library: each set is published or moved to draft with a switch.</em></p>

<p align="center"><img src="/assets/images/blog/framedBySanti/dashboard-editor_EN.webp" alt="Private dashboard set editor: the set's photos on the left and, on the right, the texts with one tab per language and the Translate button" width="720"><br><em>The editor: photos on the left, texts per language and the translate button on the right.</em></p>

---

## ⚡ Performance: measure, cut and measure again

I didn't leave performance for the end: I measured with Lighthouse, went after what weighed the most and measured again. This is how it looks today on desktop with a 4G network:

<p align="center"><img src="/assets/images/blog/framedBySanti/lighthouse.webp" alt="Lighthouse report for Framed by Santi on desktop with a 4G network: 100 in Performance, Accessibility, Best Practices and SEO" width="420"></p>

### First round: from 44 to 73 on mobile

The first measurement, on October 15 on mobile with slow 4G (the most demanding case), gave a performance score of **44-48**, with a CLS of **0.333** and an LCP of **7.5 s**. Three changes fixed almost all of it:

- **Preloading the home page's main photo** from `index.html`, with `fetchpriority="high"`. The preload script goes before any stylesheet, because a pending stylesheet blocks the scripts that come after it.
- **The home page ships in the main bundle**, without lazy loading, so there's no extra network round trip before the first page is painted.
- **The footer is painted after the first navigation.** It was responsible for all the CLS. The latest-set carousel also reserves its space while it loads.

Result on mobile: **performance 73, CLS 0.001 and LCP 5.6 s**.

### Second round: removing what wasn't needed

- **Self-hosted fonts.** I serve them from the site's own domain, with no round trip to Google Fonts.
- **Firebase out of the public pages.** Reviewing the build, I saw that the Firebase bundle weighed **563 kB (168 kB compressed)** and was preloaded on every page, and that every visit also opened a Google authentication iframe of about **93 KiB**. All of that to read sets that are public. Now the public pages read Firestore with `fetch` against its REST API, with the same security rules.
- **Login only loads when needed:** a local flag says that an admin has already signed in on that browser. Visitors never download Firebase Auth. And the flag grants no permission: the real check is still Firebase.

Result on desktop with a 4G network: **100 in Performance, Accessibility, Best Practices and SEO**.

### What comes as standard

- **Responsive images:** every photo is served from Cloudinary with `srcset` in five widths (480, 800, 1200, 1600 and 2400 px) and automatic format and quality.
- **Every page loads when it's visited** (*lazy loading*), except the home page.

> 💡 The lesson: **measure before optimizing**. The biggest CLS problem was a footer, and the biggest weight, a library visitors didn't even use.

---

## 🛡️ Security

- **Firestore rules that deny everything by default.** The public can only read published sets, and settings only accept the allowed fields.
- **Signed uploads:** the browser never has permission to upload to Cloudinary on its own; every upload is signed by a function that first checks you're an admin.
- **Contact form** with length limits, escaped HTML and a trap field: bots fill it in, get an "OK" and nothing is sent.
- **Staging isn't indexed:** staging builds carry `noindex` and a `robots.txt` that disallows everything.

---

## 🧪 Quality: order isn't negotiable, the linter enforces it

When AI writes most of the code, conventions can't depend on someone remembering them. So I turned them into rules: if the code doesn't follow the order, **lint fails**, no matter who wrote it. The rules have been there since the first day of the project.

**Five custom ESLint rules**, written for this project:

| Rule | What it enforces | Fixes itself? |
| --- | --- | --- |
| `component-decorator-order` | `@Component` properties always in the same order: `standalone`, `changeDetection`, `imports`, `selector`, `styleUrl`, `templateUrl`... | ✅ |
| `inject-before-signals` | `inject()` calls come before any other class property. | ✅ |
| `alphabetical-component-imports` | The component's `imports` array, in alphabetical order. | ✅ |
| `alphabetical-inputs-signals` | `input()` and `signal()` declarations, in alphabetical order within their group. | ❌ |
| `alphabetical-interface-members` | Interface and type members, in alphabetical order. | ❌ |

The last two only warn, they don't reorder on their own: in interfaces, for example, moving members can break code that uses *spread* or `Object.assign`, so I'd rather a person decide.

**And the rest of the order, also automatic:**

- **Imports** grouped and sorted: Angular and external libraries first, then the internal aliases (`@core`, `@features`...) and the relative ones last.
- **Object keys** in alphabetical order in data, constants, models and interfaces.
- **Translation JSON** with sorted keys and no comments.
- **Prettier** with plugins that sort CSS properties, HTML attributes and JSON keys.
- **Strict TypeScript:** `any` is an error, return types are required and `===` is always used.

### The dictionary pattern

There's one practice I always ask for that no linter enforces: the **dictionary pattern**, known in English as *object lookup* (and as a *dispatch table* when the values are functions). When a function maps one value to another, no `switch` and no chained `if/else`: an object typed with `Record`, key access and a default value with `??`.

```typescript
const TRANSLATE_ERRORS: Record<TranslationError['reason'], string> = {
  failed: 'admin.editor.translate.errors.failed',
  limit: 'admin.editor.translate.errors.limit',
  'not-allowed': 'admin.editor.translate.errors.notAllowed',
};
```

Three advantages:

- **It reads at a glance:** every case in one table, instead of spread across branches.
- **TypeScript makes sure none is missing:** with `Record<TranslationError['reason'], string>`, if a new error reason shows up tomorrow, the code won't compile until it has its text.
- **Adding a case is adding a line**, without touching the logic.

If instead of a value you need to run something, the values become functions: that's the *dispatch table*. There's a trap here that I had in my own notes:

```javascript
const LOKI_DEFAULT_DISGUISE = 'Loki';

const LOKI_DISGUISES = {
  Hulk: () => 'Thanos',
  Thor: () => 'Odin',
};

// ❌ If the enemy isn't in the table: TypeError, ... is not a function
const disguise = LOKI_DISGUISES[enemy]() ? LOKI_DISGUISES[enemy]() : LOKI_DEFAULT_DISGUISE;

// ✅ With ?.() nothing runs if it doesn't exist, and ?? sets the default value
const disguise = LOKI_DISGUISES[enemy]?.() ?? LOKI_DEFAULT_DISGUISE;
```

Besides breaking on an unknown key, the first version runs the function twice. And `??` is better than the ternary: it only uses the default value when the key doesn't exist, not when the result is a valid `''` or `0`.

It isn't dogma: in templates I use `@switch` when each case renders something different, and there's still the odd `switch` where each branch does more than return a value.

**And the tests:**

- **857 cases** in 117 files, with Vitest and JSDOM, the `api/` functions included.
- **Conventional commits** validated by a script.

---

## 🐛 Five real problems (and how I solved them)

### 1. Tabs that broke after every deploy

A tab opened before a deploy asked for files from the previous build, which no longer existed. The pages that load when you visit them (gallery, About, the dashboard) **wouldn't open and said nothing**.

The fix was a navigation error handler that, if downloading a part of the app fails, reloads that page from scratch to get the new build. It only does it for download errors and once in a row per page, so a real outage can't cause a reload loop.

### 2. Taking Firebase off the public pages

The savings are covered in the performance section; the delicate part was security. I moved login into a store that loads on demand, and the local flag that decides when to load it **grants nothing**: if someone forges it, all they get is to download Firebase Auth, because the real check is still the login and the admin document in Firestore.

### 3. Vercel functions and ES modules

The `api/` functions failed on Vercel: as native ES modules, relative imports need the `.js` extension. Besides the fix, I added a test that checks every import in `api/` so it doesn't happen again.

### 4. A photo cleanup that can't get it wrong

Deleting "orphan" photos is easy; deleting only the orphans, not so much. The cleanup learned with each case:

- If it can't read the sets, **it deletes nothing**. A failed read doesn't mean no photos are in use.
- It only counts as deleted the photos Cloudinary **confirms**.
- It respects the profile photo and the ones in the admin's corner, which live in the same folder.
- It doesn't touch photos less than 7 days old and deletes at most 100 per run.

### 5. "Saving…" forever

When saving the profile photo on a slow connection, if the save took too long the app asked the server whether it had arrived... with no time limit for that question. Now that check has its own 5-second limit, and reading the session saved in IndexedDB gives up after 2 seconds, because some browsers never answer.

---

## 📅 Day by day

| Day | Commits | What happened |
| --- | --- | --- |
| Oct 13 | 1 | Project created: Angular, i18n and tooling. |
| Oct 14 | 43 | Full prototype of the public site and photos from Cloudinary. |
| Oct 15 | 75 | Firestore rules, login, signed uploads, editor, translation, themes, cleanup, 404 page. **First release to production.** |
| Oct 16 | 3 | Self-hosted fonts. |
| Oct 19 | 22 | Public pages without the SDK, on-demand login, dashboard settings. |
| Oct 20 | 7 | The About story and mobile tweaks. |
| Oct 21 | 23 | Instagram icon, the admin's corner and the contact form. |
| Oct 22 | 3 | Polishing the contact email. |
| Oct 26 | 12 | Dashboard fitted to phones, show the password on sign-in and improvements to the admin's corner. |

---

## 🎯 Lessons

1. **Speed comes from the method, not just from AI.** Written requirements, tests first, branches and review: without them, 75 commits in a day would be 75 problems.
2. **Persistent memory changes the game.** An agent that remembers decisions and bugs from previous sessions doesn't repeat them.
3. **Verifying beats generating.** Nothing reached production without passing tests, lint and build.
4. **Free tiers go a long way** if you design around their limits (Cloudinary, Firebase, DeepL Free, Resend and Vercel).
5. **Security isn't delegated to the frontend.** The Firestore rules and the functions that check for an admin are what protect it; the interface just goes along.

> ⭐ **gentle-ai on GitHub:** [github.com/Gentleman-Programming/gentle-ai](https://github.com/Gentleman-Programming/gentle-ai). If you find it useful, give it a star.

<p align="center"><a href="https://github.com/Gentleman-Programming/gentle-ai"><img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" /></a></p>
