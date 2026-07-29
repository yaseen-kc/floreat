import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Droplets } from 'lucide-react'
import { deriveAccessoryQuantities } from '@floreat/shared/calc'
import type { AccessoryQuantities } from '@floreat/shared/calc'
import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft, RoofDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DRAINAGE_MATERIAL_OPTIONS,
  DRAINAGE_SIZE_OPTIONS,
  FLASHING_TYPE_OPTIONS,
  FLASHING_THICKNESS_OPTIONS,
  PARTITION_TYPE_OPTIONS,
  PARTITION_THICKNESS_OPTIONS,
} from './accessoriesOptions'

type SelectOption = { value: string; label: string }

type DrainageFlashingPartitionRow = {
  key: string
  label: string
  typeField?: keyof AccessoriesDraft
  sizeField?: keyof AccessoriesDraft
  quantityField?: keyof AccessoriesDraft
  manualField?: keyof AccessoriesDraft
  typeOptions?: SelectOption[]
  sizeOptions?: SelectOption[]
  previewField?: keyof AccessoryQuantities
  quantityUnit?: string
  quantityMode: 'derived' | 'manual' | 'none'
}

const DRAINAGE_FLASHING_PARTITION_ROWS: DrainageFlashingPartitionRow[] = [
  {
    key: 'gutter', label: 'Gutter', typeField: 'gutterType', sizeField: 'gutterSize',
    quantityField: 'gutterQuantity', manualField: 'gutterQuantityManual',
    typeOptions: DRAINAGE_MATERIAL_OPTIONS, sizeOptions: DRAINAGE_SIZE_OPTIONS, previewField: 'gutterQuantity', quantityMode: 'derived',
  },
  {
    key: 'downTake', label: 'Down Take', typeField: 'downTakeType', sizeField: 'downTakeSize',
    quantityField: 'downTakeQuantity', manualField: 'downTakeQuantityManual',
    typeOptions: DRAINAGE_MATERIAL_OPTIONS, sizeOptions: DRAINAGE_SIZE_OPTIONS, previewField: 'downTakeQuantity', quantityMode: 'derived',
  },
  {
    key: 'dripTrim', label: 'Drip Trim', typeField: 'dripTrimType', sizeField: 'dripTrimThickness',
    quantityField: 'dripTrimQuantity', manualField: 'dripTrimQuantityManual',
    typeOptions: FLASHING_TYPE_OPTIONS, sizeOptions: FLASHING_THICKNESS_OPTIONS, previewField: 'dripTrimQuantity', quantityMode: 'derived',
  },
  {
    key: 'gableEndFlashing', label: 'Gable End Flashing', typeField: 'gableEndFlashingType', sizeField: 'gableEndFlashingThickness',
    quantityField: 'gableEndFlashingQuantity', manualField: 'gableEndFlashingQuantityManual',
    typeOptions: FLASHING_TYPE_OPTIONS, sizeOptions: FLASHING_THICKNESS_OPTIONS, previewField: 'gableEndFlashingQuantity', quantityMode: 'derived',
  },
  {
    key: 'cornerFlash', label: 'Corner Flash', typeField: 'cornerFlashType', sizeField: 'cornerFlashThickness',
    quantityField: 'cornerFlashQuantity', manualField: 'cornerFlashQuantityManual',
    typeOptions: FLASHING_TYPE_OPTIONS, sizeOptions: FLASHING_THICKNESS_OPTIONS, previewField: 'cornerFlashQuantity', quantityMode: 'derived',
  },
  {
    key: 'ridge', label: 'Ridge', typeField: 'ridgeType', sizeField: 'ridgeThickness',
    quantityField: 'ridgeQuantity', manualField: 'ridgeQuantityManual',
    typeOptions: FLASHING_TYPE_OPTIONS, sizeOptions: FLASHING_THICKNESS_OPTIONS, previewField: 'ridgeQuantity', quantityMode: 'derived',
  },
  {
    key: 'partition', label: 'Partition', typeField: 'partitionType', sizeField: 'partitionThickness',
    quantityField: 'partitionQuantity', typeOptions: PARTITION_TYPE_OPTIONS, sizeOptions: PARTITION_THICKNESS_OPTIONS,
    quantityUnit: 'sqft', quantityMode: 'manual',
  },
]

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== ''

export function DrainageFlashingPartition() {
  const { accessories, setAccessories, roof } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories, roof: s.roof })),
  )
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({})
  const preview = derivePreview(roof)

  const toggleRow = (row: DrainageFlashingPartitionRow, checked: boolean) => {
    setEnabledOverrides((current) => ({ ...current, [row.key]: checked }))
    if (!checked) {
      setAccessories({
        ...(row.typeField ? { [row.typeField]: undefined } : {}),
        ...(row.sizeField ? { [row.sizeField]: undefined } : {}),
        ...(row.quantityField ? { [row.quantityField]: undefined } : {}),
        ...(row.manualField ? { [row.manualField]: undefined } : {}),
      } as Partial<AccessoriesDraft>)
    }
  }

  return (
    <SectionCard icon={<Droplets className="w-3.5 h-3.5" />} title="Drainage, Flashing & Partition">
      <Table className="min-w-[980px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 text-center">SL</TableHead>
            <TableHead className="w-12 text-center"> </TableHead>
            <TableHead className="min-w-44">Accessory</TableHead>
            <TableHead className="min-w-44">Material/Type</TableHead>
            <TableHead className="min-w-44">Size/Thickness</TableHead>
            <TableHead className="w-40">Qty</TableHead>
            <TableHead className="w-28 text-center">Override</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DRAINAGE_FLASHING_PARTITION_ROWS.map((row, index) => {
            const typeValue = row.typeField ? accessories[row.typeField] : undefined
            const sizeValue = row.sizeField ? accessories[row.sizeField] : undefined
            const isManual = row.manualField ? accessories[row.manualField] === true : false
            const quantityValue = row.quantityField ? accessories[row.quantityField] : undefined
            const hasPersistedValue = hasValue(typeValue) || hasValue(sizeValue) || hasValue(quantityValue) || isManual
            const isEnabled = enabledOverrides[row.key] ?? hasPersistedValue
            const quantity = row.quantityMode === 'manual'
              ? quantityValue as number | undefined
              : row.quantityMode === 'derived' && row.previewField
                ? isManual ? quantityValue as number | undefined : preview[row.previewField] as number | undefined
                : undefined

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
                  {row.typeField && row.typeOptions ? (
                    <Select
                      value={String(typeValue ?? '')}
                      onValueChange={(value) => setAccessories({ [row.typeField!]: value } as Partial<AccessoriesDraft>)}
                      disabled={!isEnabled}
                    >
                      <SelectTrigger className="w-full" aria-label={`${row.label} material`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {row.typeOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  {row.sizeField && row.sizeOptions ? (
                    <Select
                      value={String(sizeValue ?? '')}
                      onValueChange={(value) => setAccessories({ [row.sizeField!]: value } as Partial<AccessoriesDraft>)}
                      disabled={!isEnabled}
                    >
                      <SelectTrigger className="w-full" aria-label={`${row.label} size`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {row.sizeOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  {row.quantityField ? (
                    <InputUnit
                      value={isEnabled ? quantity : undefined}
                      unit={row.quantityUnit ?? 'm'}
                      readOnly={!isEnabled || row.quantityMode === 'derived' && !isManual}
                      onChange={(value) => setAccessories({ [row.quantityField!]: value } as Partial<AccessoriesDraft>)}
                    />
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-center">
                  {row.manualField ? (
                    <Switch
                      checked={isManual}
                      disabled={!isEnabled}
                      onCheckedChange={(checked) =>
                        setAccessories(
                          (checked
                            ? { [row.manualField!]: true }
                            : { [row.quantityField!]: undefined, [row.manualField!]: undefined }) as Partial<AccessoriesDraft>,
                        )
                      }
                      aria-label={`Override ${row.label} quantity`}
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

function derivePreview(roof: RoofDraft): AccessoryQuantities {
  const sidewalls = roof.sidewalls ?? []
  const front = sidewalls.find((w) => w.side === 'FRONT' && w.height > 0)
  const left = sidewalls.find((w) => w.side === 'LEFT' && w.height > 0)

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
