import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  label: string
  value: T
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible label for the group (DESIGN.md §9 — icon/compact controls). */
  ariaLabel?: string
  className?: string
}

/**
 * Inline single-choice toggle (DESIGN.md §6.7). The active option carries an
 * accent-soft fill + accent text; the rest are quiet. Composed from real
 * <button>s so keyboard/AT support comes for free.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-secondary p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-colors",
              active
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
