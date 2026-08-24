import { useMemo } from 'react'
import { useCallManagementStore } from '../../../store'
import type { CrmWorkspaceTab } from '../../../types'
import { SectionCard } from './SectionCard'

interface QuickActionCardProps {
  onOpenCrm: (tab: CrmWorkspaceTab) => void
}

export function QuickActionCard({ onOpenCrm }: QuickActionCardProps) {
  const entries = useCallManagementStore((state) => state.quickActionEntries)
  const items = useMemo(
    () =>
      entries
        .filter((entry) => entry.status === 'Active')
        .sort((first, second) => first.sortOrder - second.sortOrder),
    [entries],
  )

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
                title: item.actionName,
                kind: 'quick-action',
                crmLink: item.linkAddress,
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
