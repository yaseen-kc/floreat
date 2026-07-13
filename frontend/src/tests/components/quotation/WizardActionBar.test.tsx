import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  createMutateAsync: vi.fn(),
  updateMutateAsync: vi.fn(),
  upsertRoofMutateAsync: vi.fn(),
  upsertMezzMutateAsync: vi.fn(),
  deleteMezzMutateAsync: vi.fn(),
  upsertStairMutateAsync: vi.fn(),
  deleteStairMutateAsync: vi.fn(),
  upsertCanopyMutateAsync: vi.fn(),
  deleteCanopyMutateAsync: vi.fn(),
  upsertLoadMutateAsync: vi.fn(),
  upsertAccessoriesMutateAsync: vi.fn(),
  upsertJointMutateAsync: vi.fn(),
  createPending: false,
  updatePending: false,
  upsertRoofPending: false,
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

vi.mock('@/api/quotation/roof/postRoof', () => ({
  useUpsertRoof: () => ({ mutateAsync: mocks.upsertRoofMutateAsync, isPending: mocks.upsertRoofPending }),
}))

vi.mock('@/api/quotation/mezz/postMezz', () => ({
  useUpsertMezzanine: () => ({ mutateAsync: mocks.upsertMezzMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/mezz/deleteMezz', () => ({
  useDeleteMezzanine: () => ({ mutateAsync: mocks.deleteMezzMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/stair/postStairs', () => ({
  useUpsertStair: () => ({ mutateAsync: mocks.upsertStairMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/stair/deleteStairs', () => ({
  useDeleteStair: () => ({ mutateAsync: mocks.deleteStairMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/canopy/postCanopy', () => ({
  useUpsertCanopy: () => ({ mutateAsync: mocks.upsertCanopyMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/canopy/deleteCanopy', () => ({
  useDeleteCanopy: () => ({ mutateAsync: mocks.deleteCanopyMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/load/postLoad', () => ({
  useUpsertLoad: () => ({ mutateAsync: mocks.upsertLoadMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/accessories/postAccessories', () => ({
  useUpsertAccessories: () => ({ mutateAsync: mocks.upsertAccessoriesMutateAsync, isPending: false }),
}))

vi.mock('@/api/quotation/joint/postJoint', () => ({
  useUpsertJoint: () => ({ mutateAsync: mocks.upsertJointMutateAsync, isPending: false }),
}))

import { WizardActionBar, successToast } from '@/components/quotation/WizardActionBar'
import { useQuotationStore } from '@/stores/quotation-store'
import { validRoofDraft } from '@/tests/fixtures/roof'

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

  it('Back navigates to the previous step (two-tier bar controls stay wired)', async () => {
    fillRequired()
    useQuotationStore.setState({ currentStep: 2 })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(useQuotationStore.getState().currentStep).toBe(1)
  })
})


const fillCoreRoof = () => useQuotationStore.getState().setRoof(validRoofDraft)

describe('WizardActionBar Step 2 roof persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertRoofMutateAsync.mockReset()
    mocks.createPending = false
    mocks.updatePending = false
    mocks.upsertRoofPending = false
    // Arrive at Step 2 with a created job, as the wizard guarantees.
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 2 })
  })

  it('upserts the roof and advances to step 3 on a valid Continue', async () => {
    mocks.upsertRoofMutateAsync.mockResolvedValueOnce({ id: 'roof-1' })
    fillCoreRoof()
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(3))
    expect(mocks.upsertRoofMutateAsync).toHaveBeenCalledTimes(1)
    expect(mocks.upsertRoofMutateAsync).toHaveBeenCalledWith({
      jobId: 'job-1',
      payload: expect.objectContaining({ buildingOverallLength: 100, roofFrameBaseFixing: 'FOUNDATION_BOLT' }),
    })
    expect(mocks.toastSuccess).toHaveBeenCalledWith('Roof saved successfully')
  })

  it('does not upsert or advance when the roof is incomplete', async () => {
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(mocks.upsertRoofMutateAsync).not.toHaveBeenCalled()
    expect(useQuotationStore.getState().currentStep).toBe(2)
    expect(useQuotationStore.getState().showValidation).toBe(true)
    expect(mocks.toastError).toHaveBeenCalledWith('Please complete the required fields')
  })

  it('stays on step 2 when the roof upsert fails', async () => {
    mocks.upsertRoofMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    fillCoreRoof()
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save roof'))
    expect(useQuotationStore.getState().currentStep).toBe(2)
  })

  it('Save draft upserts the roof without advancing', async () => {
    mocks.upsertRoofMutateAsync.mockResolvedValueOnce({ id: 'roof-1' })
    fillCoreRoof()
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /save draft/i }))

    await waitFor(() => expect(mocks.upsertRoofMutateAsync).toHaveBeenCalledTimes(1))
    expect(useQuotationStore.getState().currentStep).toBe(2)
  })
})

describe('WizardActionBar Step 3 mezzanine persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertMezzMutateAsync.mockReset()
    mocks.deleteMezzMutateAsync.mockReset()
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 3 })
  })

  it('upserts the mezzanine and advances to step 4 when the toggle is on', async () => {
    mocks.upsertMezzMutateAsync.mockResolvedValueOnce({ id: 'mezz-1' })
    useQuotationStore.getState().setHasMezzanine(true)
    useQuotationStore.getState().setMezzanine({ floors: [{ code: 'MEZ-1', lengthM: 12 }] })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(4))
    expect(mocks.upsertMezzMutateAsync).toHaveBeenCalledWith({
      jobId: 'job-1',
      payload: { floors: [{ code: 'MEZ-1', lengthM: 12 }] },
    })
    expect(mocks.deleteMezzMutateAsync).not.toHaveBeenCalled()
  })

  it('deletes any existing mezzanine and advances when the toggle is off', async () => {
    mocks.deleteMezzMutateAsync.mockResolvedValueOnce(undefined)
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(4))
    expect(mocks.deleteMezzMutateAsync).toHaveBeenCalledWith('job-1')
    expect(mocks.upsertMezzMutateAsync).not.toHaveBeenCalled()
  })

  it('stays on step 3 when the mezzanine upsert fails', async () => {
    mocks.upsertMezzMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    useQuotationStore.getState().setHasMezzanine(true)
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save mezzanine'))
    expect(useQuotationStore.getState().currentStep).toBe(3)
  })
})


describe('WizardActionBar Step 4 stair persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertStairMutateAsync.mockReset()
    mocks.deleteStairMutateAsync.mockReset()
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 4 })
  })

  it('upserts the stair and advances to step 5 when the toggle is on', async () => {
    mocks.upsertStairMutateAsync.mockResolvedValueOnce({ id: 'stair-1' })
    useQuotationStore.getState().setHasStair(true)
    useQuotationStore.getState().setStair({ stairs: [{ code: 'STAIR-1', length: 12 }] })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(5))
    expect(mocks.upsertStairMutateAsync).toHaveBeenCalledWith({
      jobId: 'job-1',
      payload: { stairs: [{ code: 'STAIR-1', length: 12 }] },
    })
    expect(mocks.deleteStairMutateAsync).not.toHaveBeenCalled()
  })

  it('deletes any existing stair and advances when the toggle is off', async () => {
    mocks.deleteStairMutateAsync.mockResolvedValueOnce(undefined)
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(5))
    expect(mocks.deleteStairMutateAsync).toHaveBeenCalledWith('job-1')
    expect(mocks.upsertStairMutateAsync).not.toHaveBeenCalled()
  })

  it('stays on step 4 when the stair upsert fails', async () => {
    mocks.upsertStairMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    useQuotationStore.getState().setHasStair(true)
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save stair'))
    expect(useQuotationStore.getState().currentStep).toBe(4)
  })
})


describe('WizardActionBar Step 6 accessories persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertAccessoriesMutateAsync.mockReset()
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 6 })
  })

  it('upserts the accessories and advances to step 7 on Continue', async () => {
    mocks.upsertAccessoriesMutateAsync.mockResolvedValueOnce({ id: 'acc-1' })
    useQuotationStore.getState().setAccessories({ gutterType: 'PPGL' })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(7))
    expect(mocks.upsertAccessoriesMutateAsync).toHaveBeenCalledWith({
      jobId: 'job-1',
      payload: { gutterType: 'PPGL' },
    })
    expect(mocks.toastSuccess).toHaveBeenCalledWith('Accessories saved successfully')
  })

  it('upserts an empty payload for a blank draft and still advances', async () => {
    mocks.upsertAccessoriesMutateAsync.mockResolvedValueOnce({ id: 'acc-1' })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(7))
    expect(mocks.upsertAccessoriesMutateAsync).toHaveBeenCalledWith({ jobId: 'job-1', payload: {} })
  })

  it('stays on step 6 when the accessories upsert fails', async () => {
    mocks.upsertAccessoriesMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save accessories'))
    expect(useQuotationStore.getState().currentStep).toBe(6)
  })
})


describe('WizardActionBar Step 7 load persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertLoadMutateAsync.mockReset()
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 7 })
  })

  it('upserts the load and advances to step 8 (Joint) without finalising', async () => {
    mocks.upsertLoadMutateAsync.mockResolvedValueOnce({ id: 'load-1' })
    useQuotationStore.getState().setLoad({ snowLoad: 1.2 })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(useQuotationStore.getState().currentStep).toBe(8))
    expect(mocks.upsertLoadMutateAsync).toHaveBeenCalledWith({ jobId: 'job-1', payload: { snowLoad: 1.2 } })
    expect(mocks.navigate).not.toHaveBeenCalled()
  })

  it('stays on step 7 when the load upsert fails', async () => {
    mocks.upsertLoadMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save load'))
    expect(useQuotationStore.getState().currentStep).toBe(7)
  })
})


describe('WizardActionBar Step 8 joint finalise', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.navigate.mockReset()
    mocks.toastSuccess.mockReset()
    mocks.toastError.mockReset()
    mocks.upsertJointMutateAsync.mockReset()
    useQuotationStore.getState().setJobId('job-1')
    useQuotationStore.setState({ currentStep: 8 })
  })

  it('upserts the joint, finalises and navigates home on Finish & save', async () => {
    mocks.upsertJointMutateAsync.mockResolvedValueOnce({ id: 'joint-1' })
    useQuotationStore.getState().setJoint({ canopyBoltDiameter: 16 })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /finish & save/i }))

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/'))
    expect(mocks.upsertJointMutateAsync).toHaveBeenCalledWith({
      jobId: 'job-1',
      payload: { canopyBoltDiameter: 16 },
    })
    // resetQuotation returns the wizard to step 1.
    expect(useQuotationStore.getState().currentStep).toBe(1)
  })

  it('upserts an empty payload for a blank draft and still finalises', async () => {
    mocks.upsertJointMutateAsync.mockResolvedValueOnce({ id: 'joint-1' })
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /finish & save/i }))

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/'))
    expect(mocks.upsertJointMutateAsync).toHaveBeenCalledWith({ jobId: 'job-1', payload: {} })
  })

  it('stays on step 8 and does not navigate when the joint upsert fails', async () => {
    mocks.upsertJointMutateAsync.mockRejectedValueOnce(new Error('API error: 500'))
    render(<WizardActionBar />)

    await userEvent.click(screen.getByRole('button', { name: /finish & save/i }))

    await waitFor(() => expect(mocks.toastError).toHaveBeenCalledWith('Failed to save joint'))
    expect(useQuotationStore.getState().currentStep).toBe(8)
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})


describe('successToast small-device guard', () => {
  beforeEach(() => {
    mocks.toastSuccess.mockReset()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fires toast.success on non-small (>640px) devices', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    successToast('Saved')
    expect(mocks.toastSuccess).toHaveBeenCalledWith('Saved')
  })

  it('stays silent on small (≤640px) devices', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    successToast('Saved')
    expect(mocks.toastSuccess).not.toHaveBeenCalled()
  })
})
