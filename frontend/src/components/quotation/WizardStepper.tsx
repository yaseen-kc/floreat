import { useQuotationStore } from '@/stores/quotation-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, RotateCcw } from 'lucide-react'

const STEPS = [
  { label: 'Project Info', sub: 'CLIENT & SITE' },
  { label: 'Structural Inputs', sub: 'GEOMETRY' },
  { label: 'Calc Engine', sub: 'FORMULAS' },
  { label: 'Pricing', sub: 'COST BREAKDOWN' },
  { label: 'Review', sub: 'GENERATE' },
]

export function WizardStepper() {
  const { currentStep, goStep, validateStep, resetQuotation } = useQuotationStore()

  const handleClick = (target: number) => {
    if (target <= currentStep) { goStep(target); return }
    if (target === currentStep + 1 && validateStep(currentStep)) goStep(target)
  }

  const handleNewQuotation = () => {
    if (window.confirm('Start a new quotation? This will discard the current draft.')) {
      resetQuotation()
    }
  }

  return (
    <div className="flex items-center gap-0 px-8 py-4 bg-card border-b border-border overflow-x-auto">
      {STEPS.map((step, i) => {
        const n = i + 1
        const active = n === currentStep
        const done = n < currentStep
        return (
          <div key={n} className="contents">
            {i > 0 && (
              <div className={cn('flex-1 min-w-6 h-[1.5px] mx-3', done ? 'bg-emerald-500' : 'bg-border')} />
            )}
            <button
              type="button"
              onClick={() => handleClick(n)}
              className="flex items-center gap-2.5 shrink-0 cursor-pointer"
            >
              <span className={cn(
                'w-[26px] h-[26px] rounded-full grid place-items-center font-mono text-xs font-semibold border-[1.5px] transition-all',
                active && 'bg-primary text-primary-foreground border-primary',
                done && 'bg-emerald-500/15 text-emerald-600 border-transparent',
                !active && !done && 'bg-muted text-muted-foreground border-border',
              )}>
                {done ? <Check className="w-3.5 h-3.5" /> : n}
              </span>
              <span className="flex flex-col leading-tight">
                <b className={cn('text-[13.5px] font-semibold', active ? 'text-foreground' : done ? 'text-foreground/70' : 'text-muted-foreground')}>
                  {step.label}
                </b>
                <small className="text-[11px] text-muted-foreground font-mono">{step.sub}</small>
              </span>
            </button>
          </div>
        )
      })}
      <Button variant="ghost" size="sm" onClick={handleNewQuotation} className="ml-4 shrink-0 text-muted-foreground">
        <RotateCcw className="w-4 h-4" /> New quotation
      </Button>
    </div>
  )
}
