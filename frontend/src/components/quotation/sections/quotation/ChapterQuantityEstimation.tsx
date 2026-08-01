import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { DocChapter } from './DocPrimitives'
import { DocTable, type DocColumn } from './DocTable'
import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'

const COLUMNS: readonly DocColumn[] = [
  { header: 'SL No.', align: 'right', className: 'w-16', numeric: true },
  { header: 'Items', wrap: true, className: 'min-w-72' },
  { header: 'Unit', align: 'center', className: 'w-24' },
  { header: 'Quantity', align: 'right', className: 'min-w-32', numeric: true },
]

const n = (v: string | number | null | undefined): number => Number(v ?? 0)
const fmt = (v: number): string =>
  v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function item(label: string, detail?: string) {
  return (
    <>
      <span className="font-semibold">{label}</span>
      {detail && <span className="text-foreground/85"> {detail}</span>}
    </>
  )
}

/** Chapter 5 — estimated quantities per line item. */
export function ChapterQuantityEstimation() {
  const { quantity, amount, roof, setQuotation } = useQuotationStore(
    useShallow((s) => ({ quantity: s.quantity, amount: s.amount, roof: s.roof, setQuotation: s.setQuotation })),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = quantity?.pebRoof as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cl = quantity?.cladding as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ca = quantity?.canopy as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ac = quantity?.accessories as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mz = quantity?.mezzanine as any
  const am = amount

  const badge = (unit: string) => <Badge variant="outline">{unit}</Badge>

  useEffect(() => {
    setQuotation({
      qtyRoofStructure:      n(p?.raftersAndColumnsQuantity) + n(p?.lengthOfBuildingQuantity) + n(ac?.fasciaStructureQuantity),
      qtyRoofPurlins:        n(p?.roofPurlinsQuantity) + n(p?.lengthOfOnePurlinQuantity),
      qtyMezzanineStructure: n(mz?.mezzanineStructureQuantity) + n(mz?.totalMezzanineAreaQuantity),
      qtyCladdingStructure:  n(cl?.claddingStructureQuantity) + n(cl?.claddingEaveHeightFrontAdditional),
      qtyBracings:           n(am?.windBracingsQuantity) * n(roof.windBracingUnitWeight) + n(am?.sagRodQuantity) * n(p?.unitWeightOfSagRod) + n(am?.flangeBraceQuantity),
      qtyCanopyStructure:    n(ca?.canopyStructureQuantity),
      qtyCanopyPurlins:      n(ca?.canopyPurlinQuantity),
      qtyStair:              n(am?.stair1Quantity) + n(am?.stair2Quantity),
      qtyPlinthArea:         n(roof.buildingOverallLength) * n(roof.buildingOverallWidth),
      qtyRoofSheetArea:      n(p?.roofSheetQuantity) + n(p?.extendedRoofWidthAdditonal),
      qtyDeckingSheet:       n(am?.deckingSheetQuantity),
      qtyCladdingSheetArea:  n(cl?.claddingSheetAdditional) + n(cl?.claddingSheetQuantity),
      qtyCanopySheetArea:    n(ca?.canopySheetQuantity),
      qtySheetAccessories:   n(ca?.canopyGutterQuantity) + n(ca?.canopyDownTakeQuantity) + n(ca?.canopySideCoveringQuantity)
        + n(ca?.canopyFlashingQuantity) + n(ac?.ridgeQuantity) + n(ac?.gutterQuantity)
        + n(ac?.downtakeQuantity) + n(ac?.dripTrimQuantity) + n(ac?.gableEndFlashingQuantity) + n(ac?.cornerFlashQuantity),
      qtyDoors:              n(ac?.doorsQuantity),
      qtyWindows:            n(ac?.windowsQuantity),
      qtyRollingShutter:     n(ac?.rollingShutterQuantity),
      qtyLouvers:            n(ac?.louversQuantity),
      qtyTurboVentilators:   n(ac?.turboVentilatorsQuantity),
      qtySkyLights:          n(ac?.skyLightQuantity),
      qtyWallLights:         n(ac?.wallLightQuantity),
      qtyRoofInsulation:     n(ac?.roofInsulationQuantity),
      qtyWallInsulation:     n(ac?.wallInsulationQuantity),
      qtyPolycarbonateSheet: n(p?.lengthOfpolyCarbonateSheetAdditional) + n(p?.polyCarbonateSheetQuantity),
      qtyFasciaStructure:    n(p?.lengthOfpolyCarbonateSheetAdditional),
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, cl, ca, mz, am, ac, roof])

  const rows = [
    ['1', item('Roof Structure:', 'Rafters, Columns and Tie Beams'), badge('Kg'),
      fmt(n(p?.raftersAndColumnsQuantity) + n(p?.lengthOfBuildingQuantity) + n(ac?.fasciaStructureQuantity))],
    ['2', item('Roof Purlins'), badge('Kg'),
      fmt(n(p?.roofPurlinsQuantity) + n(p?.lengthOfOnePurlinQuantity))],
    ['3', item('Mezzanine Structure.'), badge('Kg'),
      fmt(n(mz?.mezzanineStructureQuantity) + n(mz?.totalMezzanineAreaQuantity))],
    ['4', item('Cladding Structure:', 'Cladding Purlins'), badge('Kg'),
      fmt(n(cl?.claddingStructureQuantity) + n(cl?.claddingEaveHeightFrontAdditional))],
    ['5', item('Bracings:', 'Wind Bracings, Sag Rod, Flange Brace'), badge('Kg'),
      fmt(n(am?.windBracingsQuantity) * n(roof.windBracingUnitWeight)
        + n(am?.sagRodQuantity) * n(p?.unitWeightOfSagRod)
        + n(am?.flangeBraceQuantity))],
    ['6', item('Canopy Structure'), badge('Kg'), fmt(n(ca?.canopyStructureQuantity))],
    ['7', item('Canopy Purlins'), badge('Kg'), fmt(n(ca?.canopyPurlinQuantity))],
    ['8', item('Stair'), badge('Kg'), fmt(n(am?.stair1Quantity) + n(am?.stair2Quantity))],
    ['9', item('Plinth Area'), badge('Sqm'),
      fmt(n(roof.buildingOverallLength) * n(roof.buildingOverallWidth))],
    ['10', item('Roof Sheet Area'), badge('Sqm'),
      fmt(n(p?.roofSheetQuantity) + n(p?.extendedRoofWidthAdditonal))],
    ['11', item('Decking Sheet'), badge('Sqm'), fmt(n(am?.deckingSheetQuantity))],
    ['12', item('Cladding Sheet Area'), badge('Sqm'),
      fmt(n(cl?.claddingSheetAdditional) + n(cl?.claddingSheetQuantity))],
    ['13', item('Canopy Sheet Area'), badge('Sqm'), fmt(n(ca?.canopySheetQuantity))],
    ['14', item('Sheet Accessories: Flashing, Gutter and Downtake'), badge('Rmtr'),
      fmt(n(ca?.canopyGutterQuantity) + n(ca?.canopyDownTakeQuantity) + n(ca?.canopySideCoveringQuantity)
        + n(ca?.canopyFlashingQuantity) + n(ac?.ridgeQuantity) + n(ac?.gutterQuantity)
        + n(ac?.downtakeQuantity) + n(ac?.dripTrimQuantity) + n(ac?.gableEndFlashingQuantity) + n(ac?.cornerFlashQuantity))],
    ['15', item('Doors'), badge('Sqm'), fmt(n(ac?.doorsQuantity))],
    ['16', item('Windows'), badge('Sqm'), fmt(n(ac?.windowsQuantity))],
    ['17', item('Rolling Shutter'), badge('Sqm'), fmt(n(ac?.rollingShutterQuantity))],
    ['18', item('Louvers'), badge('Sqm'), fmt(n(ac?.louversQuantity))],
    ['19', item('Turbo Ventilators'), badge('Nos'), fmt(n(ac?.turboVentilatorsQuantity))],
    ['20', item('Sky Lights'), badge('Sqm'), fmt(n(ac?.skyLightQuantity))],
    ['21', item('Wall Lights'), badge('Sqm'), fmt(n(ac?.wallLightQuantity))],
    ['22', item('Roof Insulation'), badge('Sqm'), fmt(n(ac?.roofInsulationQuantity))],
    ['23', item('Wall Insulation'), badge('Sqm'), fmt(n(ac?.wallInsulationQuantity))],
    ['24', item('Polycarbonate Sheet Area'), badge('Sqm'),
      fmt(n(p?.lengthOfpolyCarbonateSheetAdditional) + n(p?.polyCarbonateSheetQuantity))],
    ['25', item('Fascia Structure'), badge('Sqm'), fmt(n(p?.lengthOfpolyCarbonateSheetAdditional))],
  ]

  return (
    <DocChapter eyebrow="Chapter 5" title="Quantity Estimation">
      <DocTable
        caption="Estimated quantity and unit per item of work"
        columns={COLUMNS}
        rows={rows}
        minWidth="min-w-[640px]"
      />
    </DocChapter>
  )
}
