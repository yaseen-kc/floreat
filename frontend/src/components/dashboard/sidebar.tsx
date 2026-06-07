import { NavLink } from 'react-router-dom'
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
  { label: 'Workspace', items: [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Quotations', to: '/quotations', icon: FileText, count: 24 },
    { name: 'Create Quotation', to: '/quotations/new', icon: Plus },
    { name: 'Saved Drafts', to: '/drafts', icon: Folder, count: 2 },
  ]},
  { label: 'Library', items: [
    { name: 'Templates', to: '/templates', icon: LayoutGrid },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Settings', to: '/settings', icon: Settings },
  ]},
]

export function Sidebar() {
  return (
    <aside className="w-62 h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-[7px] bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center" aria-hidden="true">
          <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
          </svg>
        </div>
        <span className="font-semibold text-[15px] tracking-tight text-sidebar-foreground">Strukt</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 px-3">
        {navItems.map((section) => (
          <div key={section.label}>
            <div className="font-mono text-[11.5px] uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-2">
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium mb-0.5 transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="w-[17px] h-[17px] shrink-0" />
                {item.name}
                {item.count != null && (
                  <span className={cn(
                    'ml-auto font-mono text-[11.5px] px-[7px] py-px rounded-full',
                  )}>
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User chip */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
          <div className="w-[30px] h-[30px] rounded-full bg-sidebar-accent text-sidebar-primary grid place-items-center font-semibold text-[13px] shrink-0">
            YK
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-semibold text-sidebar-foreground">Yaseen K.</div>
            <div className="text-[11.5px] text-muted-foreground">Lead Estimator</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
