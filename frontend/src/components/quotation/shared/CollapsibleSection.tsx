import type { ReactNode } from 'react'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'
import { ErrMsg } from '@/components/quotation/shared/FormField'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  icon: ReactNode
  title: string
  /** Whether the section body is shown and its fields are part of the payload. */
  enabled: boolean
  /** Fired with the next enabled state when the toggle is flipped. */
  onToggle: (enabled: boolean) => void
  /**
   * When true, the card is flagged as invalid (destructive border + message).
   * The section is optional, so this only fires once it is enabled and one of
   * its fields holds an invalid value.
   */
  error?: boolean
  /** Override for the error prompt shown when `error` is true. */
  errorMessage?: string
  children: ReactNode
  className?: string
}

/**
 * An optional roof section: a {@link SectionCard} with a toggle switch in its
 * action slot. The body (and therefore the section's fields) only renders when
 * `enabled`, so disabling a section both hides it and — paired with the store's
 * field-clearing — drops its values from the roof payload.
 *
 * Sections are optional, so `error` only surfaces when an enabled section holds
 * an invalid value; a disabled section is always valid.
 */
export function CollapsibleSection({
  icon,
  title,
  enabled,
  onToggle,
  error = false,
  errorMessage = 'Complete every field in this section, or turn it off.',
  children,
  className,
}: CollapsibleSectionProps) {
  return (
    <SectionCard
      icon={icon}
      title={title}
      className={cn(error && 'border-destructive', className)}
      action={<Switch checked={enabled} onCheckedChange={onToggle} aria-label={`Toggle ${title}`} />}
    >
      {error && <ErrMsg>{errorMessage}</ErrMsg>}
      {enabled ? children : null}
    </SectionCard>
  )
}
