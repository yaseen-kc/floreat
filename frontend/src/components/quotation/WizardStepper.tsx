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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, ChevronDown, RotateCcw } from 'lucide-react'
import { STEPS, STEP_COUNT } from '@/components/quotation/steps'

// Static per-step fill widths for the mobile progress bar. Kept as literal
// class strings (not built at runtime) so Tailwind's JIT emits them. Indexed by
// currentStep - 1; the last step fills the track completely.
const PROGRESS_WIDTHS = ['w-[9%]', 'w-[18%]', 'w-[27%]', 'w-[36%]', 'w-[45%]', 'w-[54%]', 'w-[63%]', 'w-[72%]', 'w-[81%]', 'w-[90%]', 'w-full']

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

  const currentLabel = STEPS[currentStep - 1]?.label

  return (
    <div className="bg-card border-b border-border">
      {/* Desktop / tablet (≥641px): the full dot rail. */}
      <div className="hidden min-[641px]:flex items-start gap-0 px-8 py-4 overflow-x-auto">
        {STEPS.map((step, i) => {
          const n = i + 1
          const active = n === currentStep
          const done = n < currentStep
          const navigable = canNavigate(n)
          return (
            <div key={n} className="contents">
              {i > 0 && (
                <div className={cn('flex-1 min-w-6 h-[1.5px] mx-3 mt-[12px]', done ? 'bg-success' : 'bg-border')} />
              )}
              <button
                type="button"
                onClick={() => handleClick(n)}
                disabled={!navigable}
                aria-label={step.label}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex flex-col items-center text-center gap-1.5 shrink-0 w-16',
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
                <small className={cn(
                  'text-[11px] font-mono leading-tight',
                  active ? 'text-foreground' : done ? 'text-foreground/70' : 'text-muted-foreground',
                )}>
                  {step.sub}
                </small>
              </button>
            </div>
          )
        })}

        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)} className="ml-4 shrink-0 mt-[3px] text-muted-foreground">
          <RotateCcw className="w-4 h-4" /> New quotation
        </Button>
      </div>

      {/* Mobile (≤640px): a compact "Step N of 7 · Label" header with a tappable
          step-picker, an icon-only reset, and a progress bar. */}
      <div className="min-[641px]:hidden px-4 py-3">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Select step"
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left"
              >
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  Step {currentStep} of {STEP_COUNT}
                </span>
                <span className="truncate text-sm font-medium text-foreground">· {currentLabel}</span>
                <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-w-xs">
              {STEPS.map((step, i) => {
                const n = i + 1
                const active = n === currentStep
                return (
                  <DropdownMenuItem
                    key={n}
                    disabled={!canNavigate(n)}
                    onSelect={() => handleClick(n)}
                    className={cn(active && 'bg-accent')}
                  >
                    <span className="w-5 shrink-0 font-mono text-xs text-muted-foreground">{n}</span>
                    <span className="flex-1">{step.label}</span>
                    {active && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reset"
            onClick={() => setConfirmOpen(true)}
            className="shrink-0 text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border">
          <div className={cn('h-full rounded-full bg-primary transition-all duration-250 ease-(--ease)', PROGRESS_WIDTHS[currentStep - 1])} />
        </div>
      </div>

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
