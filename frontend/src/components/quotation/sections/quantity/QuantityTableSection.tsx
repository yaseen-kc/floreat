import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useUpsertQuantityPebRoof } from '@/api/quotation/quantity-peb-roof/postQuantityPebRoof'
import { useUpsertQuantityCladding } from '@/api/quotation/quantity-cladding/postQuantityCladding'
import { useUpsertQuantityCanopy } from '@/api/quotation/quantity-canopy/postQuantityCanopy'
import { useUpsertQuantityAccessories } from '@/api/quotation/quantity-accessories/postQuantityAccessories'
import { useUpsertQuantityMezzanine } from '@/api/quotation/quantity-mezzanine/postQuantityMezzanine'
import { useUpsertQuantityStair } from '@/api/quotation/quantity-stair/postQuantityStair'
import { useUpsertQuantityAdditionalBolts } from '@/api/quotation/quantity-additional-bolts/postQuantityAdditionalBolts'
import { quantityKeys } from '@/api/quotation/quantity/queryKeys'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'
import { useQuotationStore } from '@/stores/quotation-store'
import type { Quantity } from '@/api/quotation/quantity/getQuantity'
import {
  buildPebRoofPayload,
  buildCladdingPayload,
  buildCanopyPayload,
  buildAccessoriesPayload,
  buildMezzaninePayload,
  buildStairPayload,
  buildAdditionalBoltsPayload,
} from '@/lib/quantity-payload'

export type QuantitySectionKey = keyof Pick<Quantity, 'pebRoof' | 'cladding' | 'canopy' | 'accessories' | 'mezzanine' | 'stair' | 'additionalBolts'>

export interface QuantityTableSectionProps {
  sectionKey: QuantitySectionKey
  title: string
  icon: React.ReactNode
  rows: RowDef[]
  calculatedData?: Record<string, any>
  onDraftChange?: (sectionKey: QuantitySectionKey, draft: Record<string, string>) => void
}

export function QuantityTableSection({ sectionKey, title, icon, rows, calculatedData, onDraftChange }: QuantityTableSectionProps) {
  const jobId = useQuotationStore((s) => s.jobId)
  const initialData = useQuotationStore((s) => s.quantity?.[sectionKey] ?? null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const queryClient = useQueryClient()
  const seededDataRef = useRef<unknown>(null)

  const pebRoofMut = useUpsertQuantityPebRoof()
  const claddingMut = useUpsertQuantityCladding()
  const canopyMut = useUpsertQuantityCanopy()
  const accessoriesMut = useUpsertQuantityAccessories()
  const mezzanineMut = useUpsertQuantityMezzanine()
  const stairMut = useUpsertQuantityStair()
  const additionalBoltsMut = useUpsertQuantityAdditionalBolts()

  useEffect(() => {
    if (initialData === undefined) return
    if (seededDataRef.current === initialData && Object.keys(draft).length > 0) return

    seededDataRef.current = initialData
    const seededDraft = seedDrafts(initialData as unknown as Record<string, unknown> | null, rows)

    setDraft((prev) => {
      const merged: Record<string, string> = { ...prev }
      for (const [k, v] of Object.entries(seededDraft)) {
        if (v !== '' || !merged[k]) {
          merged[k] = v
        }
      }
      onDraftChange?.(sectionKey, merged)
      return merged
    })
  }, [initialData, rows, sectionKey, onDraftChange])

  const onEdit = (field: string, value: string) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value }
      const parseVal = (v: string) => (v === '' ? null : isNaN(Number(v)) ? v : Number(v))
      const parsedDraft = Object.fromEntries(Object.entries(next).map(([k, v]) => [k, parseVal(v)]))
      useQuotationStore.setState((s) => ({
        quantity: s.quantity
          ? {
              ...s.quantity,
              [sectionKey]: {
                ...s.quantity[sectionKey],
                ...parsedDraft,
              },
            }
          : ({
              [sectionKey]: parsedDraft,
            } as unknown as Quantity),
      }))
      onDraftChange?.(sectionKey, next)
      return next
    })
  }

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)

    try {
      let result: unknown
      switch (sectionKey) {
        case 'pebRoof': {
          const payload = buildPebRoofPayload(calculatedData, initialData, draft)
          result = await pebRoofMut.mutateAsync({ jobId, payload })
          break
        }
        case 'cladding': {
          const payload = buildCladdingPayload(calculatedData, initialData, draft)
          result = await claddingMut.mutateAsync({ jobId, payload })
          break
        }
        case 'canopy': {
          const payload = buildCanopyPayload(calculatedData, initialData, draft)
          result = await canopyMut.mutateAsync({ jobId, payload })
          break
        }
        case 'accessories': {
          const payload = buildAccessoriesPayload(calculatedData, initialData, draft)
          result = await accessoriesMut.mutateAsync({ jobId, payload })
          break
        }
        case 'mezzanine': {
          const payload = buildMezzaninePayload(calculatedData, initialData, draft)
          result = await mezzanineMut.mutateAsync({ jobId, payload })
          break
        }
        case 'stair': {
          const payload = buildStairPayload(calculatedData, initialData, draft)
          result = await stairMut.mutateAsync({ jobId, payload })
          break
        }
        case 'additionalBolts': {
          const payload = buildAdditionalBoltsPayload(calculatedData, initialData, draft)
          result = await additionalBoltsMut.mutateAsync({ jobId, payload })
          break
        }
      }
      queryClient.invalidateQueries({ queryKey: quantityKeys.detail(jobId) })
      useQuotationStore.setState((s) => ({
        quantity: s.quantity
          ? { ...s.quantity, [sectionKey]: result }
          : ({ [sectionKey]: result } as unknown as Quantity),
      }))
      toast.success(`${title} saved`)
    } catch {
      toast.error(`Failed to save ${title}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <SectionTable
      icon={icon}
      title={title}
      rows={rows}
      sectionData={initialData as unknown as Record<string, string | number | boolean | null | undefined> | null}
      calculatedData={calculatedData}
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
    />
  )
}
