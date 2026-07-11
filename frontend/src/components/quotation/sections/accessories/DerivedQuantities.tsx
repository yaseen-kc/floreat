import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft, RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Ruler } from 'lucide-react'
import { deriveAccessoryQuantities } from '@floreat/shared/calc'
import type { AccessoryQuantities } from '@floreat/shared/calc'

/** The six roof-derived quantity fields, each with a companion `*Manual` override flag. */
const QUANTITY_FIELDS = [
  { field: 'gutterQuantity', label: 'Gutter' },
  { field: 'downTakeQuantity', label: 'Down Take' },
  { field: 'dripTrimQuantity', label: 'Drip Trim' },
  { field: 'gableEndFlashingQuantity', label: 'Gable End Flashing' },
  { field: 'cornerFlashQuantity', label: 'Corner Flash' },
  { field: 'ridgeQuantity', label: 'Ridge' },
] as const

/**
 * Live-previews the six accessory quantities from the roof draft. These values
 * are derived and persisted server-side (never trusted from the client — this
 * is a preview only). Each row shows the read-only derived value; flipping
 * Override sets `${field}Manual = true` and lets the user type a value the
 * server will trust instead.
 */
export function DerivedQuantities() {
  const { accessories, setAccessories, roof } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories, roof: s.roof })),
  )

  const preview = derivePreview(roof)

  return (
    <SectionCard icon={<Ruler className="w-3.5 h-3.5" />} title="Derived Quantities">
      <p className="text-sm text-muted-foreground mb-4">
        Auto-calculated from the roof. Enable Override to enter a value manually.
      </p>
      <div className="flex flex-col gap-4">
        {QUANTITY_FIELDS.map(({ field, label }) => {
          const manualField = `${field}Manual`
          const isManual = accessories[manualField as keyof AccessoriesDraft] === true
          const manualValue = accessories[field as keyof AccessoriesDraft] as number | undefined
          const derived = preview[field as keyof AccessoryQuantities]
          const hint =
            field === 'cornerFlashQuantity' && !isManual && derived === undefined
              ? 'Add FRONT and LEFT sidewalls in Step 2 (Roof) to calculate this.'
              : undefined

          return (
            <div key={field} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:items-end">
              <NumberField
                label={label}
                value={isManual ? manualValue : derived}
                unit="m"
                required={false}
                error={false}
                readOnly={!isManual}
                hint={hint}
                onChange={(v) => setAccessories({ [field]: v } as Partial<AccessoriesDraft>)}
              />
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id={manualField}
                  checked={isManual}
                  onCheckedChange={(checked) =>
                    setAccessories(
                      (checked
                        ? { [manualField]: true }
                        : { [field]: undefined, [manualField]: undefined }) as Partial<AccessoriesDraft>,
                    )
                  }
                  aria-label={`Override ${label} quantity`}
                />
                <Label htmlFor={manualField} className="text-xs text-muted-foreground">Override</Label>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

/** Builds the calc input from the roof draft (+ FRONT/LEFT sidewall heights) and derives the preview. */
function derivePreview(roof: RoofDraft): AccessoryQuantities {
  const sidewalls = roof.sidewalls ?? []
  const front = sidewalls.find((w) => w.side === 'FRONT')
  const left = sidewalls.find((w) => w.side === 'LEFT')

  return deriveAccessoryQuantities({
    buildingOverallLength: roof.buildingOverallLength,
    buildingOverallWidth: roof.buildingOverallWidth,
    eaveHeight: roof.eaveHeight,
    roofSlope: roof.roofSlope,
    mainRoofFrames: roof.mainRoofFrames,
    endRoofFrames: roof.endRoofFrames,
    roofExtensionWidthHeight: roof.roofExtensionWidthHeight,
    claddingExtensionWidthHeight: roof.claddingExtensionWidthHeight,
    sideColumnsWidthHeight: roof.sideColumnsWidthHeight,
    frontSideWallHeight: front?.height,
    leftSideWallHeight: left?.height,
  })
}

export { derivePreview }
