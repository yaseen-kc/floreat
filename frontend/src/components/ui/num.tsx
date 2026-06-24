import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface NumProps {
  children: ReactNode
  className?: string
}

/**
 * Renders a figure as data: monospace, tabular (so columns of numbers align),
 * with the tightened tracking the design system uses for numerics
 * (DESIGN.md §4.1/§4.3). Use for any currency, quantity, ID, or timestamp.
 */
export function Num({ children, className }: NumProps) {
  return (
    <span className={cn("font-mono tabular-nums tracking-[-0.01em]", className)}>
      {children}
    </span>
  )
}
