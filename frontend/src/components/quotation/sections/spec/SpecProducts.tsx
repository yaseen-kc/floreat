import { useShallow } from 'zustand/react/shallow'
import { useQuotationStore } from '@/stores/quotation-store'
import type { SpecProductDraft } from '@/stores/quotation-store'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Plus, Trash2 } from 'lucide-react'

/** Empty string → `undefined`, so blank cells are dropped from the payload. */
const opt = (v: string): string | undefined => (v.trim() ? v : undefined)

/**
 * The product-specification table for Step 9 — one row per product with a
 * description, specification, make / brand and an optional yield strength. Rows
 * can be added and removed; every field is optional and blank rows are dropped
 * by `buildSpecPayload`.
 */
export function SpecProducts() {
  const { products, setSpec } = useQuotationStore(
    useShallow((s) => ({ products: s.spec.products, setSpec: s.setSpec })),
  )

  // ponytail: codes are reassigned PRODUCT-1..PRODUCT-n by position on every add/remove.
  const withCodes = (rows: SpecProductDraft[]): SpecProductDraft[] =>
    rows.map((row, i) => ({ ...row, code: `PRODUCT-${i + 1}` }))

  const addRow = () => setSpec({ products: withCodes([...products, {}]) })
  const removeRow = (index: number) => setSpec({ products: withCodes(products.filter((_, i) => i !== index)) })
  const updateRow = (index: number, patch: Partial<SpecProductDraft>) =>
    setSpec({ products: products.map((row, i) => (i === index ? { ...row, ...patch } : row)) })

  const addButton = (
    <Button type="button" variant="outline" size="sm" onClick={addRow}>
      <Plus /> Add product
    </Button>
  )

  return (
    <SectionCard icon={<FileText className="w-3.5 h-3.5" />} title="Product Specification" action={addButton}>
      {products.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No products added yet."
          description="Add a product to include it in this specification."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Specification</TableHead>
              <TableHead>Make / Brand</TableHead>
              <TableHead className="text-right">Yield Strength (MPa)</TableHead>
              <TableHead className="w-10" aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="min-w-40">
                  <Input
                    aria-label={`Product ${index + 1} description`}
                    value={row.description ?? ''}
                    onChange={(e) => updateRow(index, { description: opt(e.target.value) })}
                  />
                </TableCell>
                <TableCell className="min-w-40">
                  <Input
                    aria-label={`Product ${index + 1} specification`}
                    value={row.specification ?? ''}
                    onChange={(e) => updateRow(index, { specification: opt(e.target.value) })}
                  />
                </TableCell>
                <TableCell className="min-w-32">
                  <Input
                    aria-label={`Product ${index + 1} make or brand`}
                    value={row.makeOrBrand ?? ''}
                    onChange={(e) => updateRow(index, { makeOrBrand: opt(e.target.value) })}
                  />
                </TableCell>
                <TableCell className="min-w-28">
                  <Input
                    type="number"
                    inputMode="numeric"
                    className="text-right"
                    aria-label={`Product ${index + 1} yield strength`}
                    value={row.yieldStrengthMpa ?? ''}
                    onChange={(e) =>
                      updateRow(index, {
                        yieldStrengthMpa: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove product ${index + 1}`}
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  )
}
