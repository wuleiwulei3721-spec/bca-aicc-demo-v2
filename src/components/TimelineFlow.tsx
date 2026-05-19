import type { ReactNode } from 'react'

export interface TimelineFlowItem {
  id: string
  meta?: ReactNode
  status?: 'default' | 'success' | 'warning' | 'danger'
  title: ReactNode
}

interface TimelineFlowProps {
  className?: string
  items: TimelineFlowItem[]
  variant?: 'horizontal' | 'vertical'
}

export function TimelineFlow({
  className,
  items,
  variant = 'horizontal',
}: TimelineFlowProps) {
  const flowClassName = [
    'aicc-timeline-flow',
    `aicc-timeline-flow--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={flowClassName}>
      {items.map((item) => (
        <div
          className={[
            'aicc-timeline-flow__item',
            item.status ? `aicc-timeline-flow__item--${item.status}` : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={item.id}
        >
          <span className="aicc-timeline-flow__node" />
          <div className="aicc-timeline-flow__content">
            <strong>{item.title}</strong>
            {item.meta && <span>{item.meta}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
