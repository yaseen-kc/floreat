import { useState } from 'react'
import { useQuotationStore } from '@/stores/quotation-store'
import { CalcAssumptions } from '@/components/quotation/sections/CalcAssumptions'
import { CalcCard } from '@/components/quotation/sections/CalcCard'
import { Home, Activity, Box, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

function fmt(n: number, d = 0) { return n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }) }

export function Step3CalcEngine() {
  const { getCalc, structuralInputs: si, assumptions: a } = useQuotationStore()
  const calc = getCalc()
  const [formulas, setFormulas] = useState<Record<string, boolean>>({})
  const toggleFormula = (k: string) => setFormulas((p) => ({ ...p, [k]: !p[k] }))
  const toggleAll = () => {
    const anyOpen = Object.values(formulas).some(Boolean)
    setFormulas(anyOpen ? {} : { geo: true, load: true, mat: true })
  }

  // Alerts
  const pitch = si.roofType === 'flat' ? 1.5 : si.pitch
  const alerts: { type: 'danger' | 'warn' | 'ok'; title: string; msg: string }[] = []
  let hasError = false
  if (pitch < 3 || pitch > 30) { hasError = true; alerts.push({ type: 'danger', title: 'Roof pitch out of range', msg: `Pitch ${pitch}° is outside the buildable 3°–30° window.` }) }
  if (si.width > 0 && si.eave / si.width > 0.6) alerts.push({ type: 'warn', title: 'Tall, narrow frame', msg: `Eave-to-span ratio ${(si.eave / si.width).toFixed(2)} is high — bracing and wind drift will drive cost.` })
  if (si.wind >= 47) alerts.push({ type: 'warn', title: 'High wind zone', msg: `Basic wind speed ${si.wind} m/s falls in cyclonic territory.` })
  if (calc.bays < 1) { hasError = true; alerts.push({ type: 'danger', title: 'Invalid bay spacing', msg: 'Bay spacing produces zero frames. Check inputs.' }) }
  if (!alerts.length) alerts.push({ type: 'ok', title: 'All checks passed', msg: 'Geometry and loading are within standard ranges. Outputs are valid for pricing.' })

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight">Calculation & formula engine</h2>
        <p className="text-muted-foreground text-sm mt-1">Inputs on the left, live engineering output on the right. Toggle <b>show formula</b> on any card to see the maths.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1fr)_minmax(380px,1.25fr)] border border-border rounded-[14px] overflow-hidden bg-card">
        <CalcAssumptions hasError={hasError} />

        <div className="p-[22px] bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Live calculation output</span>
            <button type="button" onClick={toggleAll} className="text-[11.5px] font-mono text-muted-foreground hover:text-primary flex items-center gap-1">
              <span className="text-xs">𝑓</span> Show all formulas
            </button>
          </div>

          {/* Alerts */}
          {alerts.map((a, i) => (
            <div key={i} className={cn('flex gap-2.5 p-3 rounded-[10px] text-[13px] mb-3 items-start',
              a.type === 'danger' && 'bg-destructive/10 text-destructive',
              a.type === 'warn' && 'bg-amber-500/10 text-amber-600',
              a.type === 'ok' && 'bg-emerald-500/10 text-emerald-600',
            )}>
              {a.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div><b className="font-semibold">{a.title}</b><div className="mt-0.5">{a.msg}</div></div>
            </div>
          ))}

          {/* Geometry */}
          <CalcCard
            title="Geometry" icon={<Home className="w-3.5 h-3.5" />}
            showFormula={!!formulas.geo} onToggleFormula={() => toggleFormula('geo')}
            hasError={calc.bays < 1}
            formulaLines={[
              `bays = round(L / s) = round(<span class="text-primary">${si.length}</span> / <span class="text-primary">${si.bay}</span>)`,
              `A_plan = L × W = <span class="text-primary">${si.length}</span> × <span class="text-primary">${si.width}</span>`,
              `A_roof = A_plan / cos(θ) = A_plan / cos(<span class="text-primary">${pitch}</span>°)`,
            ]}
            formulaNote="θ is the roof pitch; mono-pitch and flat roofs use the same projection."
            outputs={[
              { label: 'No. of bays', deps: 'length, bay spacing', value: fmt(calc.bays), unit: '' },
              { label: 'Plan area', deps: 'length, width', value: fmt(calc.planArea, 1), unit: 'm²' },
              { label: 'Roof area', deps: 'plan area, pitch', value: fmt(calc.roofArea, 1), unit: 'm²' },
            ]}
          />

          {/* Wind loading */}
          <CalcCard
            title="Wind loading" icon={<Activity className="w-3.5 h-3.5" />}
            showFormula={!!formulas.load} onToggleFormula={() => toggleFormula('load')}
            formulaLines={[
              `Vz = Vb × k₁ = <span class="text-primary">${si.wind}</span> × <span class="text-primary">${a.k1.toFixed(2)}</span>`,
              `q = 0.613 × Vz² (N/m²)`,
              `q = 0.613 × <span class="text-primary">${fmt(calc.vz, 0)}</span>²`,
            ]}
            formulaNote="Design wind pressure per IS 875 (Part 3)."
            outputs={[
              { label: 'Design wind speed Vz', deps: 'wind speed, k₁', value: fmt(calc.vz, 1), unit: 'm/s' },
              { label: 'Design wind pressure', deps: 'Vz', value: fmt(calc.q, 2), unit: 'kN/m²' },
            ]}
          />

          {/* Material take-off */}
          <CalcCard
            title="Material take-off" icon={<Box className="w-3.5 h-3.5" />}
            showFormula={!!formulas.mat} onToggleFormula={() => toggleFormula('mat')}
            hasError={hasError}
            formulaLines={[
              `M_steel = A_plan × ρ × (1 + waste)`,
              `= A_plan × <span class="text-primary">${a.intensity}</span> × (1 + <span class="text-primary">${(a.waste / 100).toFixed(2)}</span>)`,
              `A_clad = (A_roof + A_walls) × overlap`,
              `A_walls = 2 × (L + W) × H  ${si.sidewall ? '(sidewalls on)' : '(sidewalls off = 0)'}`,
            ]}
            formulaNote="ρ is steel intensity per m² of plan; wall area drops to zero when sidewalls are disabled."
            outputs={[
              { label: 'Structural steel mass', deps: 'plan area, intensity, wastage', value: fmt(calc.steelMass), unit: 'kg' },
              { label: 'Wall area', deps: 'L, W, eave, sidewalls', value: fmt(calc.wallArea, 1), unit: 'm²' },
              { label: 'Cladding area', deps: 'roof, walls, overlap', value: fmt(calc.cladArea, 1), unit: 'm²' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
