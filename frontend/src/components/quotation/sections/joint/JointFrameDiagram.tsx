import type { FrameDiagram, DiagramGroup } from './frameData'
import { jointIdLabel } from './jointOptions'

interface JointFrameDiagramProps {
  frame: FrameDiagram
  /** Invoked when a joint node is activated (click / Enter / Space). */
  onSelectJoint: (group: DiagramGroup, jointId: string) => void
}

/**
 * Renders one structural frame as a responsive inline SVG. The `viewBox` +
 * `preserveAspectRatio` make it scale fluidly to its container width (height
 * follows the aspect ratio), so it is responsive with zero JS. Each joint node
 * is a keyboard-focusable, clickable `<g>` that reports its store group + enum
 * jointId so the caller can focus the matching input row.
 *
 * Colors come from CSS design tokens (`stroke-border`, `fill-card`,
 * `text-primary` on hover/focus) so the diagram themes with light/dark mode.
 */
export function JointFrameDiagram({ frame, onSelectJoint }: JointFrameDiagramProps) {
  return (
    <svg
      viewBox={frame.viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={frame.title}
      className="w-full h-auto select-none"
    >
      {/* Frame members */}
      <g className="stroke-muted-foreground/60" strokeWidth={1.5} strokeLinecap="round">
        {frame.edges.map((edge, i) => (
          <line key={i} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} />
        ))}
      </g>

      {/* Joint nodes */}
      {frame.nodes.map((node, i) => {
        const label = jointIdLabel(node.jointId)
        return (
          <g
            key={`${node.jointId}-${i}`}
            role="button"
            tabIndex={0}
            aria-label={`Joint ${label}`}
            className="cursor-pointer text-muted-foreground hover:text-primary focus:text-primary focus:outline-none [&_circle]:hover:fill-primary [&_circle]:focus:fill-primary"
            onClick={() => onSelectJoint(node.group, node.jointId)}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault()
                onSelectJoint(node.group, node.jointId)
              }
            }}
          >
            <circle cx={node.x} cy={node.y} r={5} className="fill-foreground" />
            {/* Larger transparent hit area for easier tapping on touch devices. */}
            <circle cx={node.x} cy={node.y} r={12} fill="transparent" />
            <text
              x={node.x}
              y={node.y - 10}
              textAnchor="middle"
              className="fill-current font-mono"
              fontSize={11}
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
