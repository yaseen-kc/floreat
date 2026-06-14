/**
 * Single source of truth for the wizard's step metadata.
 * Consumed by both the WizardStepper (full label + subtitle) and the
 * WizardActionBar (label only), so the two can never drift.
 */
export interface WizardStep {
  /** Display name shown in the stepper and action bar. */
  label: string
  /** Short uppercase subtitle shown under the label in the stepper. */
  sub: string
}

export const STEPS: WizardStep[] = [
  { label: 'Project Info', sub: 'CLIENT & SITE' },
  { label: 'Structural Inputs', sub: 'GEOMETRY' },
  { label: 'Calc Engine', sub: 'FORMULAS' },
  { label: 'Pricing', sub: 'COST BREAKDOWN' },
  { label: 'Review', sub: 'GENERATE' },
]

/** Total number of wizard steps. */
export const STEP_COUNT = STEPS.length
