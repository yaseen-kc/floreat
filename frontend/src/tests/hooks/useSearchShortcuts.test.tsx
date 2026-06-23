import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { useRef } from 'react'
import { useSearchShortcuts } from '@/hooks/useSearchShortcuts'

/** Test harness: wires the hook to a real search input plus a sibling textarea. */
function Harness() {
  const ref = useRef<HTMLInputElement>(null)
  useSearchShortcuts(ref)
  return (
    <div>
      <input ref={ref} data-testid="search" />
      <textarea data-testid="ta" />
    </div>
  )
}

function press(key: string, opts: KeyboardEventInit = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts }))
}

describe('useSearchShortcuts', () => {
  let search: HTMLInputElement
  let ta: HTMLTextAreaElement

  beforeEach(() => {
    const { getByTestId } = render(<Harness />)
    search = getByTestId('search') as HTMLInputElement
    ta = getByTestId('ta') as HTMLTextAreaElement
  })
  afterEach(() => cleanup())

  it('focuses search on "/" when not typing in a field', () => {
    press('/')
    expect(document.activeElement).toBe(search)
  })

  it('ignores "/" while typing in another field', () => {
    ta.focus()
    // Dispatch from the textarea as the event target.
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(ta)
  })

  it('focuses search on Ctrl/Cmd-K always', () => {
    ta.focus()
    press('k', { ctrlKey: true })
    expect(document.activeElement).toBe(search)
  })

  it('blurs search on Escape when focused', () => {
    search.focus()
    expect(document.activeElement).toBe(search)
    press('Escape')
    expect(document.activeElement).not.toBe(search)
  })
})
