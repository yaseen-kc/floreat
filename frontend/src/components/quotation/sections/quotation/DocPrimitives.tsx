import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DocChapterProps {
  /** Mono eyebrow, e.g. "Chapter 1". Omit for un-numbered sections. */
  eyebrow?: string
  title: string
  children: ReactNode
  className?: string
}

/** A numbered chapter of the quotation, introduced by a mono eyebrow. */
export function DocChapter({ eyebrow, title, children, className }: DocChapterProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <header className="space-y-1">
        {eyebrow && (
          <p className="font-mono text-[11.5px] uppercase tracking-wide text-primary">{eyebrow}</p>
        )}
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </header>
      {children}
    </section>
  )
}

/** A titled block inside a chapter, e.g. "Building Description". */
export function DocSubsection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-2.5', className)}>
      <h4 className="text-sm font-semibold text-foreground/85">{title}</h4>
      {children}
    </section>
  )
}

/** Body copy. `pretty` wrapping per DESIGN.md §4.3. */
export function DocProse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm leading-relaxed text-pretty text-foreground/85', className)}>
      {children}
    </p>
  )
}

/** A numbered clause list — the document's default list style. */
export function DocList({
  items,
  ordered = true,
  className,
}: {
  items: readonly ReactNode[]
  ordered?: boolean
  className?: string
}) {
  const List = ordered ? 'ol' : 'ul'
  return (
    <List
      className={cn(
        'space-y-2 pl-5 text-sm leading-relaxed text-pretty text-foreground/85',
        ordered ? 'list-decimal' : 'list-disc',
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </List>
  )
}

/** A blank fill-in rule for the contract form. */
export function DocBlank({ width = 'w-48' }: { width?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block border-b border-dashed border-foreground/40 align-baseline', width)}
    />
  )
}
