// View Transitions API — not yet included in TypeScript's default DOM lib.
// Extend the Document interface so document.startViewTransition is typed without casts.
interface ViewTransition {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
}
