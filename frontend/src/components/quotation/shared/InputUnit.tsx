import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputUnitProps {
  value: number
  onChange: (v: number) => void
  unit: string
  step?: number
  className?: string
}

export function InputUnit({ value, onChange, unit, step = 1, className }: InputUnitProps) {
  return (
    <div className={cn('flex', className)}>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="rounded-r-none font-mono tabular-nums"
      />
      <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted text-muted-foreground text-xs font-mono min-w-[40px] justify-center">
        {unit}
      </span>
    </div>
  )
}
