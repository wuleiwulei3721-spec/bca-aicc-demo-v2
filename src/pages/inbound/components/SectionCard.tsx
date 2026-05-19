import type { ReactNode } from 'react'
import { BaseCard } from '../../../components'

interface SectionCardProps {
  title: string
  className?: string
  extra?: ReactNode
  children: ReactNode
  expandable?: boolean
  expanded?: boolean
  onHeaderClick?: () => void
}

export function SectionCard({
  title,
  className,
  extra,
  children,
  expandable,
  expanded,
  onHeaderClick,
}: SectionCardProps) {
  const cardClassName = ['inbound-section-card', className]
    .filter(Boolean)
    .join(' ')

  return (
    <BaseCard
      className={cardClassName}
      compact
      expandable={expandable}
      expanded={expanded}
      headerExtra={extra}
      title={title}
      onHeaderClick={onHeaderClick}
    >
      {children}
    </BaseCard>
  )
}
