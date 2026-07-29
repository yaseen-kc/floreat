import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Rows3 } from 'lucide-react'
import { deriveLineItemQuantity } from '@floreat/shared/calc'
import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type DoorsWindowsFoldedPlatesRow = {
  key: 'door' | 'window' | 'foldedPlate'
  label: string
  firstField: 'doorHeight' | 'windowHeight' | 'foldedPlateLength'
  widthField: 'doorWidth' | 'windowWidth' | 'foldedPlateWidth'
  nosField: 'doorNos' | 'windowNos' | 'foldedPlateNos'
}

const DOORS_WINDOWS_FOLDED_PLATES_ROWS: DoorsWindowsFoldedPlatesRow[] = [
  { key: 'door', label: 'Doors', firstField: 'doorHeight', widthField: 'doorWidth', nosField: 'doorNos' },
  { key: 'window', label: 'Windows', firstField: 'windowHeight', widthField: 'windowWidth', nosField: 'windowNos' },
  { key: 'foldedPlate', label: 'Folded Plates', firstField: 'foldedPlateLength', widthField: 'foldedPlateWidth', nosField: 'foldedPlateNos' },
]

const hasValue = (value: unknown) => value !== undefined && value !== null

export function DoorsWindowsFoldedPlates() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )
  const [enabledOverrides, setEnabledOverrides] = useState<Partial<Record<DoorsWindowsFoldedPlatesRow['key'], boolean>>>({})

  const toggleRow = (row: DoorsWindowsFoldedPlatesRow, checked: boolean) => {
    setEnabledOverrides((current) => ({ ...current, [row.key]: checked }))
    if (!checked) {
      setAccessories({
        [row.firstField]: undefined,
        [row.widthField]: undefined,
        [row.nosField]: undefined,
      } as Partial<AccessoriesDraft>)
    }
  }

  return (
    <SectionCard icon={<Rows3 className="w-3.5 h-3.5" />} title="Doors, Windows & Folded Plates">
      <Table className="min-w-[760px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 text-center">SL</TableHead>
            <TableHead className="w-12 text-center"> </TableHead>
            <TableHead>Accessory</TableHead>
            <TableHead className="min-w-44">Height/Length</TableHead>
            <TableHead className="min-w-36">Width</TableHead>
            <TableHead className="w-32">Nos</TableHead>
            <TableHead className="w-32 text-right">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DOORS_WINDOWS_FOLDED_PLATES_ROWS.map((row, index) => {
            const firstValue = accessories[row.firstField] as number | undefined
            const widthValue = accessories[row.widthField] as number | undefined
            const nosValue = accessories[row.nosField] as number | undefined
            const hasPersistedValue = hasValue(firstValue) || hasValue(widthValue) || hasValue(nosValue)
            const isEnabled = enabledOverrides[row.key] ?? hasPersistedValue
            const quantity = isEnabled ? deriveLineItemQuantity(firstValue, widthValue, nosValue) : undefined

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
                  <InputUnit
                    value={firstValue}
                    unit="m"
                    readOnly={!isEnabled}
                    onChange={(value) => setAccessories({ [row.firstField]: value } as Partial<AccessoriesDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <InputUnit
                    value={widthValue}
                    unit="m"
                    readOnly={!isEnabled}
                    onChange={(value) => setAccessories({ [row.widthField]: value } as Partial<AccessoriesDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <InputUnit
                    value={nosValue}
                    unit="Nos"
                    step={1}
                    readOnly={!isEnabled}
                    onChange={(value) => setAccessories({ [row.nosField]: value } as Partial<AccessoriesDraft>)}
                  />
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {quantity !== undefined ? `${quantity} m2` : '-'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
