import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { SectionCard } from '@/components/quotation/shared/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Save } from 'lucide-react'

export interface SubRowDef {
  sl: string;
  desc: string;
  spec: string;
  unit: string;
  addlSpec?: string;
  addlUnit?: string;
  addlField?: string;
  purchField?: string;
  defaultQty?: string | number;
  isCalculated?: boolean;
}

export interface RowDef {
  sl: string;
  labelPrefix?: string;
  labelSuffix?: string;
  label: string;
  spec: string;
  specValue?: string;
  unit: string;
  addlSpec?: string;
  addlUnit?: string;
  qtyField: string;
  unitField: string | null;
  defaultQty?: string | number;
  isCalculated?: boolean;
  subRows: SubRowDef[];
}

export const getEditableFields = (rows: RowDef[]): string[] => {
  return rows.flatMap(r => {
    const fields = [r.qtyField];
    if (r.subRows) {
      r.subRows.forEach(sub => {
        if (sub.addlField) fields.push(sub.addlField);
        if (sub.purchField) fields.push(sub.purchField);
      });
    }
    return fields.filter(Boolean);
  });
}

export const toStr = (v: unknown): string => (v == null ? '' : String(v))

export const getDefaults = (rows: RowDef[]) => {
  const defs: Record<string, string | number> = {}
  rows.forEach(r => {
    if (r.qtyField && r.defaultQty !== undefined) defs[r.qtyField] = r.defaultQty
    r.subRows?.forEach(sub => {
      if (sub.addlField && sub.defaultQty !== undefined) defs[sub.addlField] = sub.defaultQty
      if (sub.purchField && sub.defaultQty !== undefined) defs[sub.purchField] = sub.defaultQty
    })
  })
  return defs
}

export const seedDrafts = (obj: Record<string, unknown> | null | undefined, rows: RowDef[]) => {
  const defs = getDefaults(rows)
  return Object.fromEntries(getEditableFields(rows).map((f) => [f, toStr(obj?.[f] ?? defs[f])]))
}

export interface SectionTableProps {
  icon: ReactNode
  title: string
  rows: RowDef[]
  sectionData: Record<string, string | number | boolean | null | undefined> | null
  draft: Record<string, string>
  onEdit: (field: string, value: string) => void
  onSave: () => void
  saving: boolean
  calculatedData?: Record<string, string | number | boolean | null | undefined> | null
}

export function SectionTable({ icon, title, rows, sectionData, draft, onEdit, onSave, saving, calculatedData }: SectionTableProps) {
  const isDirty = getEditableFields(rows).some((f) => (draft[f] ?? '') !== String(sectionData?.[f] ?? ''))

  return (
    <SectionCard
      icon={icon}
      title={title}
      action={
        <Button type="button" size="sm" variant={isDirty ? 'default' : 'ghost'} disabled={!isDirty || saving} onClick={onSave}>
          {saving ? <Spinner /> : <Save className="h-3.5 w-3.5" />}
          Save
        </Button>
      }
    >
      <Table className="min-w-[1000px] border-collapse text-sm">
        <TableHeader>
          <TableRow className="bg-muted/50 border-b">
            <TableHead className="w-12 border-r">SL No.</TableHead>
            <TableHead colSpan={2} className="min-w-44 border-r">DESCRIPTION</TableHead>
            <TableHead colSpan={3} className="min-w-44 border-r">SPECIFICATION</TableHead>
            <TableHead className="w-20 border-r text-center">UNIT</TableHead>
            <TableHead className="w-32 text-right">QUANTITY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const unitVal = (row.unitField && sectionData?.[row.unitField]) || row.unit;
            const unitDisplay = unitVal ? <Badge variant="outline">{String(unitVal)}</Badge> : <span className="text-muted-foreground">—</span>;
            
            return (
              <Fragment key={row.qtyField}>
                <TableRow className="border-b">
                  <TableCell className="border-r font-medium text-muted-foreground">{row.sl}</TableCell>
                  {row.labelPrefix ? (
                    <Fragment>
                      <TableCell className="border-r font-semibold text-center">{row.labelPrefix}</TableCell>
                      <TableCell className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                    </Fragment>
                  ) : row.labelSuffix ? (
                    <Fragment>
                      <TableCell className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                      <TableCell className="border-r font-semibold text-center">{row.labelSuffix}</TableCell>
                    </Fragment>
                  ) : (
                    <TableCell colSpan={2} className="border-r font-semibold">{row.label.toUpperCase()}</TableCell>
                  )}
                  {row.addlSpec ? (
                    <Fragment>
                      <TableCell className="border-r font-mono text-xs">{row.spec}</TableCell>
                      <TableCell className="border-r text-center">{row.unit}</TableCell>
                      <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{row.addlSpec}</TableCell>
                      <TableCell className="border-r text-center">{row.addlUnit}</TableCell>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <TableCell colSpan={row.specValue ? 2 : 3} className="border-r font-mono text-xs">{row.spec || '—'}</TableCell>
                      {row.specValue && <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{row.specValue}</TableCell>}
                      <TableCell className="border-r text-center">{unitDisplay}</TableCell>
                    </Fragment>
                  )}
                  <TableCell className="text-right p-1 align-middle">
                    {row.isCalculated ? (
                      <Input
                        readOnly
                        disabled
                        className="text-right font-mono tabular-nums h-8 bg-muted"
                        value={calculatedData?.[row.qtyField] !== undefined ? (typeof calculatedData[row.qtyField] === 'number' ? (calculatedData[row.qtyField] as number).toFixed(2) : String(calculatedData[row.qtyField])) : '—'}
                        aria-label={`${row.label} calculated`}
                      />
                    ) : (
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        className="text-right font-mono tabular-nums h-8"
                        value={draft[row.qtyField] ?? ''}
                        onChange={(e) => onEdit(row.qtyField, e.target.value)}
                        aria-label={row.label}
                      />
                    )}
                  </TableCell>
                </TableRow>
                {(row.subRows || []).map((sub, j) => (
                  <TableRow key={j} className="border-b bg-muted/5">
                    <TableCell className="border-r text-center text-muted-foreground">{sub.sl}</TableCell>
                    <TableCell colSpan={2} className="border-r">{sub.desc}</TableCell>
                    {sub.addlSpec ? (
                      <Fragment>
                        <TableCell colSpan={sub.unit ? 1 : 2} className="border-r font-mono text-xs">{sub.spec}</TableCell>
                        {sub.unit && <TableCell className="border-r text-center">{sub.unit}</TableCell>}
                        <TableCell className="border-r text-center font-medium text-muted-foreground whitespace-nowrap">{sub.addlSpec}</TableCell>
                        <TableCell className="border-r text-center">{sub.addlUnit}</TableCell>
                        <TableCell className="text-right p-1 align-middle">
                          {sub.addlField && (
                            sub.isCalculated ? (
                              <Input
                                readOnly
                                disabled
                                className="text-right font-mono tabular-nums h-8 bg-muted"
                                value={calculatedData?.[sub.addlField] !== undefined ? (typeof calculatedData[sub.addlField] === 'number' ? (calculatedData[sub.addlField] as number).toFixed(2) : String(calculatedData[sub.addlField])) : '—'}
                                aria-label={`${sub.desc} additional calculated`}
                              />
                            ) : (
                              <Input
                                type="number"
                                inputMode="decimal"
                                min={0}
                                className="text-right font-mono tabular-nums h-8"
                                value={draft[sub.addlField] ?? ''}
                                onChange={(e) => onEdit(sub.addlField!, e.target.value)}
                                aria-label={`${sub.desc} additional`}
                              />
                            )
                          )}
                        </TableCell>
                      </Fragment>
                    ) : sub.spec === 'PURCHASE QUANTITY' ? (
                      <Fragment>
                        <TableCell colSpan={3} className="border-r text-center font-semibold text-muted-foreground">{sub.spec}</TableCell>
                        <TableCell className="border-r text-center">{sub.unit}</TableCell>
                        <TableCell className="text-right p-1 align-middle">
                          {sub.purchField && (
                            sub.isCalculated ? (
                              <Input
                                readOnly
                                disabled
                                className="text-right font-mono tabular-nums h-8 bg-muted"
                                value={calculatedData?.[sub.purchField] !== undefined ? (typeof calculatedData[sub.purchField] === 'number' ? (calculatedData[sub.purchField] as number).toFixed(2) : String(calculatedData[sub.purchField])) : '—'}
                                aria-label={`${sub.desc} purchase calculated`}
                              />
                            ) : (
                              <Input
                                type="number"
                                inputMode="decimal"
                                min={0}
                                className="text-right font-mono tabular-nums h-8"
                                value={draft[sub.purchField] ?? ''}
                                onChange={(e) => onEdit(sub.purchField!, e.target.value)}
                                aria-label={`${sub.desc} purchase`}
                              />
                            )
                          )}
                        </TableCell>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <TableCell className="border-r font-mono text-xs">{sub.spec}</TableCell>
                        <TableCell colSpan={2} className="border-r text-center">{sub.unit}</TableCell>
                        <TableCell className="border-r"></TableCell>
                        <TableCell></TableCell>
                      </Fragment>
                    )}
                  </TableRow>
                ))}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </SectionCard>
  )
}
