import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({ mezzData: undefined as unknown }))

vi.mock('@/api/quotation/mezz/getMezz', () => ({
  useMezzanine: () => ({ data: mocks.mezzData }),
}))

import { Step3Mezzanine } from '@/components/quotation/steps/Step3Mezzanine'
import { useQuotationStore } from '@/stores/quotation-store'
import { getAvailableMezzanineFloorOptions } from '@/components/quotation/sections/mezzanine/mezzanineOptions'

describe('Step3Mezzanine', () => {
  beforeEach(() => {
    localStorage.clear()
    useQuotationStore.getState().resetQuotation()
    mocks.mezzData = undefined
  })

  it('renders the heading', () => {
    render(<Step3Mezzanine />)
    expect(screen.getByRole('heading', { name: 'Mezzanine' })).toBeInTheDocument()
  })

  it('always shows the floors and floor extensions editors', () => {
    render(<Step3Mezzanine />)
    expect(screen.getByText('Floors')).toBeInTheDocument()
    expect(screen.getByText('Floor Extensions')).toBeInTheDocument()
  })

  it('adds a floor row with an auto-assigned code', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))
    expect(screen.getByText('MEZ_1')).toBeInTheDocument()
    await waitFor(() => expect(useQuotationStore.getState().mezzanine.floors).toHaveLength(1))
    expect(useQuotationStore.getState().mezzanine.floors[0].code).toBe('MEZ_1')
  })

  it('renders the requested grouped table headers', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))

    expect(screen.getByRole('columnheader', { name: 'Sl' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Material Consumption' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Number Of Beams' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Number Of Joints In Beams' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Numbers Of Internal Columns' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader', { name: 'Mid Primary' })).toHaveLength(3)
  })

  it('updates a floor value from an inline table field', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))
    await user.type(screen.getByLabelText('Length'), '12.5')

    expect(useQuotationStore.getState().mezzanine.floors[0].lengthM).toBe(12.5)
  })

  it('removes a floor and reassigns the remaining IDs', async () => {
    const user = userEvent.setup()
    render(<Step3Mezzanine />)

    await user.click(screen.getByRole('button', { name: /add floor/i }))
    await user.click(screen.getByRole('button', { name: /add floor/i }))
    await user.click(screen.getByRole('button', { name: 'Remove floor 1' }))

    await waitFor(() => expect(useQuotationStore.getState().mezzanine.floors).toHaveLength(1))
    expect(useQuotationStore.getState().mezzanine.floors[0].code).toBe('MEZ_1')
  })

  it('limits extension floor choices to configured mezzanine floors', () => {
    const options = getAvailableMezzanineFloorOptions([
      { floor: 'FLOOR_1' },
      { floor: 'FLOOR_3' },
    ])

    expect(options.map((option) => option.value)).toEqual(['FLOOR_1', 'FLOOR_3'])
  })
})
