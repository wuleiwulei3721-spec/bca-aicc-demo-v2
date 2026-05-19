import { DownOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import type { CardProps } from 'antd'
import type { ReactNode } from 'react'

export type BaseCardTone = 'default' | 'highlight'

export interface BaseCardProps extends Omit<CardProps, 'title'> {
  title?: ReactNode
  compact?: boolean
  expandable?: boolean
  expanded?: boolean
  headerExtra?: ReactNode
  tone?: BaseCardTone
  onHeaderClick?: () => void
}

export function BaseCard({
  children,
  className,
  compact,
  expandable,
  expanded,
  headerExtra,
  title,
  tone = 'default',
  onHeaderClick,
  ...props
}: BaseCardProps) {
  const cardClassName = [
    'aicc-card',
    'aicc-base-card',
    compact ? 'aicc-card--compact' : '',
    tone === 'highlight' ? 'aicc-base-card--highlight' : '',
    expandable ? 'aicc-base-card--expandable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const headerContent = (
    <>
      <span className="aicc-base-card__title">{title}</span>
      {(headerExtra || expandable) && (
        <span
          className={[
            'aicc-base-card__header-extra',
            expandable && expanded ? 'aicc-base-card__header-extra--expanded' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {headerExtra ?? <DownOutlined />}
        </span>
      )}
    </>
  )

  const titleNode =
    title || headerExtra || expandable ? (
      expandable || onHeaderClick ? (
      <button
        className={[
          'aicc-base-card__header-button',
          expandable ? 'aicc-base-card__header-button--expandable' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        type="button"
        onClick={expandable || onHeaderClick ? onHeaderClick : undefined}
      >
        {headerContent}
      </button>
      ) : (
        <div className="aicc-base-card__header-button">{headerContent}</div>
      )
    ) : undefined

  return (
    <Card className={cardClassName} title={titleNode} {...props}>
      {children}
    </Card>
  )
}
