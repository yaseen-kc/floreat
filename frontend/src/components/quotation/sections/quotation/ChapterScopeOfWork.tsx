import { DocChapter, DocSubsection } from './DocPrimitives'
import { DocTable, type DocColumn, type Row } from './DocTable'
import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'

const SL: DocColumn = { header: 'SL No.', align: 'right', className: 'w-16', numeric: true }

const DESCRIPTION_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Item', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Value', wrap: true, className: 'min-w-48' },
]

const FINISHES_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Items', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Description', wrap: true, className: 'min-w-64' },
]

const SCOPE_COLUMNS: readonly DocColumn[] = [
  SL,
  { header: 'Items', wrap: true, emphasis: true, className: 'min-w-56' },
  { header: 'Responsibility', wrap: true, className: 'min-w-40' },
]

const hasValue = (value: unknown): boolean => value !== undefined && value !== null && value !== '' && value !== 0
const yesOrNa = (condition: boolean): string => condition ? 'Yes' : 'NA'
const meter = (value: unknown): string => hasValue(value) ? `${value} Meter` : 'NA'
const sheet = (type: unknown, thickness: unknown): string => hasValue(type) && hasValue(thickness)
  ? `${type} ${thickness} mm Thick`
  : 'NA'

type QuotationDraftSlices = Pick<
  ReturnType<typeof useQuotationStore.getState>,
  'projectInfo' | 'roof' | 'accessories' | 'canopy' | 'mezzanine' | 'stair'
>

/** True when any row in the collection carries at least one filled field. */
const hasFilledRow = (rows: readonly object[]): boolean =>
  rows.some((row) => Object.values(row).some(hasValue))

/** Building Description: SL No., Item, Value. Derived from the live draft. */
function getBuildingDescription({ projectInfo, roof, accessories, canopy, mezzanine, stair }: QuotationDraftSlices): readonly Row[] {
  const frontSidewall = roof.sidewalls?.find((sidewall) => sidewall.side === 'FRONT')
  const wallHeight = frontSidewall?.height
  const bayCount = roof.mainRoofFrames + roof.endRoofFrames - 1
  const baySpacing = bayCount > 0 && hasValue(roof.buildingOverallLength) ? roof.buildingOverallLength / bayCount : undefined
  const hasMezzanine = mezzanine.floors.length > 0 || mezzanine.extensions.length > 0
  const hasDeckSheet = mezzanine.floors.some((floor) => floor.type === 'DECK_SHEET')
  const hasStair = hasFilledRow(stair.stairs) || hasFilledRow(stair.areaDeductions)

  return [
    ['1', 'Structure Type', 'Pre-Engineered Structure'],
    ['2', 'Building Usage', hasValue(projectInfo.buildingUsage) ? projectInfo.buildingUsage : 'NA'],
    ['3', 'Number of Building', hasValue(projectInfo.numberOfBuilding) ? String(projectInfo.numberOfBuilding) : 'NA'],
    ['4', 'Frame Type', hasValue(projectInfo.frameType) ? projectInfo.frameType : 'NA'],
    ['5', 'Configuration', hasValue(projectInfo.configuration) ? projectInfo.configuration : 'NA'],
    ['6', 'Span (Width)', meter(roof.buildingOverallWidth)],
    ['7', 'Length of Building', meter(roof.buildingOverallLength)],
    ['8', 'Column', 'Steel'],
    ['9', 'Intermediate Roof Columns', yesOrNa(roof.internalColumnsForMainRoofFrames > 0)],
    ['10', 'Number of Main Frame', hasValue(roof.mainRoofFrames) ? String(roof.mainRoofFrames) : 'NA'],
    ['11', 'Number of Gable Frame', hasValue(roof.endRoofFrames) ? String(roof.endRoofFrames) : 'NA'],
    ['12', 'Eaves Height', meter(roof.eaveHeight)],
    ['13', 'Cladding Height', hasValue(wallHeight) && hasValue(roof.eaveHeight) ? meter(roof.eaveHeight - wallHeight!) : 'NA'],
    ['14', 'Wall Height', meter(wallHeight)],
    ['15', 'Wall Material', hasValue(frontSidewall?.wallType) ? frontSidewall!.wallType : 'NA'],
    ['16', 'Roof Slope', hasValue(roof.roofSlope) ? `${roof.roofSlope} Degree` : 'NA'],
    ['17', 'Bay Spacing', meter(baySpacing)],
    ['18', 'Gable', yesOrNa(roof.endRoofFrames > 0)],
    ['19', 'EOT Crane', yesOrNa(accessories.gantryGirderEnabled === true)],
    ['20', 'Roof Sheet', sheet(roof.roofCoveringType, roof.roofCoveringThickness)],
    ['21', 'Cladding Sheet', sheet(roof.claddingCoveringType, roof.claddingCoveringThickness)],
    ['22A', 'Sheeting Accessories — Gutter', yesOrNa(Number(accessories.gutterQuantity) > 0)],
    ['22B', 'Sheeting Accessories — Down Take', yesOrNa(Number(accessories.downTakeQuantity) > 0)],
    ['22C', 'Sheeting Accessories — Drip Trim', yesOrNa(Number(accessories.dripTrimQuantity) > 0)],
    ['22D', 'Sheeting Accessories — Gable Trim', yesOrNa(Number(accessories.gableEndFlashingQuantity) > 0)],
    ['22E', 'Sheeting Accessories — Corner Flash', yesOrNa(Number(accessories.cornerFlashQuantity) > 0)],
    ['22F', 'Sheeting Accessories — Ridge Sheet', yesOrNa(Number(accessories.ridgeQuantity) > 0)],
    ['23', 'Polycarbonate Sheet', yesOrNa(Number(roof.polycarbonateRoofCount) > 0)],
    ['24', 'Turbo Ventilator', yesOrNa(Number(accessories.turboVentilatorNos) > 0)],
    ['25', 'Rolling Shutter', yesOrNa(Number(accessories.rollingShutterNos) > 0)],
    ['26', 'Wind Bracing', yesOrNa(Number(roof.roofWindBracingSegmentsInOneHalf) > 0)],
    ['27', 'Canopy', yesOrNa(canopy.canopies.length > 0)],
    ['28', 'Canopy Sheet', yesOrNa(canopy.canopies.some((item) => hasValue(item.canopySheet)))],
    ['29', 'Insulation', yesOrNa(hasValue(accessories.roofInsulationType) || hasValue(accessories.wallInsulationType))],
    ['30', 'Ridge Ventilator', 'NA'],
    ['31', 'Fixed Louver', yesOrNa(Number(accessories.louverNos) > 0)],
    ['32', 'Sky Lights', yesOrNa(Number(accessories.skyLightNos) > 0)],
    ['33', 'Wall Light', yesOrNa(Number(accessories.wallLightNos) > 0)],
    ['35', 'Partition Wall', yesOrNa(Number(accessories.partitionQuantity) > 0)],
    ['36', 'Mezzanine Floor', yesOrNa(hasMezzanine)],
    ['37', 'Decking Sheet', yesOrNa(hasDeckSheet)],
    ['38', 'Shear Studs', yesOrNa(hasDeckSheet)],
    ['39', 'Joint Bolt', 'Yes'],
    ['40', 'Anchor Bolt', 'NA'],
    ['41', 'Stair', yesOrNa(hasStair)],
    ['42', 'Handrail', yesOrNa(Number(accessories.handrailWeightKg) > 0)],
    ['43', 'Lift Supporting Structure', yesOrNa(accessories.liftStructureEnabled === true)],
    ['44', 'Lift Device', 'NA'],
  ]
}


/** General Scope: SL No., Items, Responsibility. */
const GENERAL_SCOPE: readonly Row[] = [
  ['1', 'Design', 'By Floreat'],
  ['2', 'Approval Drawings', 'By Floreat'],
  ['3', 'Fabrication Drawings', 'By Floreat'],
  ['4', 'Fabrication', 'By Floreat'],
  ['5', 'Delivery', 'By Floreat'],
  ['6', 'Erection', 'By Floreat'],
  ['7', 'Transportation', 'By Floreat'],
  ['8', 'Loading & Unloading', 'By Floreat'],
]

/** Chapter 1 — building description, steel work finishes and general scope. */
export function ChapterScopeOfWork() {
  const { projectInfo, roof, accessories, canopy, mezzanine, stair } = useQuotationStore(
    useShallow((state) => ({
      projectInfo: state.projectInfo,
      roof: state.roof,
      accessories: state.accessories,
      canopy: state.canopy,
      mezzanine: state.mezzanine,
      stair: state.stair,
    })),
  )
  const buildingDescription = getBuildingDescription({ projectInfo, roof, accessories, canopy, mezzanine, stair })
  const steelFinishes: readonly Row[] = [
    ['1', 'Frame, Built-up / HR Sections / Bracings',
      hasValue(accessories.framesPrimerCoats) && hasValue(accessories.framesPaintCoats)
        ? `${accessories.framesPrimerCoats} Coat of EPOXY PRIMER and ${accessories.framesPaintCoats} Coat of EPOXY PAINT`
        : 'NA'],
    ['2', 'Purlins / Girt',
      hasValue(accessories.purlinsGirtsGsm)
        ? `Pre Galvanised ${accessories.purlinsGirtsGsm} Gsm — UNPAINTED`
        : 'NA'],
    ['3', 'Foundation Bolt', 'Black Un Painted'],
  ]
  return (
    <DocChapter eyebrow="Chapter 1" title="Scope of Work" className="space-y-6">
      <DocSubsection title="Building Description">
        <DocTable
          caption="Building configuration parameters and their values"
          columns={DESCRIPTION_COLUMNS}
          rows={buildingDescription}
        />
      </DocSubsection>

      <DocSubsection title="Steel Work Finishes">
        <DocTable
          caption="Paint and coating finish per steel work item"
          columns={FINISHES_COLUMNS}
          rows={steelFinishes}
        />
      </DocSubsection>

      <DocSubsection title="General Scope">
        <DocTable
          caption="Responsibility for each phase of work"
          columns={SCOPE_COLUMNS}
          rows={GENERAL_SCOPE}
        />
      </DocSubsection>
    </DocChapter>
  )
}
