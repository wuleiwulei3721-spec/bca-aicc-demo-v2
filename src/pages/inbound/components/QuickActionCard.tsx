import type { QuickActionItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface QuickActionCardProps {
  items: QuickActionItem[]
  onOpenCrm: (link: string) => void
}

export function QuickActionCard({ items, onOpenCrm }: QuickActionCardProps) {
  return (
    <SectionCard title="Quick Action">
      <div className="inbound-quick-grid">
        {items.map((item) => (
          <button
            className="inbound-quick-action"
            key={item.id}
            type="button"
            onClick={() => onOpenCrm(item.crmLink)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
