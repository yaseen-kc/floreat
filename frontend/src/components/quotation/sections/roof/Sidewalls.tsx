import { useQuotationStore } from '@/stores/quotation-store'
import { normalizeSidewalls, SIDEWALL_SIDES, type RoofDraft } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { CollapsibleSection } from '@/components/quotation/shared/CollapsibleSection'
import { NumberField } from '@/components/quotation/shared/NumberField'
import { SelectField, type SelectFieldOption } from '@/components/quotation/shared/SelectField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Fence } from 'lucide-react'

/** A single sidewall row in the draft (inline `sidewalls` array element). */
type SidewallRow = NonNullable<RoofDraft['sidewalls']>[number]

/** Human-readable labels for the wall-type enum. */
const WALL_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'BRICK', label: 'Brick' },
  { value: 'PANEL', label: 'Panel' },
  { value: 'LATERITE', label: 'Laterite' },
  { value: 'AAC', label: 'AAC' },
  { value: 'BLOCK', label: 'Block' },
]

/** A fresh sidewall row — numeric fields start at 0 so validation flags them. */
const SIDE_LABELS: Record<(typeof SIDEWALL_SIDES)[number], string> = {
  FRONT: 'Front',
  BACK: 'Back',
  RIGHT: 'Right',
  LEFT: 'Left',
}

export function Sidewalls() {
  const { roof, setRoof, enabled, toggleRoofSection, showValidation } = useQuotationStore(
    useShallow((s) => ({
      roof: s.roof,
      setRoof: s.setRoof,
      enabled: s.roofSectionsEnabled.sidewalls,
      toggleRoofSection: s.toggleRoofSection,
      showValidation: s.showValidation,
    })),
  )
  const rows = normalizeSidewalls(roof.sidewalls)

  const updateRow = (index: number, patch: Partial<SidewallRow>) =>
    setRoof({ sidewalls: rows.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  return (
    <CollapsibleSection
      icon={<Fence className="w-3.5 h-3.5" />}
      title="Sidewalls"
      enabled={enabled}
      onToggle={(e) => toggleRoofSection('sidewalls', e)}
    >
      <div className="flex flex-col gap-[18px] desktop:gap-6">
        <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="w-20">No</TableHead>
                <TableHead scope="col">Side</TableHead>
                <TableHead scope="col">Type</TableHead>
                <TableHead scope="col">Thick</TableHead>
                <TableHead scope="col">Height</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.side}>
                  <TableCell>
                    <span>{index + 1}</span>
                  </TableCell>
                  <TableCell className="min-w-36">
                    <span className="font-medium">{SIDE_LABELS[row.side]}</span>
                  </TableCell>
                  <TableCell className="min-w-40">
              <SelectField
                className="[&>label]:sr-only"
                label="Wall Type"
                options={WALL_TYPE_OPTIONS}
                required={enabled}
                error={false}
                value={row.wallType}
                onChange={(v) => updateRow(index, { wallType: v as SidewallRow['wallType'] })}
              />
                  </TableCell>
                  <TableCell className="min-w-36">
              <NumberField
                className="[&>label]:sr-only"
                label="Thickness"
                unit="mm"
                required={enabled}
                error={showValidation && enabled && !(row.thickness > 0)}
                value={row.thickness === 0 ? undefined : row.thickness}
                onChange={(v) => updateRow(index, { thickness: v ?? 0 })}
              />
                  </TableCell>
                  <TableCell className="min-w-36">
              <NumberField
                className="[&>label]:sr-only"
                label="Height"
                unit="m"
                required={enabled}
                error={showValidation && enabled && !(row.height > 0)}
                value={row.height === 0 ? undefined : row.height}
                onChange={(v) => updateRow(index, { height: v ?? 0 })}
              />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>
    </CollapsibleSection>
  )
}
