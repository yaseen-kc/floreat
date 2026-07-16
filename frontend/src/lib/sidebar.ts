/**
 * Sidebar collapse preference.
 *
 * On the full-desktop tier (≥1181px) the sidebar can be collapsed to an
 * icon-only rail by the user; the choice is remembered forever. The state is
 * applied as the `data-sidebar="collapsed"` attribute on <html>, which the CSS
 * uses to shrink `--sidebar-w` (see index.css). The 769–1180px rail and the
 * ≤768px drawer tiers are driven purely by media queries and are unaffected.
 */
export const SIDEBAR_KEY = 'Floreat:sidebar-collapsed'

/**
 * Resolves the collapsed preference on load: a previously persisted `true` if
 * present, otherwise `false` (expanded). Safe to call before render.
 */
export function resolveInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === 'true'
  } catch {
    // localStorage may be unavailable (private mode, SSR) — default expanded.
    return false
  }
}

/** Persists the collapsed preference (best-effort). */
export function setCollapsedPref(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_KEY, String(collapsed))
  } catch {
    // Persistence is best-effort; still apply for this session.
  }
}
