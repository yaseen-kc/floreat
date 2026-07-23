import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputUnitProps {
  /** Current value; `undefined` renders an empty input (i.e. "not provided"). */
  value: number | undefined
  /** Emits the parsed number, or `undefined` when the input is cleared. */
  onChange: (v: number | undefined) => void
  unit: string
  step?: number
  /** When true the input is non-editable (e.g. a derived/computed value). */
  readOnly?: boolean
  className?: string
  id?: string
}

/**
 * A numeric input with a unit suffix. Accepts `undefined` to render an empty
 * input and emits `undefined` when cleared, so optional roof fields can be
 * genuinely blank (and thus omitted from the payload) while required core
 * dimensions still treat a blank/zero value as invalid.
 *
 * Pass `readOnly` for derived values: the input is non-editable and emits
 * nothing.
 */
export function InputUnit({ value, onChange, unit, step = 1, readOnly = false, className, id }: InputUnitProps) {
  return (
    <div className={cn('flex', className)}>
      <Input
        id={id}
        type="number"
        value={value ?? ''}
        step={step}
        readOnly={readOnly}
        aria-readonly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        onChange={(e) => {
          if (readOnly) return
          const raw = e.target.value
          if (raw === '') return onChange(undefined)
          const parsed = parseFloat(raw)
          onChange(Number.isNaN(parsed) ? undefined : parsed)
        }}
        className={cn('rounded-r-none font-mono tabular-nums', readOnly && 'bg-muted text-muted-foreground')}
      />
      <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted text-muted-foreground text-xs font-mono min-w-[40px] justify-center">
        {unit}
      </span>
    </div>
  )
}
