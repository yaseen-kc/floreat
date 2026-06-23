import { Check } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useSaveStatusStore } from '@/stores/save-status-store'
import { cn } from '@/lib/utils'

/**
 * Topbar save-status pill (DESIGN.md §7.5). Idle renders nothing; saving shows
 * a spinner in warn tones; saved shows a check in success tones. Color/icon are
 * driven entirely by the store's `status`.
 */
export function SaveStatus() {
  const status = useSaveStatusStore((s) => s.status)
  const message = useSaveStatusStore((s) => s.message)

  if (status === 'idle') return null

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-4xl border px-2.5 py-1 font-mono text-xs',
        status === 'saving' && 'border-warn/30 bg-warn-soft text-warn',
        status === 'saved' && 'border-success/30 bg-success-soft text-success',
      )}
    >
      {status === 'saving' ? (
        <Spinner className="size-3" />
      ) : (
        <Check className="size-3" />
      )}
      {message}
    </span>
  )
}
