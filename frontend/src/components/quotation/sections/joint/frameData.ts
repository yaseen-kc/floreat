/**
 * Data-driven geometry for the Step 8 joint reference diagrams.
 *
 * Each frame is a portal-frame schematic (matching the reference figures in
 * `docs/reference/Step8Joint/`) rendered as a responsive inline SVG by
 * {@link JointFrameDiagram}. A node's `label` is the human/drawing form (e.g.
 * "A_1", "FB-4"); {@link classify} derives the store group + enum jointId so a
 * click can focus the matching input row (`#joint-{group}-{jointId}`).
 *
 * ponytail: node coordinates are transcribed to *approximate* the reference
 * PNGs (legible, symmetric schematics), not to pixel fidelity. The upgrade path
 * is refining the coordinate literals below against the source figures — no code
 * change needed, they are pure data.
 */

/** Which store array a diagram node targets. */
export type DiagramGroup = 'roof' | 'mezzanine' | 'foundation'

export interface FrameNode {
  x: number
  y: number
  label: string
  group: DiagramGroup
  jointId: string
}

export interface FrameEdge {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface FrameDiagram {
  id: string
  title: string
  caption: string
  viewBox: string
  edges: FrameEdge[]
  nodes: FrameNode[]
}

const MEZZ_IDS = ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'SEC']

/** Maps a drawing label to its store group + enum jointId. */
function classify(label: string): { group: DiagramGroup; jointId: string } {
  const up = label.toUpperCase()
  if (up.startsWith('FB-')) return { group: 'foundation', jointId: `FB${up.slice(3)}` }
  if (MEZZ_IDS.includes(up)) return { group: 'mezzanine', jointId: up }
  return { group: 'roof', jointId: up }
}

/** Concise node authoring helper: position + label, group/jointId derived. */
function n(x: number, y: number, label: string): FrameNode {
  return { x, y, label, ...classify(label) }
}

const e = (x1: number, y1: number, x2: number, y2: number): FrameEdge => ({ x1, y1, x2, y2 })

const VIEWBOX = '0 0 680 360'

/* ── Frame 1: Main Frame — two-storey mezzanine (Picture1) ─────────────────── */
const mainTwoStorey: FrameDiagram = {
  id: 'main-two-storey',
  title: 'Main Frame — Two-Storey Mezzanine',
  caption: 'Roof, both mezzanine floors and foundation bolts.',
  viewBox: VIEWBOX,
  edges: [
    e(40, 150, 340, 55), e(340, 55, 640, 150), // rafters
    e(40, 150, 40, 330), e(175, 107, 175, 330), e(340, 55, 340, 330), // columns
    e(505, 107, 505, 330), e(640, 150, 640, 330),
    e(40, 215, 640, 215), e(40, 275, 640, 275), // mezzanine floor beams
  ],
  nodes: [
    // Roof
    n(40, 150, 'C'), n(70, 141, 'I'), n(180, 106, 'B_1'), n(175, 107, 'L'),
    n(340, 55, 'A'), n(500, 106, 'B_1'), n(505, 107, 'L'), n(640, 150, 'C'), n(610, 141, 'D'),
    n(175, 140, 'K'), n(505, 140, 'K'), n(175, 178, 'J'), n(505, 178, 'J'),
    n(40, 178, 'H'), n(40, 205, 'G'), n(40, 232, 'F'), n(640, 178, 'D'), n(640, 205, 'E'),
    // Mezzanine — upper floor
    n(40, 215, 'P'), n(175, 215, 'M'), n(258, 215, 'N'), n(340, 215, 'M'),
    n(422, 215, 'N'), n(505, 215, 'M'), n(605, 215, 'N'),
    // Mezzanine — between/lower
    n(40, 248, 'S'), n(175, 248, 'Q'), n(340, 248, 'R'), n(505, 248, 'R'), n(640, 248, 'Q'),
    n(40, 275, 'P'), n(175, 275, 'M'), n(258, 275, 'N'), n(340, 275, 'M'),
    n(422, 275, 'N'), n(505, 275, 'M'), n(605, 275, 'N'),
    // Foundation
    n(40, 330, 'FB-3'), n(175, 330, 'FB_1'), n(340, 330, 'FB_2'), n(505, 330, 'FB_2'), n(640, 330, 'FB_1'),
  ],
}

/* ── Frame 2: Main Frame — two-storey, alternate columns (Picture2) ────────── */
const mainTwoStoreyAlt: FrameDiagram = {
  id: 'main-two-storey-alt',
  title: 'Main Frame — Two-Storey (Alt. Internal Columns)',
  caption: 'Two-storey variant with O mezzanine joints.',
  viewBox: VIEWBOX,
  edges: [
    e(40, 150, 340, 55), e(340, 55, 640, 150),
    e(40, 150, 40, 330), e(175, 107, 175, 330), e(340, 55, 340, 330),
    e(505, 107, 505, 330), e(640, 150, 640, 330),
    e(40, 215, 640, 215), e(40, 275, 640, 275),
  ],
  nodes: [
    n(40, 150, 'C'), n(70, 141, 'I'), n(190, 103, 'B'), n(290, 78, 'B'),
    n(340, 55, 'A'), n(390, 78, 'B'), n(490, 103, 'B'), n(640, 150, 'C'), n(610, 141, 'D'),
    n(40, 178, 'H'), n(40, 205, 'G'), n(40, 232, 'F'), n(175, 140, 'E'), n(640, 178, 'D'), n(640, 205, 'E'),
    // Upper floor
    n(40, 215, 'P'), n(175, 215, 'M'), n(258, 215, 'N'), n(340, 215, 'O'),
    n(422, 215, 'N'), n(505, 215, 'O'), n(605, 215, 'N'),
    n(40, 248, 'S'), n(175, 248, 'Q'), n(340, 248, 'R'), n(505, 248, 'R'), n(640, 248, 'Q'),
    // Lower floor
    n(40, 275, 'P'), n(175, 275, 'M'), n(258, 275, 'N'), n(340, 275, 'M'),
    n(422, 275, 'N'), n(505, 275, 'M'), n(605, 275, 'N'),
    n(40, 330, 'FB-3'), n(175, 330, 'FB_1'), n(340, 330, 'FB_2'), n(505, 330, 'FB_2'), n(640, 330, 'FB_1'),
  ],
}

/* ── Frame 3: Main Frame — single mezzanine, deep foundations (Picture3) ───── */
const mainMezzanine: FrameDiagram = {
  id: 'main-mezzanine',
  title: 'Main Frame — Mezzanine',
  caption: 'Roof with rafter joints and FB-4/5/6 foundation bolts.',
  viewBox: '0 0 680 260',
  edges: [
    e(40, 120, 340, 45), e(340, 45, 640, 120),
    e(40, 120, 40, 230), e(175, 82, 175, 230), e(340, 45, 340, 230),
    e(505, 82, 505, 230), e(640, 120, 640, 230),
  ],
  nodes: [
    n(40, 120, 'C'), n(70, 112, 'I'), n(180, 78, 'B_1'), n(175, 82, 'L'),
    n(340, 45, 'A'), n(500, 78, 'B_1'), n(505, 82, 'L'), n(640, 120, 'C'), n(610, 112, 'D'),
    n(175, 118, 'K'), n(505, 118, 'K'),
    n(40, 150, 'H'), n(40, 178, 'G'),
    n(40, 230, 'FB-5'), n(175, 230, 'FB-4'), n(340, 230, 'FB-6'), n(505, 230, 'FB-6'), n(640, 230, 'FB-4'),
  ],
}

/* ── Frame 4: Main Frame — roof only, no mezzanine (Picture4) ──────────────── */
const mainRoof: FrameDiagram = {
  id: 'main-roof',
  title: 'Main Frame — Roof Only',
  caption: 'Single-storey portal frame, no mezzanine.',
  viewBox: '0 0 680 240',
  edges: [
    e(40, 110, 340, 55), e(340, 55, 640, 110),
    e(40, 110, 40, 210), e(175, 90, 175, 210), e(340, 55, 340, 210),
    e(505, 90, 505, 210), e(640, 110, 640, 210),
  ],
  nodes: [
    n(40, 110, 'C'), n(70, 103, 'I'), n(190, 82, 'B'), n(290, 62, 'B'),
    n(340, 55, 'A'), n(390, 62, 'B'), n(490, 82, 'B'), n(640, 110, 'C'), n(610, 103, 'D'),
    n(40, 138, 'H'), n(40, 165, 'G'), n(640, 138, 'D'),
    n(40, 210, 'FB-5'), n(175, 210, 'FB-4'), n(340, 210, 'FB-4'), n(505, 210, 'FB-4'), n(640, 210, 'FB-4'),
  ],
}

/* ── Frame 5: End Frame — suffixed joint codes (Picture5) ──────────────────── */
const endFrame: FrameDiagram = {
  id: 'end-frame',
  title: 'End Frame',
  caption: 'Gable end frame with A_1/B_2/C_1 suffixed joint codes.',
  viewBox: '0 0 680 260',
  edges: [
    e(40, 120, 340, 45), e(340, 45, 640, 120),
    e(40, 120, 40, 230), e(175, 82, 175, 230), e(258, 63, 258, 230),
    e(340, 45, 340, 230), e(422, 63, 422, 230), e(505, 82, 505, 230), e(640, 120, 640, 230),
  ],
  nodes: [
    n(40, 120, 'H_1'), n(70, 112, 'I_1'), n(100, 104, 'C_1'), n(190, 78, 'B_2'),
    n(258, 63, 'L_1'), n(340, 45, 'A_1'), n(422, 63, 'L_1'), n(490, 78, 'B_2'),
    n(610, 104, 'C_1'), n(640, 120, 'D_1'),
    n(175, 100, 'D_1'), n(505, 100, 'D_1'), n(258, 100, 'K_1'), n(422, 100, 'K_1'),
    n(40, 150, 'G_1'),
    n(40, 230, 'FB-5'), n(175, 230, 'FB-4'), n(258, 230, 'FB-6'), n(340, 230, 'FB-6'),
    n(422, 230, 'FB-6'), n(505, 230, 'FB-4'), n(640, 230, 'FB-4'),
  ],
}

/** All reference frames, in the order shown in the gallery. */
export const FRAME_DIAGRAMS: FrameDiagram[] = [
  mainTwoStorey,
  mainTwoStoreyAlt,
  mainMezzanine,
  mainRoof,
  endFrame,
]
