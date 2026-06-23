import { useState } from 'react'
import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Check, RotateCcw } from 'lucide-react'
import { STEPS } from '@/components/quotation/steps'

export function WizardStepper() {
  const { currentStep, goStep, validateStep, resetQuotation } = useQuotationStore(
    useShallow((s) => ({
      currentStep: s.currentStep,
      goStep: s.goStep,
      validateStep: s.validateStep,
      resetQuotation: s.resetQuotation,
    })),
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  // A step is reachable if it's already visited/current, or it's the immediate
  // next step and the current step passes validation.
  const canNavigate = (target: number) =>
    target <= currentStep || (target === currentStep + 1 && validateStep(currentStep))

  const handleClick = (target: number) => {
    if (canNavigate(target)) goStep(target)
  }

  return (
    <div className="flex items-center gap-0 px-8 py-4 bg-card border-b border-border overflow-x-auto">
      {STEPS.map((step, i) => {
        const n = i + 1
        const active = n === currentStep
        const done = n < currentStep
        const navigable = canNavigate(n)
        return (
          <div key={n} className="contents">
            {i > 0 && (
              <div className={cn('flex-1 min-w-6 h-[1.5px] mx-3', done ? 'bg-success' : 'bg-border')} />
            )}
            <button
              type="button"
              onClick={() => handleClick(n)}
              disabled={!navigable}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2.5 shrink-0',
                navigable ? 'cursor-pointer' : 'cursor-not-allowed',
              )}
            >
              <span className={cn(
                'w-[26px] h-[26px] rounded-full grid place-items-center font-mono text-xs font-semibold border-[1.5px] transition-all',
                active && 'bg-primary text-primary-foreground border-primary',
                done && 'bg-success-soft text-success border-transparent',
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

      <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)} className="ml-4 shrink-0 text-muted-foreground">
        <RotateCcw className="w-4 h-4" /> New quotation
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new quotation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard the current draft. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => resetQuotation()}>
              Discard & start new
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
