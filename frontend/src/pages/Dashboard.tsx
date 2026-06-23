import { LayoutDashboard } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

/**
 * Dashboard landing page. Currently a minimal on-system placeholder: a page
 * head plus an empty state. (Heading intentionally reads "Overview" so it does
 * not collide with the sidebar's "Dashboard" nav link.)
 */
export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] p-[var(--s7)] max-[560px]:p-[var(--s4)]">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Your quotation workspace at a glance.</p>
      </header>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <EmptyState
          icon={<LayoutDashboard />}
          title="Nothing here yet."
          description="Create a quotation to see it summarized on your dashboard."
        />
      </div>
    </div>
  )
}
