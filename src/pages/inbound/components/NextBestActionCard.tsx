import { useMemo, useState } from 'react'
import { ArrowRightOutlined, DownOutlined } from '@ant-design/icons'
import type { NextBestActionItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface NextBestActionCardProps {
  items: NextBestActionItem[]
  onOpenCrm: (link: string) => void
}

const monthIndex: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

function parseActionDate(date: string) {
  const [day, month] = date.split(' ')
  return new Date(2026, monthIndex[month] ?? 0, Number(day)).getTime()
}

export function NextBestActionCard({
  items,
  onOpenCrm,
}: NextBestActionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = useMemo(() => {
    const sortedItems = [...items].sort(
      (current, next) =>
        parseActionDate(next.createdDate) -
        parseActionDate(current.createdDate),
    )

    return sortedItems.slice(0, expanded ? items.length : 2)
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
            onClick={() => onOpenCrm(item.crmLink)}
          >
            <span className="inbound-action-service">
              {item.recommendedService}
            </span>
            <span className="inbound-compact-row__date">{item.createdDate}</span>
            <ArrowRightOutlined className="inbound-ticket-row__hint" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
