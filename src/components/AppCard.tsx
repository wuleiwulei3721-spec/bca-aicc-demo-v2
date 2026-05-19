import { Card } from 'antd'
import type { CardProps } from 'antd'

export interface AppCardProps extends CardProps {
  compact?: boolean
}

export function AppCard({ className, compact, ...props }: AppCardProps) {
  const cardClassName = ['aicc-card', compact ? 'aicc-card--compact' : '', className]
    .filter(Boolean)
    .join(' ')

  return <Card className={cardClassName} {...props} />
}
