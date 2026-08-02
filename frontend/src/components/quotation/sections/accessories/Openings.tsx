import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Blinds } from 'lucide-react'
import { deriveLineItemQuantity } from '@floreat/shared/calc'
import { useQuotationStore } from '@/stores/quotation-store'
import type { AccessoriesDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { InputUnit } from '@/components/quotation/shared/InputUnit'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type OpeningRow = {
  key: 'rollingShutter' | 'louver' | 'skyLight' | 'wallLight'
  label: string
  lengthField: 'rollingShutterLength' | 'louverLength' | 'skyLightLength' | 'wallLightLength'
  widthField: 'rollingShutterWidth' | 'louverWidth' | 'skyLightWidth' | 'wallLightWidth'
  nosField: 'rollingShutterNos' | 'louverNos' | 'skyLightNos' | 'wallLightNos'
}

const OPENING_ROWS: OpeningRow[] = [
  { key: 'rollingShutter', label: 'Rolling Shutter', lengthField: 'rollingShutterLength', widthField: 'rollingShutterWidth', nosField: 'rollingShutterNos' },
  { key: 'louver', label: 'Louver', lengthField: 'louverLength', widthField: 'louverWidth', nosField: 'louverNos' },
  { key: 'skyLight', label: 'Sky Light', lengthField: 'skyLightLength', widthField: 'skyLightWidth', nosField: 'skyLightNos' },
  { key: 'wallLight', label: 'Wall Light', lengthField: 'wallLightLength', widthField: 'wallLightWidth', nosField: 'wallLightNos' },
]

const hasValue = (value: unknown) => value !== undefined && value !== null

/** Openings fields for Step 6. */
export function Openings() {
  const { accessories, setAccessories } = useQuotationStore(
    useShallow((s) => ({ accessories: s.accessories, setAccessories: s.setAccessories })),
  )
  const [enabledOverrides, setEnabledOverrides] = useState<Partial<Record<OpeningRow['key'], boolean>>>({})

  const toggleRow = (row: OpeningRow, checked: boolean) => {
    setEnabledOverrides((current) => ({ ...current, [row.key]: checked }))
    if (!checked) {
      setAccessories({
        [row.lengthField]: undefined,
        [row.widthField]: undefined,
        [row.nosField]: undefined,
      } as Partial<AccessoriesDraft>)
    }
  }

  return (
    <SectionCard icon={<Blinds className="w-3.5 h-3.5" />} title="Openings">
      <Table className="min-w-[760px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 text-center">SL</TableHead>
            <TableHead className="w-12 text-center"> </TableHead>
            <TableHead>Opening</TableHead>
            <TableHead className="min-w-44">Length</TableHead>
            <TableHead className="min-w-36">Width</TableHead>
            <TableHead className="w-32">Nos</TableHead>
            <TableHead className="w-32 text-right">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {OPENING_ROWS.map((row, index) => {
            const length = accessories[row.lengthField] as number | undefined
            const width = accessories[row.widthField] as number | undefined
            const nos = accessories[row.nosField] as number | undefined
            const hasPersistedValue = hasValue(length) || hasValue(width) || hasValue(nos)
            const isEnabled = enabledOverrides[row.key] ?? hasPersistedValue
            const quantity = isEnabled ? deriveLineItemQuantity(length, width, nos) : undefined

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
                    value={length}
                    unit="m"
                    readOnly={!isEnabled}
                    onChange={(value) => setAccessories({ [row.lengthField]: value } as Partial<AccessoriesDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <InputUnit
                    value={width}
                    unit="m"
                    readOnly={!isEnabled}
                    onChange={(value) => setAccessories({ [row.widthField]: value } as Partial<AccessoriesDraft>)}
                  />
                </TableCell>
                <TableCell>
                  <InputUnit
                    value={nos}
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
