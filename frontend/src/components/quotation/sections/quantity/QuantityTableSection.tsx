import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUpsertQuantity } from '@/api/quotation/quantity/postQuantity'
import type { CreateQuantityPayload } from '@/api/quotation/quantity/postQuantity'
import { SectionTable, seedDrafts } from '@/components/quotation/shared/SectionTable'
import type { RowDef } from '@/components/quotation/shared/SectionTable'
import { useQuotationStore } from '@/stores/quotation-store'
import type { Quantity } from '@/api/quotation/quantity/getQuantity'

type QuantitySectionKey = keyof Pick<Quantity, 'pebRoof' | 'cladding' | 'canopy' | 'accessories' | 'mezzanine' | 'stair' | 'additionalBolts'>

interface Props {
  sectionKey: QuantitySectionKey
  title: string
  icon: React.ReactNode
  rows: RowDef[]
}

export function QuantityTableSection({ sectionKey, title, icon, rows }: Props) {
  const jobId = useQuotationStore((s) => s.jobId)
  const initialData = useQuotationStore((s) => s.quantity?.[sectionKey] ?? null)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const upsertQuantity = useUpsertQuantity()
  const seeded = useRef(false)

  useEffect(() => {
    if (seeded.current || initialData === undefined) return
    seeded.current = true
    setDraft(seedDrafts(initialData as unknown as Record<string, unknown> | null, rows))
  }, [initialData, rows])

  const onEdit = (field: string, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const onSave = async () => {
    if (!jobId) return
    setSaving(true)
    const parseVal = (v: string) => (v === '' ? null : Number(v))
    const payload = Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, parseVal(v)]))
    try {
      await upsertQuantity.mutateAsync({ jobId, payload: { [sectionKey]: payload } as CreateQuantityPayload })
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
      draft={draft}
      onEdit={onEdit}
      onSave={onSave}
      saving={saving}
    />
  )
}
