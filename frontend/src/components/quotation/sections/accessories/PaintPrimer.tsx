import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Paintbrush } from 'lucide-react'
import type {
  PaintType,
  PurlinsGirtsFinish,
  PurlinsGirtsPaint,
  FoundationBoltFinish,
} from '@/api/quotation/accessories/getAccessories'
import {
  PAINT_TYPE_OPTIONS,
  PURLINS_GIRTS_FINISH_OPTIONS,
  PURLINS_GIRTS_PAINT_OPTIONS,
  FOUNDATION_BOLT_FINISH_OPTIONS,
} from './accessoriesOptions'

/** Paint & primer specifications (frames, purlins & girts, foundation bolt) for Step 6. */
export function PaintPrimer() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )

  return (
    <SectionCard icon={<Paintbrush className="w-3.5 h-3.5" />} title="Paint & Primer">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Frames</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
            <NumberField
              label="Primer Coats"
              value={accessories.framesPrimerCoats}
              unit="coats"
              step={1}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ framesPrimerCoats: v })}
            />
            <SelectField
              label="Primer Type"
              value={accessories.framesPrimerType}
              options={PAINT_TYPE_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ framesPrimerType: v as PaintType })}
            />
            <NumberField
              label="Paint Coats"
              value={accessories.framesPaintCoats}
              unit="coats"
              step={1}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ framesPaintCoats: v })}
            />
            <SelectField
              label="Paint Type"
              value={accessories.framesPaintType}
              options={PAINT_TYPE_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ framesPaintType: v as PaintType })}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Purlins & Girts</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
            <SelectField
              label="Finish"
              value={accessories.purlinsGirtsFinish}
              options={PURLINS_GIRTS_FINISH_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ purlinsGirtsFinish: v as PurlinsGirtsFinish })}
            />
            <NumberField
              label="GSM"
              value={accessories.purlinsGirtsGsm}
              unit="gsm"
              step={1}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ purlinsGirtsGsm: v })}
            />
            <SelectField
              label="Paint"
              value={accessories.purlinsGirtsPaint}
              options={PURLINS_GIRTS_PAINT_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ purlinsGirtsPaint: v as PurlinsGirtsPaint })}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Foundation Bolt</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
            <SelectField
              label="Finish"
              value={accessories.foundationBoltFinish}
              options={FOUNDATION_BOLT_FINISH_OPTIONS}
              required={false}
              error={false}
              onChange={(v) => setAccessories({ foundationBoltFinish: v as FoundationBoltFinish })}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
