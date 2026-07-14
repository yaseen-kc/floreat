import { useEffect, useState, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TextListFieldProps {
  label: string
  /** Current list value; each item renders on its own line. */
  value: string[] | undefined
  /** Emits the trimmed, blank-filtered list on every edit. */
  onChange: (v: string[]) => void
  /** Optional muted helper line rendered under the textarea. */
  hint?: ReactNode
  rows?: number
  className?: string
}

/** Splits textarea content into a trimmed, blank-line-filtered list. */
const toList = (text: string): string[] => text.split('\n').map((line) => line.trim()).filter(Boolean)

/**
 * A labelled multi-line list editor: one item per line. The emitted array is
 * always trimmed with blank lines dropped, so it satisfies the schema's
 * per-item `min(1)` rule. The two Spec string-list fields (`specifications`,
 * `makeOrBrand`) share this markup.
 *
 * The raw textarea text is held in local state so the user can freely press
 * Enter to start a new line — filtering only the *emitted* value avoids the
 * trailing-newline being swallowed by a re-join of the controlled array.
 */
export function TextListField({ label, value, onChange, hint, rows = 3, className }: TextListFieldProps) {
  const [text, setText] = useState(() => (value ?? []).join('\n'))

  // Re-sync from the store only on a genuine external change (e.g. hydration),
  // never when our own filtered output already matches — which would clobber an
  // in-progress trailing newline.
  useEffect(() => {
    const external = (value ?? []).join('\n')
    if (external !== toList(text).join('\n')) setText(external)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className={className}>
      <Label className="desktop:mb-2">{label}</Label>
      <Textarea
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onChange(toList(e.target.value))
        }}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}
