import { useState, useEffect } from 'react'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Frame, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

/** A reference frame diagram: a public PNG under `/frames` plus its caption. */
interface ReferenceFrame {
  src: string
  title: string
  caption: string
}

/**
 * The Step 8 frame reference figures (CAD schematics of the structural joints).
 * Each PNG lives in `frontend/public/frames` and is served from `/frames/*`.
 */
const FRAMES: readonly ReferenceFrame[] = [
  { src: '/frames/mainFrame1.png', title: 'Main Frame 1', caption: 'Two-storey mezzanine — roof (A–L), mezzanine (M–S) and foundation (FB-1…FB-3).' },
  { src: '/frames/mainFrame2.png', title: 'Main Frame 2', caption: 'Main frame joints — roof (A–L) and foundation bolt groups.' },
  { src: '/frames/mainFrame3.png', title: 'Main Frame 3', caption: 'Main frame joints — roof (A–L) and foundation (FB-4…FB-6).' },
  { src: '/frames/mainFrame4.png', title: 'Main Frame 4', caption: 'Main frame joints — roof (A–D) and foundation (FB-4 / FB-5).' },
  { src: '/frames/endFrame.png', title: 'End Frame', caption: 'End / gable frame joint codes.' },
]

/**
 * A responsive gallery of the structural frame reference diagrams. Each figure
 * is a static PNG the user consults while entering bolt specs in the tables
 * below; clicking (or keyboard-activating) a figure opens a full-screen zoom
 * overlay, dismissed with the close button, a backdrop click, or Escape.
 */
export function JointFrameReference() {
  const [active, setActive] = useState<ReferenceFrame | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <SectionCard icon={<Frame className="w-3.5 h-3.5" />} title="Frame Reference">
      <p className="text-xs text-muted-foreground -mt-2 mb-4">
        Reference diagrams for each structural joint code. Click a figure to enlarge.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FRAMES.map((frame) => (
          <figure key={frame.src} className="border border-border rounded-[12px] p-3 bg-surface-2/40 min-w-0">
            <button
              type="button"
              onClick={() => setActive(frame)}
              aria-label={`Enlarge ${frame.title}`}
              className={cn(
                'group relative block w-full overflow-hidden rounded-[8px] border border-border bg-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              )}
            >
              <img src={frame.src} alt={`${frame.title} — ${frame.caption}`} loading="lazy" className="w-full h-auto object-contain" />
              <span className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded-[7px] bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="w-4 h-4" />
              </span>
            </button>
            <figcaption className="mt-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wide text-foreground">{frame.title}</span>
              <span className="block text-xs text-muted-foreground">{frame.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} enlarged`}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 sm:p-8"
        >
          <button
            type="button"
            aria-label="Close enlarged frame"
            className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-[9px] bg-background/90 text-foreground hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="w-5 h-5" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-5xl overflow-auto rounded-[12px] bg-white p-2">
            <img src={active.src} alt={`${active.title} — ${active.caption}`} className="w-full h-auto object-contain" />
            <figcaption className="px-1 py-2 text-center text-xs text-muted-foreground">
              <span className="font-mono font-semibold uppercase tracking-wide text-foreground">{active.title}</span> — {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </SectionCard>
  )
}
