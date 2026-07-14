import { useShallow } from 'zustand/react/shallow'
import { useQuotationStore } from '@/stores/quotation-store'
import type { SpecDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { TextListField } from '@/components/quotation/shared/TextListField'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'

/**
 * The product-specification card for Step 9 — a free-text description, two
 * one-item-per-line lists (specifications, make / brand) and an optional yield
 * strength. Every field is optional; blanks are dropped by `buildSpecPayload`.
 */
export function SpecDetails() {
  const { spec, setSpec } = useQuotationStore(
    useShallow((s) => ({ spec: s.spec, setSpec: s.setSpec })),
  )

  return (
    <SectionCard icon={<FileText className="w-3.5 h-3.5" />} title="Product Specification">
      <div className="flex flex-col gap-4 desktop:gap-6">
        <div>
          <Label className="desktop:mb-2">Description</Label>
          <Textarea
            rows={3}
            value={spec.description ?? ''}
            onChange={(e) => setSpec({ description: e.target.value || undefined })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 desktop:gap-6">
          <TextListField
            label="Specifications"
            value={spec.specifications}
            onChange={(v) => setSpec({ specifications: v })}
            hint="One specification per line (e.g. IS 2062)."
          />
          <TextListField
            label="Make / Brand"
            value={spec.makeOrBrand}
            onChange={(v) => setSpec({ makeOrBrand: v })}
            hint="One make or brand per line."
          />
        </div>

        <NumberField
          label="Yield Strength"
          value={spec.yieldStrengthMpa}
          unit="MPa"
          step={1}
          required={false}
          error={false}
          onChange={(v) => setSpec({ yieldStrengthMpa: v } as Partial<SpecDraft>)}
          className="md:max-w-[50%]"
        />
      </div>
    </SectionCard>
  )
}
