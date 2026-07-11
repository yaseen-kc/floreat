import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WizardStepper } from '@/components/quotation/WizardStepper'
import { useQuotationStore } from '@/stores/quotation-store'

const fillRequired = () =>
  useQuotationStore.getState().setProjectInfo({
    projectNo: 'P-001',
    subject: 'Subject',
    refNo: 'REF-001',
    date: '2026-01-01',
    designedByName: 'John',
    designedByMobile: '1234567890',
    clientName: 'Acme',
    estimationEngineerName: 'Jane',
    estimationEngineerMobile: '0987654321',
    headOfSalesName: 'Sam',
    headOfSalesMobile: '5555555555',
    firmName: 'Acme Co',
    buildingUsage: 'Commercial',
    numberOfBuilding: 1,
    frameType: 'Steel',
    configuration: 'Standard',
  })

describe('WizardStepper', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
  })

  it('marks the current step with aria-current="step"', () => {
    render(<WizardStepper />)
    expect(screen.getByRole('button', { name: /Project Info/i })).toHaveAttribute('aria-current', 'step')
    expect(screen.getByRole('button', { name: /Structural Inputs/i })).not.toHaveAttribute('aria-current')
  })

  it('disables unreachable future steps', () => {
    render(<WizardStepper />)
    // Step 3+ is never immediately reachable from step 1.
    expect(screen.getByRole('button', { name: /Mezzanine/i })).toBeDisabled()
    // Step 2 is disabled while step 1 is invalid.
    expect(screen.getByRole('button', { name: /Structural Inputs/i })).toBeDisabled()
  })

  it('clicking a disabled far-future step is a no-op', async () => {
    render(<WizardStepper />)
    await userEvent.click(screen.getByRole('button', { name: /Load/i }))
    expect(useQuotationStore.getState().currentStep).toBe(1)
  })

  it('allows advancing to the next step once step 1 is valid', async () => {
    fillRequired()
    render(<WizardStepper />)
    const next = screen.getByRole('button', { name: /Structural Inputs/i })
    expect(next).not.toBeDisabled()
    await userEvent.click(next)
    expect(useQuotationStore.getState().currentStep).toBe(2)
  })

  it('confirming the New quotation dialog resets the draft', async () => {
    fillRequired()
    useQuotationStore.getState().goStep(2)
    render(<WizardStepper />)

    await userEvent.click(screen.getByRole('button', { name: /New quotation/i }))

    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByText('Start a new quotation?')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: /Discard & start new/i }))

    const s = useQuotationStore.getState()
    expect(s.currentStep).toBe(1)
    expect(s.projectInfo.projectNo).toBe('')
  })

  it('cancelling the New quotation dialog keeps the draft', async () => {
    fillRequired()
    useQuotationStore.getState().goStep(2)
    render(<WizardStepper />)

    await userEvent.click(screen.getByRole('button', { name: /New quotation/i }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: /Cancel/i }))

    expect(useQuotationStore.getState().currentStep).toBe(2)
    expect(useQuotationStore.getState().projectInfo.projectNo).toBe('P-001')
  })

  // Compact mobile stepper: the "Select step" dropdown mirrors the desktop
  // dots' navigation gating (canNavigate) and jumps via goStep.
  describe('mobile step-picker', () => {
    it('lists every step and gates unreachable ones', async () => {
      render(<WizardStepper />)
      await userEvent.click(screen.getByRole('button', { name: /Select step/i }))

      const items = await screen.findAllByRole('menuitem')
      expect(items).toHaveLength(7)

      // From an invalid step 1: step 1 itself is reachable, step 2+ are not.
      expect(items[0]).not.toHaveAttribute('aria-disabled', 'true')
      expect(items[1]).toHaveAttribute('aria-disabled', 'true')
      expect(items[6]).toHaveAttribute('aria-disabled', 'true')
    })

    it('jumps to an allowed step via goStep', async () => {
      fillRequired()
      render(<WizardStepper />)
      await userEvent.click(screen.getByRole('button', { name: /Select step/i }))

      const next = await screen.findByRole('menuitem', { name: /Structural Inputs/i })
      expect(next).not.toHaveAttribute('aria-disabled', 'true')
      await userEvent.click(next)

      expect(useQuotationStore.getState().currentStep).toBe(2)
    })

    it('selecting a disabled far-future step is a no-op', async () => {
      render(<WizardStepper />)
      await userEvent.click(screen.getByRole('button', { name: /Select step/i }))

      const load = await screen.findByRole('menuitem', { name: /Load/i })
      await userEvent.click(load)
      expect(useQuotationStore.getState().currentStep).toBe(1)
    })
  })
})
