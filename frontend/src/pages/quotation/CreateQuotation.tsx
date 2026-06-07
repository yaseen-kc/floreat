import { useRef, useEffect } from 'react'
import { useQuotationStore } from '@/stores/quotation-store'
import { WizardStepper } from '@/components/quotation/WizardStepper'
import { WizardActionBar } from '@/components/quotation/WizardActionBar'
import { Toast } from '@/components/quotation/shared/Toast'
import { Step1ProjectInfo } from '@/components/quotation/steps/Step1ProjectInfo'
import { Step2StructuralInputs } from '@/components/quotation/steps/Step2StructuralInputs'
import { Step3CalcEngine } from '@/components/quotation/steps/Step3CalcEngine'
import { Step4Pricing } from '@/components/quotation/steps/Step4Pricing'
import { Step5Review } from '@/components/quotation/steps/Step5Review'

export default function CreateQuotation() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="flex flex-col h-full">
      <WizardStepper />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-7 pb-[120px]">
        <div className="animate-in fade-in duration-250" key={currentStep}>
          {currentStep === 1 && <Step1ProjectInfo />}
          {currentStep === 2 && <Step2StructuralInputs />}
          {currentStep === 3 && <Step3CalcEngine />}
          {currentStep === 4 && <Step4Pricing />}
          {currentStep === 5 && <Step5Review />}
        </div>
      </div>
      <WizardActionBar />
      <Toast />
    </div>
  )
}
