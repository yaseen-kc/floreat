import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/lib/api'
import { updateJob } from '@/api/quotation/jobs/putJobs'
import type { UpdateJobPayload } from '@/api/quotation/jobs/putJobs'

const mockedApiFetch = vi.mocked(apiFetch)

const payload: UpdateJobPayload = {
  projectNo: 'P-001',
  subject: 'Test Subject',
  refNo: 'REF-001',
  date: '2026-01-01',
  designedByName: 'John',
  designedByMobile: '1234567890',
  buildingUsage: 'Commercial',
  numberOfBuilding: 1,
  frameType: 'Steel',
  configuration: 'Standard',
}

describe('updateJob', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset()
  })

  it('calls apiFetch with PUT method and correct path', async () => {
    const job = { id: 'job-1', ...payload, createdAt: '', updatedAt: '' }
    mockedApiFetch.mockResolvedValueOnce(job)

    const result = await updateJob('token-123', 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', 'token-123', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    expect(result).toEqual(job)
  })

  it('forwards a null token', async () => {
    mockedApiFetch.mockResolvedValueOnce({})

    await updateJob(null, 'job-1', payload)

    expect(mockedApiFetch).toHaveBeenCalledWith('/api/jobs/job-1', null, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  })

  it('propagates errors thrown by the API layer', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('API error: 404'))

    await expect(updateJob('token', 'bad-id', payload)).rejects.toThrow('API error: 404')
  })
})
