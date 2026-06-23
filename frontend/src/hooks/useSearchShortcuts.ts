import { useEffect, type RefObject } from 'react'

/** True when focus is in a field where `/` should type, not trigger search. */
function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

/**
 * Global search shortcuts (DESIGN.md §7.4):
 *   - `/`            focuses search (unless already typing in a field)
 *   - ⌘K / Ctrl-K    focuses search (always)
 *   - `Esc`          blurs search when it is focused
 */
export function useSearchShortcuts(searchRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const input = searchRef.current

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        input?.focus()
        return
      }

      if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault()
        input?.focus()
        return
      }

      if (e.key === 'Escape' && input && document.activeElement === input) {
        input.blur()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchRef])
}
