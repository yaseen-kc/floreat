import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Fan, ToggleRight } from 'lucide-react'
import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { INSULATION_TYPE_OPTIONS, TURBO_VENTILATOR_DIAMETER_OPTIONS } from './accessoriesOptions'

type SelectOption = { value: string; label: string }

type InsulationVentilatorFeaturesRow =
  | { key: 'roofInsulation' | 'wallInsulation'; label: string; kind: 'select'; field: 'roofInsulationType' | 'wallInsulationType'; options: SelectOption[] }
  | { key: 'turboVentilator'; label: string; kind: 'select-number'; field: 'turboVentilatorDiameter'; numberField: 'turboVentilatorNos'; options: SelectOption[] }
  | { key: 'handrail'; label: string; kind: 'number'; numberField: 'handrailWeightKg'; unit: string }
  | { key: 'deckSheetFlashing' | 'gantryGirder' | 'liftStructure'; label: string; kind: 'toggle'; field: 'deckSheetFlashingEnabled' | 'gantryGirderEnabled' | 'liftStructureEnabled' }

const INSULATION_VENTILATOR_FEATURES_ROWS: InsulationVentilatorFeaturesRow[] = [
  { key: 'roofInsulation', label: 'Roof Insulation', kind: 'select', field: 'roofInsulationType', options: INSULATION_TYPE_OPTIONS },
  { key: 'wallInsulation', label: 'Wall Insulation', kind: 'select', field: 'wallInsulationType', options: INSULATION_TYPE_OPTIONS },
  { key: 'turboVentilator', label: 'Turbo Ventilator', kind: 'select-number', field: 'turboVentilatorDiameter', numberField: 'turboVentilatorNos', options: TURBO_VENTILATOR_DIAMETER_OPTIONS },
  { key: 'handrail', label: 'Handrail', kind: 'number', numberField: 'handrailWeightKg', unit: 'kg' },
  { key: 'deckSheetFlashing', label: 'Deck Sheet Flashing', kind: 'toggle', field: 'deckSheetFlashingEnabled' },
  { key: 'gantryGirder', label: 'Gantry Girder', kind: 'toggle', field: 'gantryGirderEnabled' },
  { key: 'liftStructure', label: 'Lift Structure', kind: 'toggle', field: 'liftStructureEnabled' },
]

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== ''

export function InsulationVentilatorFeatures() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({})

  const isRowEnabled = (row: InsulationVentilatorFeaturesRow) => {
    if (row.kind === 'toggle') return accessories[row.field] === true
    const hasPersistedValue = row.kind === 'number'
      ? hasValue(accessories[row.numberField])
      : row.kind === 'select-number'
        ? hasValue(accessories[row.field]) || hasValue(accessories[row.numberField])
        : hasValue(accessories[row.field])
    return enabledOverrides[row.key] ?? hasPersistedValue
  }

  const toggleRow = (row: InsulationVentilatorFeaturesRow, checked: boolean) => {
    if (row.kind === 'toggle') {
      setAccessories({ [row.field]: checked ? true : undefined } as Partial<AccessoriesDraft>)
      return
    }

    setEnabledOverrides((current) => ({ ...current, [row.key]: checked }))
    if (!checked) {
      setAccessories(
        (row.kind === 'number'
          ? { [row.numberField]: undefined }
          : row.kind === 'select-number'
            ? { [row.field]: undefined, [row.numberField]: undefined }
            : { [row.field]: undefined }) as Partial<AccessoriesDraft>,
      )
    }
  }

  return (
    <SectionCard icon={<Fan className="w-3.5 h-3.5" />} title="Insulation, Ventilator & Features">
      <Table className="min-w-[840px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 text-center">SL</TableHead>
            <TableHead className="w-12 text-center"> </TableHead>
            <TableHead className="min-w-52">Accessory</TableHead>
            <TableHead className="min-w-56">Type/Value</TableHead>
            <TableHead className="w-44">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INSULATION_VENTILATOR_FEATURES_ROWS.map((row, index) => {
            const isEnabled = isRowEnabled(row)

            return (
              <TableRow key={row.key} className={!isEnabled ? 'bg-muted/20' : undefined}>
                <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(event) => toggleRow(row, event.target.checked)}
                    aria-label={`Include ${row.label}`}
                    className="h-4 w-4 accent-primary"
                  />
                </TableCell>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell>
                  {row.kind === 'select' || row.kind === 'select-number' ? (
                    <Select
                      value={String(accessories[row.field] ?? '')}
                      onValueChange={(value) => setAccessories({ [row.field]: value } as Partial<AccessoriesDraft>)}
                      disabled={!isEnabled}
                    >
                      <SelectTrigger className="w-full" aria-label={`${row.label} type`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {row.options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : row.kind === 'toggle' ? (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <ToggleRight className="h-4 w-4" /> Enabled when checked
                    </span>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  {row.kind === 'select-number' ? (
                    <InputUnit
                      value={isEnabled ? accessories[row.numberField] as number | undefined : undefined}
                      unit="Nos"
                      step={1}
                      readOnly={!isEnabled}
                      onChange={(value) => setAccessories({ [row.numberField]: value } as Partial<AccessoriesDraft>)}
                    />
                  ) : row.kind === 'number' ? (
                    <InputUnit
                      value={isEnabled ? accessories[row.numberField] as number | undefined : undefined}
                      unit={row.unit}
                      readOnly={!isEnabled}
                      onChange={(value) => setAccessories({ [row.numberField]: value } as Partial<AccessoriesDraft>)}
                    />
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
