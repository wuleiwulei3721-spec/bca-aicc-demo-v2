import type { ReactNode } from 'react'
import { AppCard } from '../../../components'

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

  const titleNode = (
    <button
      className={[
        'inbound-section-card__header-button',
        expandable ? 'inbound-section-card__header-button--expandable' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      type="button"
      onClick={onHeaderClick}
    >
      <span className="inbound-section-card__title">{title}</span>
      {expandable && (
        <span
          className={[
            'inbound-section-card__arrow',
            expanded ? 'inbound-section-card__arrow--expanded' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {extra}
        </span>
      )}
    </button>
  )

  return (
    <AppCard
      className={cardClassName}
      compact
      title={titleNode}
    >
      {children}
    </AppCard>
  )
}
