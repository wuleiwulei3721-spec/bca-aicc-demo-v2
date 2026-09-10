import { useMemo, useState } from 'react'
import { ArrowRightOutlined, DownOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import type { CrmWorkspaceTab, TicketHistoryItem } from '../../../types'
import { SectionCard } from './SectionCard'

interface TicketingHistoryCardProps {
  items: TicketHistoryItem[]
  onOpenCrm: (tab: CrmWorkspaceTab) => void
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

function parseTicketDate(date: string) {
  const [day, month] = date.split(' ')
  return new Date(2026, monthIndex[month] ?? 0, Number(day)).getTime()
}

export function TicketingHistoryCard({
  items,
  onOpenCrm,
}: TicketingHistoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = useMemo(() => {
    const sortedItems = [...items].sort(
      (current, next) =>
        parseTicketDate(next.createdDate) - parseTicketDate(current.createdDate),
    )

    return sortedItems.slice(0, expanded ? 10 : 2)
  }, [expanded, items])

  return (
    <SectionCard
      className={
        visibleItems.length === 0 ? 'inbound-section-card--empty' : undefined
      }
      expandable
      expanded={expanded}
      extra={<DownOutlined />}
      title="Ticketing History"
      onHeaderClick={() => setExpanded((current) => !current)}
    >
      <div className="inbound-ticket-list">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <button
              className="inbound-compact-row inbound-ticket-row inbound-ticket-row--clickable"
              key={item.id}
              type="button"
              onClick={() =>
                onOpenCrm({
                  key: `ticket-${item.ticketNumber}`,
                  title: item.caseCategory,
                  kind: 'ticket',
                  crmLink: `/crm/tickets/${item.ticketNumber}`,
                  reference: item.ticketNumber,
                  description:
                    'Detail tiket layanan nasabah yang dibuka dari riwayat ticketing.',
                })
              }
            >
              <span className="inbound-ticket-type">{item.caseCategory}</span>
              <span className="inbound-ticket-row__meta">
                <Tag className="inbound-neutral-tag inbound-ticket-row__number">
                  {item.ticketNumber}
                </Tag>
                <span className="inbound-compact-row__date">
                  {item.createdDate}
                </span>
              </span>
              <ArrowRightOutlined className="inbound-ticket-row__hint" />
            </button>
          ))
        ) : (
          <div className="inbound-empty-state">No data available.</div>
        )}
      </div>
    </SectionCard>
  )
}
