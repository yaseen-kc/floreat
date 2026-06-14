import { PebRoof } from "../sections/roof/PebRoof";
import { BaseFixing } from "../sections/roof/BaseFixing";

export function Step2Roof() {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Structural inputs</h2>
        <p className="text-muted-foreground text-sm mt-1">Core building dimensions and roof frame configuration.</p>
      </div>
      <PebRoof />
      <BaseFixing />
    </section>
  )
}
