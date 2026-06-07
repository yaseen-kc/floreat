import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OutputRow {
  label: string
  deps: string
  value: string
  unit: string
}

interface CalcCardProps {
  title: string
  icon: ReactNode
  formulaLines: string[]
  formulaNote?: string
  outputs: OutputRow[]
  showFormula: boolean
  onToggleFormula: () => void
  hasError?: boolean
}

export function CalcCard({ title, icon, formulaLines, formulaNote, outputs, showFormula, onToggleFormula, hasError }: CalcCardProps) {
  return (
    <div className={cn('border rounded-[11px] bg-card mb-3 overflow-hidden', hasError ? 'border-destructive' : 'border-border')}>
      <button type="button" onClick={onToggleFormula} className="flex items-center justify-between w-full p-3 px-3.5 cursor-pointer">
        <span className="text-[13px] font-semibold flex items-center gap-2">
          <span className="w-[22px] h-[22px] rounded-[6px] bg-primary/10 text-primary grid place-items-center [&_svg]:w-[13px] [&_svg]:h-[13px]">{icon}</span>
          {title}
        </span>
        <span className="text-[11.5px] font-mono text-muted-foreground">formula ▾</span>
      </button>

      {showFormula && (
        <div className="mx-3.5 mb-3 p-[11px] px-[13px] bg-muted/50 rounded-lg border border-dashed border-border">
          {formulaLines.map((line, i) => (
            <code key={i} className="block font-mono text-xs leading-[1.7] text-foreground" dangerouslySetInnerHTML={{ __html: line }} />
          ))}
          {formulaNote && <div className="text-[11px] text-muted-foreground mt-[7px]">{formulaNote}</div>}
        </div>
      )}

      <div className="flex flex-col gap-px px-3.5 pb-3">
        {outputs.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-t border-border/50 first:border-t-0">
            <span className="text-[13px] text-foreground/70 flex flex-col gap-0.5">
              {row.label}
              <span className="text-[10.5px] text-muted-foreground font-mono">depends on <DepHighlight text={row.deps} /></span>
            </span>
            <FlashValue value={row.value} unit={row.unit} />
          </div>
        ))}
      </div>
    </div>
  )
}

function DepHighlight({ text }: { text: string }) {
  const parts = text.split(', ')
  return <>{parts.map((p, i) => <span key={i}>{i > 0 && ', '}<b className="text-primary font-medium">{p}</b></span>)}</>
}

function FlashValue({ value, unit }: { value: string; unit: string }) {
  const [flash, setFlash] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 1100)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span className={cn(
      'font-mono tabular-nums text-[15px] font-semibold whitespace-nowrap px-[7px] py-0.5 rounded-md transition-colors',
      flash && 'animate-pulse bg-primary/10'
    )}>
      {value}<small className="text-muted-foreground font-normal text-[11px] ml-0.5">{unit}</small>
    </span>
  )
}
