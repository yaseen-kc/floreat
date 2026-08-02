import { useQuotationStore } from '@/stores/quotation-store'
import type { MezzanineExtensionDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { StretchHorizontal, Plus, Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  MEZZANINE_TYPE_OPTIONS,
  MEZZANINE_FLOOR_LEVEL_OPTIONS,
  MEZZANINE_HEIGHT_FROM_OPTIONS,
  getAvailableMezzanineFloorOptions,
} from './mezzanineOptions'

export function MezzanineExtensions() {
  const { floors, extensions, setMezzanine } = useQuotationStore(
    useShallow((s) => ({
      floors: s.mezzanine.floors,
      extensions: s.mezzanine.extensions,
      setMezzanine: s.setMezzanine,
    })),
  )

  const availableFloorOptions = getAvailableMezzanineFloorOptions(floors)

  const withCodes = (rows: MezzanineExtensionDraft[]): MezzanineExtensionDraft[] =>
    rows.map((row, i) => ({ ...row, code: `EXT_${i + 1}` as MezzanineExtensionDraft['code'] }))

  const addRow = () => setMezzanine({ extensions: withCodes([...extensions, {}]) })
  const removeRow = (index: number) => setMezzanine({ extensions: withCodes(extensions.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<MezzanineExtensionDraft>) =>
    setMezzanine({ extensions: extensions.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <SectionCard icon={<StretchHorizontal className="w-3.5 h-3.5" />} title="Floor Extensions">
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        {extensions.length === 0 && (
          <EmptyState
            icon={<StretchHorizontal />}
            title="No extensions added yet."
            description="Add a floor extension to include it in this quotation."
          />
        )}

        {extensions.length > 0 && (
          <Table className="min-w-[2380px] border-collapse text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead rowSpan={2} scope="col" className="w-12 border-r text-center">Sl</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-32 border-r">ID</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r">Floor</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Type</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-32 border-r text-center">Thick (MM)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Length (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Width (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-28 border-r text-center">Height (M)</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Height From</TableHead>
                <TableHead rowSpan={2} scope="col" className="min-w-36 border-r">Typical To</TableHead>
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
              {extensions.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="border-r">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs font-medium">{row.code ?? `EXT_${index + 1}`}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto shrink-0"
                        aria-label={`Remove extension ${index + 1}`}
                        title={`Remove extension ${index + 1}`}
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
                      options={availableFloorOptions}
                      required={false}
                      error={false}
                      value={row.floor}
                      onChange={(value) => updateRow(index, { floor: value as MezzanineExtensionDraft['floor'] })}
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
                      onChange={(value) => updateRow(index, { type: value as MezzanineExtensionDraft['type'] })}
                    />
                  </TableCell>
                  {([
                    ['thicknessMm', 'Thickness', 'mm'],
                    ['lengthM', 'Length', 'm'],
                    ['widthM', 'Width', 'm'],
                    ['heightM', 'Height', 'm'],
                  ] as const).map(([name, label, unit]) => (
                    <TableCell key={name} className="min-w-28 border-r">
                      <NumberField
                        className="[&>label]:sr-only"
                        label={label}
                        unit={unit}
                        required={false}
                        error={false}
                        value={row[name]}
                        onChange={(value) => updateRow(index, { [name]: value })}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="min-w-36 border-r">
                    <SelectField
                      className="[&>label]:sr-only"
                      label="Height From"
                      options={MEZZANINE_HEIGHT_FROM_OPTIONS}
                      required={false}
                      error={false}
                      value={row.heightFrom}
                      onChange={(value) => updateRow(index, { heightFrom: value as MezzanineExtensionDraft['heightFrom'] })}
                    />
                  </TableCell>
                  <TableCell className="min-w-36 border-r">
                    <SelectField
                      className="[&>label]:sr-only"
                      label="Typical To"
                      options={MEZZANINE_FLOOR_LEVEL_OPTIONS}
                      required={false}
                      error={false}
                      value={row.typicalTo}
                      onChange={(value) => updateRow(index, { typicalTo: value as MezzanineExtensionDraft['typicalTo'] })}
                    />
                  </TableCell>
                  {([
                    ['beamsMidPrimary', 'Mid Primary Beams'],
                    ['beamsEndPrimary', 'End Primary Beams'],
                    ['beamsSecondary', 'Secondary Beams'],
                    ['jointsMidPrimary', 'Mid Primary Beam Joints'],
                    ['jointsEndPrimary', 'End Primary Beam Joints'],
                    ['extendedColumnsMidPrimary', 'Mid Primary Internal Columns'],
                    ['extendedColumnsEndPrimary', 'End Primary Internal Columns'],
                  ] as const).map(([name, label], fieldIndex) => (
                    <TableCell key={name} className={fieldIndex === 6 ? 'min-w-32' : 'min-w-32 border-r'}>
                      <NumberField
                        className="[&>label]:sr-only"
                        label={label}
                        unit="count"
                        required={false}
                        error={false}
                        step={1}
                        value={row[name]}
                        onChange={(value) => updateRow(index, { [name]: value })}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div>
          <Button type="button" variant="outline" size="sm" onClick={addRow}>
            <Plus /> Add extension
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
