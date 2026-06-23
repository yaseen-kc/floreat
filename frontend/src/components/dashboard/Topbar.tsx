import { useState, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SaveStatus } from '@/components/dashboard/SaveStatus'
import { getCurrentTheme, toggleTheme } from '@/lib/theme'

/** Maps the current path to a human breadcrumb tail (DESIGN.md §8.2). */
function useCrumb(): string {
  const { pathname } = useLocation()
  if (pathname.startsWith('/quotations/new')) return 'New quotation'
  if (pathname.startsWith('/quotations')) return 'Quotations'
  return 'Overview'
}

/** Theme switch — flips the persisted light/dark choice (DESIGN.md §7.3). */
function ThemeToggle() {
  const [theme, setTheme] = useState(getCurrentTheme)
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

interface TopbarProps {
  /** Opens the mobile nav drawer (≤768px). */
  onMenu: () => void
  /** Ref to the search input so keyboard shortcuts can focus it. */
  searchRef: RefObject<HTMLInputElement | null>
}

/**
 * Sticky, translucent top bar (DESIGN.md §8.1): breadcrumbs (position),
 * a global search with a kbd hint, and right-aligned global tools
 * (save status, notifications, theme). A menu button appears on mobile.
 */
export function Topbar({ onMenu, searchRef }: TopbarProps) {
  const crumb = useCrumb()
  return (
    <header className="sticky top-0 z-30 flex h-[var(--topbar-h)] shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-[12px]">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        onClick={onMenu}
        className="hidden max-[768px]:inline-flex"
      >
        <Menu />
      </Button>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <span className="font-mono text-xs tracking-wide text-muted-foreground">Strukt</span>
        <span className="text-muted-foreground/60">/</span>
        <b className="font-medium text-foreground">{crumb}</b>
      </nav>

      <div className="relative ml-auto w-full max-w-72 max-[768px]:hidden">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          type="search"
          placeholder="Search…"
          aria-label="Search"
          className="h-8 pr-12 pl-8"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          /
        </kbd>
      </div>

      <div className="flex items-center gap-1 max-[768px]:ml-auto">
        <SaveStatus />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
