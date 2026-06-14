import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  createMutateAsync: vi.fn(),
  updateMutateAsync: vi.fn(),
  createPending: false,
  updatePending: false,
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}))

vi.mock('sonner', () => ({
  toast: { success: mocks.toastSuccess, error: mocks.toastError },
}))

vi.mock('@/api/quotation/jobs/postJobs', () => ({
  useCreateJob: () => ({ mutateAsync: mocks.createMutateAsync, isPending: mocks.createPending }),
}))

vi.mock('@/api/quotation/jobs/putJobs', () => ({
  useUpdateJob: () => ({ mutateAsync: mocks.updateMutateAsync, isPending: mocks.updatePending }),
}))

import { WizardActionBar } from '@/components/quotation/WizardActionBar'
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

describe('WizardActionBar Step 1 flow', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.createMutateAsync.mockReset()
    mocks.updateMutateAsync.mockReset()
    mocks.createPending = false
    mocks.updatePending = false
  })

  it('creates the job and advances to step 2 on success (no navigation away)', async () => {
    mocks.createMutateAsync.mockResolvedValueOnce({ id: 'job-1' })
    fillRequired()
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(2))
    expect(mocks.createMutateAsync).toHaveBeenCalledTimes(1)
    expect(useQuotationStore.getState().jobId).toBe('job-1')
    expect(mocks.navigate).not.toHaveBeenCalled()
    expect(mocks.toastSuccess).toHaveBeenCalledWith('Job created successfully')
  })

  it('does not submit or advance when required fields are missing', async () => {
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(mocks.createMutateAsync).not.toHaveBeenCalled()
    expect(useQuotationStore.getState().currentStep).toBe(1)
    expect(useQuotationStore.getState().showValidation).toBe(true)
    expect(mocks.toastError).toHaveBeenCalledWith('Please complete the required fields')
  })

  it('stays on step 1 when job creation fails', async () => {
    mocks.createMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    fillRequired()
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to create job'))
    expect(useQuotationStore.getState().currentStep).toBe(1)
    expect(useQuotationStore.getState().jobId).toBeNull()
    expect(mocks.navigate).not.toHaveBeenCalled()
  })

  it('updates (not creates) when a jobId already exists', async () => {
    mocks.updateMutateAsync.mockResolvedValueOnce({ id: 'job-1' })
    fillRequired()
    useQuotationStore.getState().setJobId('job-1')
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.updateMutateAsync).toHaveBeenCalledTimes(1))
    expect(mocks.createMutateAsync).not.toHaveBeenCalled()
    expect(mocks.updateMutateAsync).toHaveBeenCalledWith(expect.objectContaining({ id: 'job-1' }))
    expect(useQuotationStore.getState().currentStep).toBe(2)
  })

  it('shows a spinner and disables the action buttons while submitting', () => {
    mocks.createPending = true
    fillRequired()
    render(<WizardActionBar />)

    // Spinner uses role="status" (aria-label "Loading").
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /save draft/i })).toBeDisabled()
  })
})
