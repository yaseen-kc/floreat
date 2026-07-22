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
  { label: 'Project Info', sub: 'INFO' },
  { label: 'Structural Inputs', sub: 'ROOF' },
  { label: 'Mezzanine', sub: 'MEZZ' },
  { label: 'Stair', sub: 'STAIR' },
  { label: 'Canopy', sub: 'CANOPY' },
  { label: 'Accessories', sub: 'ACCESSORIES' },
  { label: 'Load', sub: 'LOAD' },
  { label: 'Joint', sub: 'JOINT' },
  { label: 'Spec', sub: 'SPEC' },
  { label: 'Rate Master', sub: 'RATE' },
  { label: 'Amount', sub: 'AMOUNT' },
  { label: 'Quantity', sub: 'QTY' },
]

/** Total number of wizard steps. */
export const STEP_COUNT = STEPS.length
