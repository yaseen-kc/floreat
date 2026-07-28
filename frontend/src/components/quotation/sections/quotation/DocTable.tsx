import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Num } from '@/components/ui/num'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface DocColumn {
  /** Header text. Rendered as a mono uppercase `<th scope="col">`. */
  header: string
  /** Horizontal alignment of the body cells. Defaults to left. */
  align?: 'left' | 'center' | 'right'
  /** Tailwind width/min-width utility for the column. */
  className?: string
  /** Allow the cell to wrap onto multiple lines (long prose columns). */
  wrap?: boolean
  /** Render the cell as data — mono + tabular figures (DESIGN.md §4.1). */
  numeric?: boolean
  /** Bold key column. */
  emphasis?: boolean
}

interface DocTableProps {
  /** Screen-reader caption describing the table's purpose. */
  caption: string
  columns: readonly DocColumn[]
  /** One array of cells per row, positionally matched to `columns`. */
  rows: readonly (readonly ReactNode[])[]
  /** Minimum width so wide tables scroll rather than crush. */
  minWidth?: string
  className?: string
}

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

/**
 * A read-only document table. The quotation preview is a printed artefact, so
 * every table shares one hairline-bordered, mono-headed treatment rather than
 * each chapter inventing its own.
 */
export function DocTable({ caption, columns, rows, minWidth, className }: DocTableProps) {
  return (
    <Table className={cn('border-collapse', minWidth, className)}>
      <caption className="sr-only">{caption}</caption>
      <TableHeader>
        <TableRow className="bg-muted/50">
          {columns.map((col) => (
            <TableHead
              key={col.header}
              scope="col"
              className={cn(
                'font-mono text-[11.5px] uppercase tracking-wide text-muted-foreground border-r last:border-r-0',
                ALIGN[col.align ?? 'left'],
                col.className,
              )}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const col = columns[cellIndex]
              return (
                <TableCell
                  key={cellIndex}
                  className={cn(
                    'align-top border-r last:border-r-0',
                    ALIGN[col?.align ?? 'left'],
                    col?.wrap && 'whitespace-normal',
                    col?.emphasis && 'font-medium',
                  )}
                >
                  {col?.numeric ? <Num>{cell}</Num> : cell}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
