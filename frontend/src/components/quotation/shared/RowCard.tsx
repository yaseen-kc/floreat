import { Button } from '@/components/ui/button'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Trash2 } from 'lucide-react'

/** A single editable field within a row group — a numeric input, an enum select, or a yes/no boolean. */
export type RowField =
  | { kind: 'number'; name: string; label: string; unit: string; step?: number }
  | { kind: 'select'; name: string; label: string; options: SelectFieldOption[] }
  | { kind: 'boolean'; name: string; label: string }

/** Yes/No options for boolean fields (mapped to real booleans on change). */
const BOOL_OPTIONS: SelectFieldOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

/** A labelled sub-group of fields (e.g. Dimensions, Beams, Joints, Columns). */
export interface RowGroup {
  title: string
  fields: RowField[]
}

interface RowCardProps {
  /** Card heading, e.g. "Floor 1" or "Staircase 1". */
  title: string
  /** Optional read-only badge shown next to the title, e.g. the row `code`. */
  badge?: string
  groups: RowGroup[]
  /** Current row values keyed by field `name`. */
  values: Record<string, number | string | boolean | undefined>
  /** Emits a partial patch of changed fields. */
  onChange: (patch: Record<string, number | string | boolean | undefined>) => void
  onRemove: () => void
}

/**
 * A bordered card rendering one repeating draft row (mezzanine floor/extension,
 * stair, area deduction, …) as labelled sub-groups of optional fields, with a
 * remove button. Config-driven so every feature shares the same markup. Every
 * field is optional, so `required` and `error` are always false.
 */
export function RowCard({ title, badge, groups, values, onChange, onRemove }: RowCardProps) {
  return (
    <div className="border border-border rounded-[12px] p-[18px] max-[640px]:p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground">
          {title}
          {badge && <span className="ml-2 font-mono text-foreground">{badge}</span>}
        </span>
        <Button type="button" variant="destructive" size="icon-sm" aria-label={`Remove ${title}`} onClick={onRemove}>
          <Trash2 />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">{group.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] desktop:gap-6">
              {group.fields.map((field) =>
                field.kind === 'number' ? (
                  <NumberField
                    key={field.name}
                    label={field.label}
                    unit={field.unit}
                    step={field.step}
                    required={false}
                    error={false}
                    value={values[field.name] as number | undefined}
                    onChange={(v) => onChange({ [field.name]: v })}
                  />
                ) : field.kind === 'boolean' ? (
                  <SelectField
                    key={field.name}
                    label={field.label}
                    options={BOOL_OPTIONS}
                    required={false}
                    error={false}
                    value={
                      values[field.name] === true ? 'true' : values[field.name] === false ? 'false' : undefined
                    }
                    onChange={(v) => onChange({ [field.name]: v === '' || v === undefined ? undefined : v === 'true' })}
                  />
                ) : (
                  <SelectField
                    key={field.name}
                    label={field.label}
                    options={field.options}
                    required={false}
                    error={false}
                    value={values[field.name] as string | undefined}
                    onChange={(v) => onChange({ [field.name]: v })}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
