import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('direct numeric markup', () => {
  it('uses mono tabular styling for figures', () => {
    render(<span className="font-mono tabular-nums">1,240</span>)
    const el = screen.getByText('1,240')
    expect(el.className).toContain('font-mono')
    expect(el.className).toContain('tabular-nums')
  })
})
