/**
 * Clerk appearance tuned to the Strukt Design System: the engineering-blue
 * accent, the app's sans font, and the control radius. Applied at the
 * <ClerkProvider> so every Clerk surface (SignIn, UserButton) inherits it.
 *
 * ponytail: variables are static (not theme-reactive) — light/dark of the
 * Clerk card itself isn't switched here. Upgrade path: add `@clerk/themes`
 * `dark` baseTheme keyed on the current theme if full dark theming is needed.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: 'oklch(54% 0.17 256)',
    fontFamily: "'Geist Variable', system-ui, sans-serif",
    borderRadius: '8px',
  },
  elements: {
    card: 'shadow-lg',
  },
} as const
