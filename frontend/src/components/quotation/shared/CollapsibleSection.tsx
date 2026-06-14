import type { ReactNode } from 'react'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Switch } from '@/components/ui/switch'

interface CollapsibleSectionProps {
  icon: ReactNode
  title: string
  /** Whether the section body is shown and its fields are part of the payload. */
  enabled: boolean
  /** Fired with the next enabled state when the toggle is flipped. */
  onToggle: (enabled: boolean) => void
  children: ReactNode
  className?: string
}

/**
 * An optional roof section: a {@link SectionCard} with a toggle switch in its
 * action slot. The body (and therefore the section's fields) only renders when
 * `enabled`, so disabling a section both hides it and — paired with the store's
 * field-clearing — drops its values from the roof payload.
 */
export function CollapsibleSection({
  icon,
  title,
  enabled,
  onToggle,
  children,
  className,
}: CollapsibleSectionProps) {
  return (
    <SectionCard
      icon={icon}
      title={title}
      className={className}
      action={<Switch checked={enabled} onCheckedChange={onToggle} aria-label={`Toggle ${title}`} />}
    >
      {enabled ? children : null}
    </SectionCard>
  )
}
