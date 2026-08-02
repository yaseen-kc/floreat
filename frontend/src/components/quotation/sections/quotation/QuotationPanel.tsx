import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Shared frame for one independently reviewable part of the quotation. */
export function QuotationPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      data-testid="quotation-panel"
      className={cn('w-full rounded-lg border border-border bg-card p-6 max-[640px]:p-4', className)}
    >
      {children}
    </section>
  )
}
