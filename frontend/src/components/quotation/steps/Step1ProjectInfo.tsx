import { ClientSection } from '@/components/quotation/sections/ClientSection'

export function Step1ProjectInfo() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Project information</h2>
        <p className="text-muted-foreground text-sm mt-1">Who and where. Start typing a client to autocomplete from your records.</p>
      </div>
      <ClientSection />
    </section>
  )
}
