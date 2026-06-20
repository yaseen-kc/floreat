import { Label } from '@/components/ui/label'
import { ErrMsg } from '@/components/quotation/shared/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/** A single selectable option for {@link SelectField}. */
export interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  /** Current value; `undefined`/`''` renders the placeholder. */
  value: string | undefined
  options: SelectFieldOption[]
  required: boolean
  error: boolean
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}

/**
 * A labelled enum select with a schema-driven required marker and inline error —
 * the dropdown counterpart to {@link Field}/{@link NumberField}. Shared across
 * the roof sections so every enum field renders identically.
 */
export function SelectField({
  label,
  value,
  options,
  required,
  error,
  placeholder = 'Select an option',
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className={className}>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="w-full" aria-invalid={error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <ErrMsg>{label} is required</ErrMsg>}
    </div>
  )
}
