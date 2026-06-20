import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputUnitProps {
  /** Current value; `undefined` renders an empty input (i.e. "not provided"). */
  value: number | undefined
  /** Emits the parsed number, or `undefined` when the input is cleared. */
  onChange: (v: number | undefined) => void
  unit: string
  step?: number
  className?: string
}

/**
 * A numeric input with a unit suffix. Accepts `undefined` to render an empty
 * input and emits `undefined` when cleared, so optional roof fields can be
 * genuinely blank (and thus omitted from the payload) while required core
 * dimensions still treat a blank/zero value as invalid.
 */
export function InputUnit({ value, onChange, unit, step = 1, className }: InputUnitProps) {
  return (
    <div className={cn('flex', className)}>
      <Input
        type="number"
        value={value ?? ''}
        step={step}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '') return onChange(undefined)
          const parsed = parseFloat(raw)
          onChange(Number.isNaN(parsed) ? undefined : parsed)
        }}
        className="rounded-r-none font-mono tabular-nums"
      />
      <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted text-muted-foreground text-xs font-mono min-w-[40px] justify-center">
        {unit}
      </span>
    </div>
  )
}
