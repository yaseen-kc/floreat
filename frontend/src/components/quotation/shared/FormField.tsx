import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A labelled text input with a schema-driven required marker and inline error.
 * Shared by the Step 1 sections so the markup and error styling stay identical.
 */
export function Field({
  label,
  value,
  error,
  required,
  onChange,
}: {
  label: string
  value: string
  error: boolean
  required: boolean
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className={cn(error && 'border-destructive')} />
      {error && <ErrMsg>{label} is required</ErrMsg>}
    </div>
  )
}

/** Inline validation message with a warning icon. */
export function ErrMsg({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-xs text-destructive mt-1">
      <CircleAlert className="w-3 h-3" /> {children}
    </span>
  )
}
