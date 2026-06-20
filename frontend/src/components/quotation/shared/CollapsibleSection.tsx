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
   * When true, the card is flagged as invalid (destructive border + message),
   * even while collapsed. Used for required sections the user must enable and
   * complete before Step 2 validates.
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
 * When `error` is set the card is visibly flagged regardless of `enabled`, so a
 * required section that is left disabled (and therefore incomplete) still
 * surfaces a prompt instead of silently blocking the wizard.
 */
export function CollapsibleSection({
  icon,
  title,
  enabled,
  onToggle,
  error = false,
  errorMessage = 'This section is required — enable it and complete all fields.',
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
