import { useMezzanineHydration } from '@/hooks/useMezzanineHydration'
import { MezzanineFloors } from '@/components/quotation/sections/mezzanine/MezzanineFloors'
import { MezzanineExtensions } from '@/components/quotation/sections/mezzanine/MezzanineExtensions'

export function Step3Mezzanine() {
  useMezzanineHydration()

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Mezzanine</h2>
        <p className="text-muted-foreground text-sm mt-1">Intermediate floors and their extensions.</p>
      </div>
      <MezzanineFloors />
      <MezzanineExtensions />
    </section>
  )
}
