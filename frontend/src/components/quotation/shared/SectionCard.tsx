import type { ReactNode } from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SectionCardProps {
  icon: ReactNode
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ icon, title, action, children, className }: SectionCardProps) {
  return (
    <Card className={'mb-[18px] rounded-[14px] py-0 desktop:mb-6 ' + (className ?? '')}>
      <CardHeader className="px-[22px] pt-[22px] max-[640px]:px-4 max-[640px]:pt-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
        <span className="w-6 h-6 rounded-[7px] bg-primary/10 text-primary grid place-items-center [&_svg]:w-3.5 [&_svg]:h-3.5">
          {icon}
        </span>
        {title}
        {action && <CardAction>{action}</CardAction>}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-[22px] pb-[22px] max-[640px]:px-4 max-[640px]:pb-4">{children}</CardContent>
    </Card>
  )
}
