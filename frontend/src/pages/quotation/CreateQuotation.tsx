import { useRef, useEffect } from 'react'
import { useQuotationStore } from '@/stores/quotation-store'
import { WizardStepper } from '@/components/quotation/WizardStepper'
import { WizardActionBar } from '@/components/quotation/WizardActionBar'
import { Step1ProjectInfo } from '@/components/quotation/steps/Step1ProjectInfo'
import { Step2Roof } from '@/components/quotation/steps/Step2Roof'
import { Step3Mezzanine } from '@/components/quotation/steps/Step3Mezzanine'
import { Step4Stair } from '@/components/quotation/steps/Step4Stair'
import { Step5Canopy } from '@/components/quotation/steps/Step5Canopy'

import { Step6Accessories } from '@/components/quotation/steps/Step6Accessories'
import { Step7Load } from '@/components/quotation/steps/Step7Load'


export default function CreateQuotation() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-h))]">
      <WizardStepper />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-7 pb-[120px]">
        <div className="animate-in fade-in duration-250" key={currentStep}>
          {currentStep === 1 && <Step1ProjectInfo />}
          {currentStep === 2 && <Step2Roof />}
          {currentStep === 3 && <Step3Mezzanine />}
          {currentStep === 4 && <Step4Stair />}
          {currentStep === 5 && <Step5Canopy />}
          {currentStep === 6 && <Step6Accessories />}
          {currentStep === 7 && <Step7Load />}
        </div>
      </div>
      <WizardActionBar />
    </div>
  )
}
