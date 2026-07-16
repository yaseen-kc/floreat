import { useRef, useEffect } from 'react'
import { useQuotationStore } from '@/stores/quotation-store'
import { cn } from '@/lib/utils'
import { WizardStepper } from '@/components/quotation/WizardStepper'
import { WizardActionBar } from '@/components/quotation/WizardActionBar'
import { Step1ProjectInfo } from '@/components/quotation/steps/Step1ProjectInfo'
import { Step2Roof } from '@/components/quotation/steps/Step2Roof'
import { Step3Mezzanine } from '@/components/quotation/steps/Step3Mezzanine'
import { Step4Stair } from '@/components/quotation/steps/Step4Stair'
import { Step5Canopy } from '@/components/quotation/steps/Step5Canopy'

import { Step6Accessories } from '@/components/quotation/steps/Step6Accessories'
import { Step7Load } from '@/components/quotation/steps/Step7Load'
import { Step8Joint } from '@/components/quotation/steps/Step8Joint'
import { Step9Spec } from '@/components/quotation/steps/Step9Spec'
import { Step10Rate } from '@/components/quotation/steps/Step10Rate'


export default function CreateQuotation() {
  const currentStep = useQuotationStore((s) => s.currentStep)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isRateStep = currentStep === 10

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-h))]">
      <WizardStepper />
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto py-7 pb-[120px] max-[640px]:px-4 max-[640px]:py-5 max-[640px]:pb-[140px]',
          isRateStep ? 'px-4' : 'px-8'
        )}
      >
        <div
          className={cn(
            'animate-in fade-in duration-250',
            isRateStep ? 'desktop:max-w-none desktop:mx-0' : 'desktop:max-w-[1040px] desktop:mx-auto'
          )}
          key={currentStep}
        >
          {currentStep === 1 && <Step1ProjectInfo />}
          {currentStep === 2 && <Step2Roof />}
          {currentStep === 3 && <Step3Mezzanine />}
          {currentStep === 4 && <Step4Stair />}
          {currentStep === 5 && <Step5Canopy />}
          {currentStep === 6 && <Step6Accessories />}
          {currentStep === 7 && <Step7Load />}
          {currentStep === 8 && <Step8Joint />}
          {currentStep === 9 && <Step9Spec />}
          {currentStep === 10 && <Step10Rate />}
        </div>
      </div>
      <WizardActionBar />
    </div>
  )
}
