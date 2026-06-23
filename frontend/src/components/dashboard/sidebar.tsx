import { NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import {
  LayoutDashboard,
  FileText,
  Plus,
  Folder,
  LayoutGrid,
  Users,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Workspace',
    items: [
      { name: 'Dashboard', to: '/', icon: LayoutDashboard },
      { name: 'Quotations', to: '/quotations', icon: FileText, count: 24 },
      { name: 'Create Quotation', to: '/quotations/new', icon: Plus },
      { name: 'Saved Drafts', to: '/drafts', icon: Folder, count: 2 },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Templates', to: '/templates', icon: LayoutGrid },
      { name: 'Customers', to: '/customers', icon: Users },
      { name: 'Settings', to: '/settings', icon: Settings },
    ],
  },
]

// Elements that collapse to nothing in the icon-rail tier (769–1180px) but stay
// visible at full width and inside the mobile drawer.
const railHide = 'min-[769px]:max-[1180px]:hidden'

interface SidebarProps {
  /** Whether the mobile drawer is open. */
  navOpen: boolean
  /** Closes the mobile drawer (e.g. after navigating). */
  onClose: () => void
}

export function Sidebar({ navOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 z-40 flex h-screen w-full flex-col border-r border-sidebar-border bg-sidebar',
        // Mobile: off-canvas drawer that slides in on navOpen.
        'max-[768px]:fixed max-[768px]:top-0 max-[768px]:left-0 max-[768px]:w-[248px] max-[768px]:shadow-lg max-[768px]:transition-transform max-[768px]:duration-200 max-[768px]:ease-[var(--ease)]',
        navOpen ? 'max-[768px]:translate-x-0' : 'max-[768px]:-translate-x-full',
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex h-[var(--topbar-h)] shrink-0 items-center gap-3 border-b border-sidebar-border px-4',
          'min-[769px]:max-[1180px]:justify-center min-[769px]:max-[1180px]:px-0',
        )}
      >
        <div
          className="grid size-7 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
          aria-hidden="true"
        >
          <svg className="size-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
          </svg>
        </div>
        <span className={cn('text-md font-semibold tracking-tight text-sidebar-foreground', railHide)}>
          Floreat
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((section) => (
          <div key={section.label}>
            <div className={cn('px-3 pt-3 pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground', railHide)}>
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'relative mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'min-[769px]:max-[1180px]:justify-center min-[769px]:max-[1180px]:px-0',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                  )
                }
              >
                <item.icon className="size-[17px] shrink-0" />
                <span className={railHide}>{item.name}</span>
                {item.count != null && (
                  <>
                    <span className={cn('ml-auto rounded-4xl bg-secondary px-[7px] py-px font-mono text-xs text-muted-foreground', railHide)}>
                      {item.count}
                    </span>
                    {/* Rail tier: the count collapses to a dot (DESIGN.md §8.3). */}
                    <span className="absolute top-2 right-2.5 hidden size-1.5 rounded-full bg-primary min-[769px]:max-[1180px]:block" />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User chip — the Clerk account avatar + menu. */}
      <div
        className={cn(
          'flex shrink-0 items-center gap-3 border-t border-sidebar-border p-3',
          'min-[769px]:max-[1180px]:justify-center min-[769px]:max-[1180px]:px-0',
        )}
      >
        <UserButton />
        <span className={cn('text-sm font-medium text-muted-foreground', railHide)}>Account</span>
      </div>
    </aside>
  )
}
