import { useMemo } from 'react'
import { useCallManagementStore } from '../../../store'
import type { CrmWorkspaceTab, QuickActionItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface QuickActionCardProps {
  items?: QuickActionItem[]
  onOpenCrm: (tab: CrmWorkspaceTab) => void
}

export function QuickActionCard({ items, onOpenCrm }: QuickActionCardProps) {
  const entries = useCallManagementStore((state) => state.quickActionEntries)
  const configuredItems = useMemo(
    () =>
      entries
        .filter((entry) => entry.status === 'Active')
        .sort((first, second) => first.sortOrder - second.sortOrder),
    [entries],
  )
  const displayItems = items ?? configuredItems

  return (
    <SectionCard title="Quick Action">
      <div className="inbound-quick-grid">
        {displayItems.map((item) => (
          <button
            className="inbound-quick-action"
            key={item.id}
            type="button"
            onClick={() =>
              onOpenCrm({
                key: item.id,
                title: 'actionName' in item ? item.actionName : item.label,
                kind: 'quick-action',
                crmLink: 'linkAddress' in item ? item.linkAddress : item.crmLink,
                reference: 'Quick Action',
                description:
                  'Form aksi cepat untuk mempercepat penanganan permintaan nasabah.',
              })
            }
          >
            {item.actionName}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
