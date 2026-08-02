import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
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
import { STEPS, STEP_COUNT, FREE_NAV_FIRST_STEP, FREE_NAV_LAST_STEP } from '@/components/quotation/steps'

// Static per-step fill widths for the mobile progress bar. Kept as literal
// class strings (not built at runtime) so Tailwind's JIT emits them. Indexed by
// currentStep - 1; the last step fills the track completely.
const PROGRESS_WIDTHS = ['w-[8%]', 'w-[15%]', 'w-[23%]', 'w-[31%]', 'w-[38%]', 'w-[46%]', 'w-[54%]', 'w-[62%]', 'w-[69%]', 'w-[77%]', 'w-[85%]', 'w-[92%]', 'w-full']

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

  // Steps 1–2 are the required foundation: they create the job and roof records
  // every later step upserts against, so the optional middle steps only unlock
  // once both validate.
  const foundationComplete = validateStep(1) && validateStep(2)
  const currentStepValid = validateStep(currentStep)

  /**
   * A step is reachable when it is already visited/current, when it is the
   * immediate next step and the current step validates, or when it sits inside
   * the free-navigation range and the foundation steps are complete.
   */
  const canNavigate = (target: number) =>
    target <= currentStep ||
    (target === currentStep + 1 && currentStepValid) ||
    (foundationComplete && target >= FREE_NAV_FIRST_STEP && target <= FREE_NAV_LAST_STEP)

  const handleClick = (target: number) => {
    if (canNavigate(target)) goStep(target)
  }

  const currentLabel = STEPS[currentStep - 1]?.label

  useHotkeys(['ctrl+right', 'meta+right'], () => {
    const target = currentStep + 1
    if (target <= STEP_COUNT && canNavigate(target)) goStep(target)
  }, { preventDefault: true }, [currentStep, currentStepValid, foundationComplete])

  useHotkeys(['ctrl+left', 'meta+left'], () => {
    if (currentStep > 1) goStep(currentStep - 1)
  }, { preventDefault: true }, [currentStep])

  // Reserve the shortcut for quotation search until its UI is available.
  useHotkeys(['ctrl+k', 'meta+k'], () => {}, { preventDefault: true })

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
