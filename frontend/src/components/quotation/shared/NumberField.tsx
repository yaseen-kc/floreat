import { Label } from '@/components/ui/label'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { ErrMsg } from '@/components/quotation/shared/FormField'
import { cn } from '@/lib/utils'

interface NumberFieldProps {
  label: string
  value: number
  unit: string
  required: boolean
  error: boolean
  step?: number
  onChange: (v: number) => void
  className?: string
}

/**
 * A labelled numeric input with a unit suffix, a schema-driven required marker,
 * and an inline error — the numeric counterpart to {@link Field}. Composes the
 * shared {@link InputUnit} so the markup and error styling stay identical to the
 * Step 1 text fields.
 */
export function NumberField({
  label,
  value,
  unit,
  required,
  error,
  step,
  onChange,
  className,
}: NumberFieldProps) {
  return (
    <div className={className}>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <InputUnit
        value={value}
        unit={unit}
        step={step}
        onChange={onChange}
        className={cn(error && '[&_input]:border-destructive')}
      />
      {error && <ErrMsg>{label} is required</ErrMsg>}
    </div>
  )
}
