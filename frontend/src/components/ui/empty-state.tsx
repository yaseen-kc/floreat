import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** Optional glyph/icon shown above the message. */
  icon?: ReactNode
  /** The plain statement of fact (e.g. "No drafts yet."). */
  title: string
  /** Optional one-line follow-up describing the next action. */
  description?: string
  /** Optional action (e.g. a primary button). */
  action?: ReactNode
  className?: string
}

/**
 * Centered placeholder for zero-data views (DESIGN.md §6.12/§10): states the
 * fact and the next action plainly — no illustrations as filler.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="grid size-11 place-items-center rounded-lg bg-secondary text-muted-foreground [&_svg]:size-5">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-md font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
