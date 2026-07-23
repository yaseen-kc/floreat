import { useId } from 'react'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { ErrMsg } from '@/components/quotation/shared/FormField'
import { cn } from '@/lib/utils'

interface NumberFieldProps {
  label: string
  /** Current value; `undefined` renders an empty input (optional fields). */
  value: number | undefined
  unit: string
  required: boolean
  error: boolean
  step?: number
  /** Emits the parsed number, or `undefined` when the input is cleared. */
  onChange: (v: number | undefined) => void
  /**
   * When true the field is non-editable (a derived/computed value). The
   * required marker, error message and `onChange` are suppressed.
   */
  readOnly?: boolean
  /** Optional muted helper line rendered under the input (hidden while an error shows). */
  hint?: ReactNode
  className?: string
}

/**
 * A labelled numeric input with a unit suffix, a schema-driven required marker,
 * and an inline error — the numeric counterpart to {@link Field}. Composes the
 * shared {@link InputUnit} so the markup and error styling stay identical to the
 * Step 1 text fields. Accepts/emits `undefined` so optional roof fields can be
 * left blank (and omitted from the payload). Pass `readOnly` to display a
 * derived value the user cannot edit.
 */
export function NumberField({
  label,
  value,
  unit,
  required,
  error,
  step,
  onChange,
  readOnly = false,
  hint,
  className,
}: NumberFieldProps) {
  const id = useId()
  return (
    <div className={className}>
      <Label htmlFor={id} className="desktop:mb-2">{label} {required && !readOnly && <span className="text-destructive">*</span>}</Label>
      <InputUnit
        id={id}
        value={value}
        unit={unit}
        step={step}
        readOnly={readOnly}
        onChange={onChange}
        className={cn(error && !readOnly && '[&_input]:border-destructive')}
      />
      {error && !readOnly && <ErrMsg>{label} is required</ErrMsg>}
      {hint && !(error && !readOnly) && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}
