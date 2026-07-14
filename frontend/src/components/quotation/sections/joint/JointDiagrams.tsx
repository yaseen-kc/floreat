import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Frame } from 'lucide-react'
import { JointFrameDiagram } from './JointFrameDiagram'
import { FRAME_DIAGRAMS, type DiagramGroup } from './frameData'

/**
 * Scrolls to and focuses the input row for a joint code. Rows are rendered by
 * {@link JointBoltTable} with `id="joint-{group}-{jointId}"`; a missing id (a
 * diagram node whose code has no editable row) is a no-op.
 */
function focusJoint(group: DiagramGroup, jointId: string): void {
  const el = document.getElementById(`joint-${group}-${jointId}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // Focus the first input so the user lands ready to type the bolt spec.
  el.querySelector('input')?.focus({ preventScroll: true })
}

/**
 * A responsive gallery of the structural frame reference diagrams. Each frame is
 * a fluid inline SVG; clicking (or keyboard-activating) a joint node jumps to and
 * focuses that joint's input row below.
 */
export function JointDiagrams() {
  return (
    <SectionCard icon={<Frame className="w-3.5 h-3.5" />} title="Frame Reference">
      <p className="text-xs text-muted-foreground -mt-2 mb-4">
        Click a joint node in any frame to jump to its bolt-spec input below.
      </p>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {FRAME_DIAGRAMS.map((frame) => (
          <figure key={frame.id} className="border border-border rounded-[12px] p-3 bg-surface-2/40 min-w-0">
            <figcaption className="mb-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wide text-foreground">
                {frame.title}
              </span>
              <span className="block text-xs text-muted-foreground">{frame.caption}</span>
            </figcaption>
            <JointFrameDiagram frame={frame} onSelectJoint={focusJoint} />
          </figure>
        ))}
      </div>
    </SectionCard>
  )
}
