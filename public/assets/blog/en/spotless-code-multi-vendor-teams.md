## 🌪️ Introduction: The Invisible Chaos of Spaces and Commas

In large-scale projects where multiple consultancies coexist, the diversity of criteria is not only a cultural richness — it is also a technical risk. A problem as silent as it is disruptive emerges: **visual inconsistency**. When each team brings its own development DNA — some preferring tabs, others spaces; single quotes versus double quotes — the repository ceases to be a cohesive asset and becomes a battlefield of irrelevant changes.

This lack of unification is not a mere aesthetic detail; it is a source of operational friction and *vendor finger-pointing* during code reviews. Discussions about brace placement or line length **steal golden minutes** that should be invested in architecture or business logic.

> 💡 For a technical leader, standardisation is not a whim: it is a strategy to eliminate noise and ensure that Code Reviews focus on what truly adds value.

---

## ✨ Ending Style Wars with Prettier

The solution to eradicate this friction is to delegate responsibility to **Prettier**. As an *opinionated* code formatter, Prettier eliminates subjectivity by parsing code and reprinting it under strict, predefined rules.

What makes it indispensable for a Software Architect is its **safety**: Prettier acts on the presentation layer without altering the Abstract Syntax Tree (AST). This provides a fundamental guarantee:

> *"The application's behaviour remains exactly the same"*

Adopting Prettier is, in essence, an act of liberation for the team. By automating style, developers shed the cognitive load of visually "fitting in" with the rest, allowing **Developer Experience (DevEx)** to flow towards solving complex problems.

### ⚙️ Minimal configuration in `.prettierrc`

```json
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 🕵️ The Git "Hack" to Format Without Losing the Trail

The greatest fear when implementing a standard on a live project is the **mass commit**. By formatting the entire codebase at once, we risk obscuring the original authorship. If a developer uses `git blame` to understand why a technical decision was made two years ago, they will find that the author is *"the formatting bot"*, losing historical traceability.

To evolve the codebase without sacrificing this trail, we use the `.git-blame-ignore-revs` file.

### 🔍 How it works

1. You format the entire project and commit.
2. You obtain the hash of the formatting commit.
3. You register it in `.git-blame-ignore-revs`:

```bash
# Mass formatting commit with Prettier — 2024-10-15
a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

4. You configure Git to use it automatically:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

This functionality allows you to:

- 👤 **Preserve original authorship**: Git ignores that commit in traces.
- 🏛️ **Maintain history integrity**: GitHub and GitLab respect this file, showing the true author of the business logic.
- 🔇 **Evolution without noise**: Achieve visual perfection without *"contaminating"* the historical responsibility of each line.

---

## 🌐 Node.js as the Cross-Platform "Source of Truth"

In modern ecosystems, especially in Angular-based projects, operating system independence is critical. The classic mistake of many automations is relying on **Bash** scripts, which often fail in Windows environments or require tedious manual configuration.

Our architecture proposes a paradigm shift: **treating the repository as an application environment rather than a system environment**. By centralising everything in Node.js, we guarantee true *cross-platform* behaviour:

- 💻 **Hardware agnosticism**: The workflow works the same on a MacBook M3 as on a Windows 10 workstation.
- 🔒 **Controlled environment**: If the developer has Node.js installed (a requirement for Angular), the automation will work by default.
- 📦 **Unified tooling**: The `package.json` becomes the single source of truth.

---

## 🐶 Husky and lint-staged: The Silent Guardians of the Repository

For standardisation to be effective, it must be **invisible and mandatory**. We implement a forced compliance workflow using **Husky** and **lint-staged**, acting as a quality filter before code reaches the server:

1. 🚀 **Trigger**: The developer runs `git commit`.
2. 🪝 **Interception**: Husky captures the event and delegates execution to Node.js.
3. 🎯 **Smart filtering**: lint-staged identifies only the files in the *Staging Area*. No time is wasted processing thousands of static files — only what has changed.
4. ✅ **Formatting and validation**: Prettier applies the format. If the code has critical syntax errors, the commit is aborted.

### 📦 Installation

```bash
npm install --save-dev husky lint-staged
npx husky init
```

### 🔧 Configuration in `package.json`

```json
{
  "lint-staged": {
    "*.{ts,html,scss,json,md}": ["prettier --write"]
  }
}
```

### Pre-commit hook (`.husky/pre-commit`)

```bash
node_modules/.bin/lint-staged
```

> 🛡️ This process eliminates the **human forgetfulness factor** and guarantees that no non-standard code ever enters the repository, without the developer having to run a single additional command.

---

## 📋 Action Plan: Proof of Concept (POC)

As Architects, we do not implement critical changes blindly. The path to visual excellence follows a clear technical roadmap:

1. 🌿 **Isolation**: Create a `feature/prettier-standardisation` branch to avoid disrupting the current workflow.
2. ⚙️ **Configuration**: Install the stack (Prettier, Husky, lint-staged) and define the rules in `.prettierrc`.
3. 💥 **Mass execution**: Format the entire project and generate the reference commit.
4. 🛡️ **History protection**: Configure the `.git-blame-ignore-revs` file with the obtained hash.
5. 🎬 **Live demo**: Show the team and client how poorly indented code on Windows is instantly corrected on commit, preserving the original authorship in the history.

---

## 🚀 Conclusion: Towards a Culture of Clean Code

Adopting this ecosystem is not just a technical improvement; it is a **declaration of principles** about quality. The benefits are immediate: more agile code reviews, an impeccable Git history, and the complete elimination of aesthetic friction between consultancies.

The investment to implement this architecture is minimal compared to the long-term savings in time and frustration. At the end of the day, the question for any technology leader is simple:

> How much time is your team wasting discussing the format of commas, when they could be strengthening the architecture of their system?

Automation is the bridge between visual chaos and technical excellence. And happy May the 4th, may the force be with you in every commit! 🌌⚔️
