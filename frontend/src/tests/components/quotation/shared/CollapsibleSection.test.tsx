import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Box } from 'lucide-react'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'

describe('CollapsibleSection shared primitive', () => {
  it('always renders the title and a toggle switch', () => {
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled={false} onToggle={() => {}}>
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(screen.getByText('Frame Members')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('hides the body when disabled', () => {
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled={false} onToggle={() => {}}>
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(screen.queryByText('body')).not.toBeInTheDocument()
  })

  it('shows the body when enabled', () => {
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled onToggle={() => {}}>
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('fires onToggle with the next state when the switch is clicked', () => {
    const onToggle = vi.fn()
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled={false} onToggle={onToggle}>
        <p>body</p>
      </CollapsibleSection>,
    )
    fireEvent.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('shows the error prompt when an enabled section holds an invalid value', () => {
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled error onToggle={() => {}}>
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(
      screen.getByText('Complete every field in this section, or turn it off.'),
    ).toBeInTheDocument()
    // The body (fields) is shown while enabled.
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('supports a custom error message', () => {
    render(
      <CollapsibleSection
        icon={<Box />}
        title="Frame Members"
        enabled={false}
        error
        errorMessage="Custom required message"
        onToggle={() => {}}
      >
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(screen.getByText('Custom required message')).toBeInTheDocument()
  })

  it('does not render an error prompt when error is absent', () => {
    render(
      <CollapsibleSection icon={<Box />} title="Frame Members" enabled onToggle={() => {}}>
        <p>body</p>
      </CollapsibleSection>,
    )
    expect(
      screen.queryByText('Complete every field in this section, or turn it off.'),
    ).not.toBeInTheDocument()
  })
})
