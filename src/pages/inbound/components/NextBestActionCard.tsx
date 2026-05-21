import { useMemo, useState } from 'react'
import { ArrowRightOutlined, DownOutlined } from '@ant-design/icons'
import type { CrmWorkspaceTab, NextBestActionItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface NextBestActionCardProps {
  items: NextBestActionItem[]
  onOpenCrm: (tab: CrmWorkspaceTab) => void
}

export function NextBestActionCard({
  items,
  onOpenCrm,
}: NextBestActionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = useMemo(() => {
    return items.slice(0, expanded ? items.length : 2)
  }, [expanded, items])

  return (
    <SectionCard
      expandable
      expanded={expanded}
      extra={<DownOutlined />}
      title="Next Best Action"
      onHeaderClick={() => setExpanded((current) => !current)}
    >
      <div className="inbound-action-list">
        {visibleItems.map((item) => (
          <button
            className="inbound-action-row"
            key={item.id}
            type="button"
            onClick={() =>
              onOpenCrm({
                key: item.id,
                title: item.recommendedService,
                kind: 'next-best-action',
                crmLink: item.crmLink,
                reference: 'NBA',
                description:
                  'Rekomendasi layanan berikutnya berdasarkan profil dan aktivitas nasabah.',
              })
            }
          >
            <span className="inbound-action-service">
              {item.recommendedService}
            </span>
            <ArrowRightOutlined className="inbound-ticket-row__hint" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
