import type { CrmWorkspaceTab, QuickActionItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface QuickActionCardProps {
  items: QuickActionItem[]
  onOpenCrm: (tab: CrmWorkspaceTab) => void
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
            onClick={() =>
              onOpenCrm({
                key: item.id,
                title: item.label,
                kind: 'quick-action',
                crmLink: item.crmLink,
                reference: 'Quick Action',
                description:
                  'Form aksi cepat untuk mempercepat penanganan permintaan nasabah.',
              })
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
