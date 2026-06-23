/**
 * Theme system (DESIGN.md §7.3).
 *
 * Respects the OS first, remembers the user's override forever. The chosen
 * theme is applied as the `dark` class on <html> (shadcn's `@custom-variant
 * dark` mechanism). The initial value is also applied by an inline script in
 * index.html *before paint* to avoid a flash — this module owns the runtime
 * toggle and the (testable) resolution logic.
 */
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'Floreat:theme'

/**
 * Resolves the theme to use on load: a previously persisted choice if present
 * and valid, otherwise the OS `prefers-color-scheme`. Pure aside from reading
 * `localStorage` and `matchMedia`; safe to call before render.
 */
export function resolveInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage may be unavailable (private mode, SSR) — fall through.
  }
  const prefersDark =
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/** Applies a theme by toggling the `dark` class on the document root. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/** Returns the theme currently applied to the document root. */
export function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Flips the active theme, persists the new choice, applies it, and returns it.
 */
export function toggleTheme(): Theme {
  const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Persistence is best-effort; still apply for this session.
  }
  applyTheme(next)
  return next
}
