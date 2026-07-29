import { useQuotationStore } from '@/stores/quotation-store'
import type { MezzanineFloorDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { Layers3, Plus, Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  MEZZANINE_TYPE_OPTIONS,
  MEZZANINE_FLOOR_LEVEL_OPTIONS,
  MEZZANINE_HEIGHT_FROM_OPTIONS,
} from './mezzanineOptions'

export function MezzanineFloors() {
  const { floors, extensions, setMezzanine } = useQuotationStore(
    useShallow((s) => ({
      floors: s.mezzanine.floors,
      extensions: s.mezzanine.extensions,
      setMezzanine: s.setMezzanine,
    })),
  )

  // ponytail: codes are reassigned MEZ_1..MEZ_n by position on every add/remove.
  const withCodes = (rows: MezzanineFloorDraft[]): MezzanineFloorDraft[] =>
    rows.map((row, i) => ({ ...row, code: `MEZ_${i + 1}` as MezzanineFloorDraft['code'] }))

  const addRow = () => {
    if (floors.length >= 12) return
    setMezzanine({ floors: withCodes([...floors, {}]) })
  }
  const syncExtensionFloors = (nextFloors: MezzanineFloorDraft[]) => {
    const availableFloors = new Set(nextFloors.map((row) => row.floor).filter(Boolean))
    return extensions.map((row) => (
      row.floor && !availableFloors.has(row.floor) ? { ...row, floor: undefined } : row
    ))
  }
  const removeRow = (index: number) => {
    const nextFloors = withCodes(floors.filter((_, i) => i !== index))
    setMezzanine({ floors: nextFloors, extensions: syncExtensionFloors(nextFloors) })
  }
  const updateRow = (index: number, patch: Partial<MezzanineFloorDraft>) => {
    const nextFloors = floors.map((row, i) => (i === index ? { ...row, ...patch } : row))
    setMezzanine({ floors: nextFloors, extensions: syncExtensionFloors(nextFloors) })
  }

  return (
    <SectionCard icon={<Layers3 className="w-3.5 h-3.5" />} title="Floors">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {floors.length === 0 && (
          <EmptyState
            icon={<Layers3 />}
            title="No floors added yet."
            description="Add a mezzanine floor to include it in this quotation."
          />
        )}

        {floors.length > 0 && (
          <Table className="min-w-[2380px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead rowSpan={2} scope="col" className="w-12 border-r text-center">Sl</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-32 border-r">ID</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Floor</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Type</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-32 border-r text-center">Thickness (MM)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Length (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Width (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Height (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Height From</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-44 border-r text-center">Material Consumption</TableHead>
                <TableHead colSpan={3} scope="colgroup" className="border-r text-center">Number Of Beams</TableHead>
                <TableHead colSpan={2} scope="colgroup" className="border-r text-center">Number Of Joints In Beams</TableHead>
                <TableHead colSpan={2} scope="colgroup" className="text-center">Numbers Of Internal Columns</TableHead>
              </TableRow>
              <TableRow className="bg-muted/25">
                <TableHead scope="col" className="min-w-32 border-r text-center">Mid Primary</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">End Primary</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Secondary</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Mid Primary</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">End Primary</TableHead>
                <TableHead scope="col" className="min-w-32 border-r text-center">Mid Primary</TableHead>
                <TableHead scope="col" className="min-w-32 text-center">End Primary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {floors.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs font-medium">{row.code}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto shrink-0"
                        aria-label={`Remove floor ${index + 1}`}
                        title={`Remove floor ${index + 1}`}
                        onClick={() => removeRow(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-36 border-r">
                    <SelectField
                      className="[&>label]:sr-only"
                      label="Floor"
                      options={MEZZANINE_FLOOR_LEVEL_OPTIONS}
                      required={false}
                      error={false}
                      value={row.floor}
                      onChange={(value) => updateRow(index, { floor: value as MezzanineFloorDraft['floor'] })}
                    />
                  </TableCell>
                  <TableCell className="min-w-36 border-r">
                    <SelectField
                      className="[&>label]:sr-only"
                      label="Type"
                      options={MEZZANINE_TYPE_OPTIONS}
                      required={false}
                      error={false}
                      value={row.type}
                      onChange={(value) => updateRow(index, { type: value as MezzanineFloorDraft['type'] })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Thickness"
                      unit="mm"
                      required={false}
                      error={false}
                      value={row.thicknessMm}
                      onChange={(value) => updateRow(index, { thicknessMm: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-28 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Length"
                      unit="m"
                      required={false}
                      error={false}
                      value={row.lengthM}
                      onChange={(value) => updateRow(index, { lengthM: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-28 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Width"
                      unit="m"
                      required={false}
                      error={false}
                      value={row.widthM}
                      onChange={(value) => updateRow(index, { widthM: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-28 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Height"
                      unit="m"
                      required={false}
                      error={false}
                      value={row.heightM}
                      onChange={(value) => updateRow(index, { heightM: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-36 border-r">
                    <SelectField
                      className="[&>label]:sr-only"
                      label="Height From"
                      options={MEZZANINE_HEIGHT_FROM_OPTIONS}
                      required={false}
                      error={false}
                      value={row.heightFrom}
                      onChange={(value) => updateRow(index, { heightFrom: value as MezzanineFloorDraft['heightFrom'] })}
                    />
                  </TableCell>
                  <TableCell className="min-w-44 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Material Consumption"
                      unit="kg/sqft"
                      required={false}
                      error={false}
                      value={row.materialConsumptionKgPerSqft}
                      onChange={(value) => updateRow(index, { materialConsumptionKgPerSqft: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Mid Primary Beams"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.beamsMidPrimary}
                      onChange={(value) => updateRow(index, { beamsMidPrimary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="End Primary Beams"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.beamsEndPrimary}
                      onChange={(value) => updateRow(index, { beamsEndPrimary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Secondary Beams"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.beamsSecondary}
                      onChange={(value) => updateRow(index, { beamsSecondary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Mid Primary Beam Joints"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.jointsMidPrimary}
                      onChange={(value) => updateRow(index, { jointsMidPrimary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="End Primary Beam Joints"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.jointsEndPrimary}
                      onChange={(value) => updateRow(index, { jointsEndPrimary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32 border-r">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="Mid Primary Internal Columns"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.internalColumnsMidPrimary}
                      onChange={(value) => updateRow(index, { internalColumnsMidPrimary: value })}
                    />
                  </TableCell>
                  <TableCell className="min-w-32">
                    <NumberField
                      className="[&>label]:sr-only"
                      label="End Primary Internal Columns"
                      unit="count"
                      required={false}
                      error={false}
                      step={1}
                      value={row.internalColumnsEndPrimary}
                      onChange={(value) => updateRow(index, { internalColumnsEndPrimary: value })}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={floors.length >= 12}>
            <Plus /> Add floor
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
