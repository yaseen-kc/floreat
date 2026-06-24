import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ userId: null as string | null }))

vi.mock('@clerk/react', () => ({
  useAuth: () => ({ userId: mocks.userId }),
}))

import { useDraftPersistenceScope } from '@/hooks/useDraftPersistenceScope'
import { useQuotationStore } from '@/stores/quotation-store'

const seed = (key: string, projectNo: string, jobId: string | null) => {
  const base = useQuotationStore.getState().projectInfo
  localStorage.setItem(
    key,
    JSON.stringify({ state: { projectInfo: { ...base, projectNo }, currentStep: 2, jobId }, version: 1 }),
  )
}

describe('useDraftPersistenceScope', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.persist.setOptions({ name: 'Floreat:draft' })
    useQuotationStore.getState().resetQuotation()
    mocks.userId = null
  })

  it('rehydrates the signed-in user\'s saved draft (including jobId)', async () => {
    seed('Floreat:draft:userX', 'P-X', 'job-X')
    mocks.userId = 'userX'

    renderHook(() => useDraftPersistenceScope())

    await waitFor(() => expect(useQuotationStore.getState().jobId).toBe('job-X'))
    expect(useQuotationStore.getState().projectInfo.projectNo).toBe('P-X')
  })

  it('starts clean for a user with no saved draft', async () => {
    // Leftover in-memory state from a prior session.
    useQuotationStore.getState().setProjectInfo({ projectNo: 'STALE' })
    useQuotationStore.getState().setJobId('stale-job')
    mocks.userId = 'freshUser'

    renderHook(() => useDraftPersistenceScope())

    await waitFor(() => expect(useQuotationStore.getState().projectInfo.projectNo).toBe(''))
    expect(useQuotationStore.getState().jobId).toBeNull()
  })

  it('does nothing while signed out (no userId)', () => {
    mocks.userId = null
    renderHook(() => useDraftPersistenceScope())
    // No throw, store untouched at defaults.
    expect(useQuotationStore.getState().projectInfo.projectNo).toBe('')
  })
})
