import { BaseCard } from './BaseCard'
import type { BaseCardProps } from './BaseCard'

export type AppCardProps = BaseCardProps

export function AppCard({ className, compact, ...props }: AppCardProps) {
  const cardClassName = ['aicc-card', compact ? 'aicc-card--compact' : '', className]
    .filter(Boolean)
    .join(' ')

  return <BaseCard className={cardClassName} compact={compact} {...props} />
}
