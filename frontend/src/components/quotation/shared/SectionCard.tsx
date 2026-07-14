import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  icon: ReactNode
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ icon, title, action, children, className }: SectionCardProps) {
  return (
    <div className={cn('border border-border rounded-[14px] bg-card p-[22px] mb-[18px] desktop:mb-6 max-[640px]:p-4', className)}>
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-[7px] bg-primary/10 text-primary grid place-items-center [&_svg]:w-3.5 [&_svg]:h-3.5">
          {icon}
        </span>
        {title}
        {action && <span className="ml-auto">{action}</span>}
      </h3>
      {children}
    </div>
  )
}
