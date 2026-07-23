import { useJointHydration } from '@/hooks/useJointHydration'
import { ScalarBoltGroups } from '@/components/quotation/sections/joint/ScalarBoltGroups'
import { JointBoltTable } from '@/components/quotation/sections/joint/JointBoltTable'
import { Building2, Layers, Anchor } from 'lucide-react'

/**
 * Step 8 — Joint. An always-on form for a job's bolt specifications: interactive
 * frame reference diagrams (click a joint node to jump to its input), four scalar
 * bolt groups, and three enum-keyed bolt tables (roof, mezzanine, foundation),
 * each with per-row diameter + count. Every field is optional; blanks are
 * dropped by `buildJointPayload` and the draft hydrates from the server on resume.
 */
export function Step8Joint() {
    useJointHydration()

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight">Joint bolt specifications</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Bolt type, diameter and count for each structural joint. Use the frame diagrams to locate a joint.
                </p>
            </div>

            <JointBoltTable
                group="roof"
                title="Roof Joints"
                icon={<Building2 className="w-3.5 h-3.5" />}
                columns="diameterAndCount"
                hint="Bolt diameter and count per roof / rafter joint code (A–L and end-frame A_1…L_1)."
            />
            <JointBoltTable
                group="mezzanine"
                title="Mezzanine Joints"
                icon={<Layers className="w-3.5 h-3.5" />}
                columns="diameterAndCount"
                hint="Bolt diameter and count per mezzanine joint (M–S and SEC)."
            />
            <JointBoltTable
                group="foundation"
                title="Foundation Bolts"
                icon={<Anchor className="w-3.5 h-3.5" />}
                columns="diameterAndCount"
                hint="Bolt diameter and count per foundation bolt group (FB-4 / FB-5 / FB-6)."
            />

            <ScalarBoltGroups />

        </section>
    )
}
