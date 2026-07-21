import { useQuotationStore } from '@/stores/quotation-store'
import { useShallow } from 'zustand/react/shallow'
import { DEFAULT_AMOUNT_ITEMS } from '@/schemas/amount.schema'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator } from 'lucide-react'
import { qtyN5SteelStructures } from '@floreat/shared/calc'

/**
 * Read-only bill-of-quantities table for Step 11. Displays the 36 canonical
 * amount line items. Only STEEL STRUCTURES (N5) has its quantity wired to the
 * shared calc so far; the rest stay zero until the remaining equations land.
 */
export function AmountTable() {
  const { roof, canopy, mezzanine, stair } = useQuotationStore(
    useShallow((s) => ({ roof: s.roof, canopy: s.canopy, mezzanine: s.mezzanine, stair: s.stair })),
  )

  const steelQty = qtyN5SteelStructures({
    buildingOverallLength: roof.buildingOverallLength,
    buildingOverallWidth: roof.buildingOverallWidth,
    roofSlope: roof.roofSlope,
    materialConsumptionExcludingPurlin: roof.materialConsumptionExcludingPurlin,
    canopy0Length: canopy.canopies[0]?.length,
    canopy0Width: canopy.canopies[0]?.width,
    canopy0MaterialConsumptionKgPerSqft: canopy.canopies[0]?.materialConsumptionKgPerSqft,
    mez0LengthM: mezzanine.floors[0]?.lengthM,
    mez0WidthM: mezzanine.floors[0]?.widthM,
    mez0MaterialConsumptionKgPerSqft: mezzanine.floors[0]?.materialConsumptionKgPerSqft,
    mez1LengthM: mezzanine.floors[1]?.lengthM,
    mez1WidthM: mezzanine.floors[1]?.widthM,
    areaDeduction0AreaM2: stair.areaDeductions[0]?.areaM2,
    areaDeduction0Numbers: stair.areaDeductions[0]?.numbers,
    stair0Length: stair.stairs[0]?.length,
    stair0Width: stair.stairs[0]?.width,
    stair0Height: stair.stairs[0]?.height,
    stair0NumberOfMidLanding: stair.stairs[0]?.numberOfMidLanding,
    stair0UnitWeightOfStringer: stair.stairs[0]?.unitWeightOfStringer,
  })

  const quantities: Record<string, number> = {
    'STEEL STRUCTURES': steelQty,
  }

  return (
    <SectionCard icon={<Calculator />} title="Amount">
      <Table className="min-w-[1400px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-right">#</TableHead>
            <TableHead className="min-w-52">Description</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Rate Fab.</TableHead>
            <TableHead className="text-right">Rate Erec.</TableHead>
            <TableHead className="text-right">Rate Load.</TableHead>
            <TableHead className="text-right">Amt. Fab.</TableHead>
            <TableHead className="text-right">Amt. Erec.</TableHead>
            <TableHead className="text-right">Amt. Load.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DEFAULT_AMOUNT_ITEMS.map((item, index) => {
            const qty = quantities[item.description] ?? 0
            return (
              <TableRow key={item.description}>
                <TableCell className="text-right text-muted-foreground">
                  <Num>{index + 1}</Num>
                </TableCell>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.unit}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>{qty.toFixed(3)}</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
                <TableCell className="text-right text-muted-foreground"><Num>0</Num></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
