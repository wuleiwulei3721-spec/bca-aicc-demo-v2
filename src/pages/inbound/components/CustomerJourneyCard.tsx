import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DownOutlined,
  FacebookFilled,
  GlobalOutlined,
  InstagramFilled,
  MailOutlined,
  MobileOutlined,
  TikTokFilled,
  WhatsAppOutlined,
  XOutlined,
} from '@ant-design/icons'
import { Space, Tag, Tooltip } from 'antd'
import { BaseModal, PhoneIcon, StatusBadge } from '../../../components'
import { useCallManagementStore } from '../../../store'
import type { CustomerJourneyItem, JourneyChannel } from '../../../types'
import { CallRecordDetailModal } from '../../call-management/CallRecordDetailModal'
import { ChannelTag } from './ChannelTag'
import { SectionCard } from './SectionCard'

interface CustomerJourneyCardProps {
  items: CustomerJourneyItem[]
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

function parseJourneyDate(date: string) {
  if (date === 'Today') {
    return Date.now()
  }

  const [day, month] = date.split(' ')
  return new Date(2026, monthIndex[month] ?? 0, Number(day)).getTime()
}

function renderChannelIcon(channel: JourneyChannel) {
  const iconMap: Record<JourneyChannel, ReactNode> = {
    Phone: <PhoneIcon />,
    BankApp: <MobileOutlined />,
    Webchat: <GlobalOutlined />,
    Email: <MailOutlined />,
    Facebook: <FacebookFilled />,
    X: <XOutlined />,
    Instagram: <InstagramFilled />,
    TikTok: <TikTokFilled />,
    WhatsApp: <WhatsAppOutlined />,
  }

  return (
    <Tooltip title={channel}>
      <span
        className={`inbound-journey-channel inbound-journey-channel--${channel
          .toLowerCase()
          .replace(/\s+/g, '-')}`}
      >
        {iconMap[channel]}
      </span>
    </Tooltip>
  )
}

export function CustomerJourneyCard({ items }: CustomerJourneyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState<CustomerJourneyItem | null>(null)
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const callRecords = useCallManagementStore((state) => state.callRecords)
  const callRecordsById = useMemo(
    () => new Map(callRecords.map((record) => [record.id, record])),
    [callRecords],
  )
  const activeRecord = activeRecordId
    ? callRecordsById.get(activeRecordId) ?? null
    : null

  const visibleItems = useMemo(() => {
    const sortedItems = [...items].sort(
      (current, next) =>
        parseJourneyDate(next.date) - parseJourneyDate(current.date),
    )

    return sortedItems.slice(0, expanded ? 10 : 2)
  }, [expanded, items])

  return (
    <>
      <SectionCard
        expandable
        expanded={expanded}
        extra={<DownOutlined />}
        title="Customer Journey"
        onHeaderClick={() => setExpanded((current) => !current)}
      >
        <div className="inbound-journey-list">
          {visibleItems.length > 0 ? (
            visibleItems.map((item) => {
              const callRecord = item.callRecordId
                ? callRecordsById.get(item.callRecordId)
                : null
              const summary = item.callRecordId
                ? callRecord?.summary.tickets
                    .map((ticket) => ticket.caseCategory)
                    .filter(Boolean)
                    .join(', ') || '-'
                : item.summary

              return (
                <button
                  className="inbound-compact-row inbound-compact-row--button inbound-journey-row"
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.callRecordId && callRecord) {
                      setActiveRecordId(item.callRecordId)
                      return
                    }

                    setActiveItem(item)
                  }}
                >
                  {renderChannelIcon(item.channel)}
                  <span className="inbound-compact-row__main">{summary}</span>
                  <span className="inbound-compact-row__date">{item.date}</span>
                </button>
              )
            })
          ) : (
            <div className="inbound-empty-state">
              Customer journey is not loaded.
            </div>
          )}
        </div>
      </SectionCard>

      <BaseModal
        className="inbound-detail-modal"
        kind="detail"
        open={Boolean(activeItem)}
        title="Interaction Detail"
        width={860}
        onCancel={() => setActiveItem(null)}
      >
        {activeItem && (
          <div className="inbound-interaction-detail">
            <section className="inbound-conversation-panel">
              <div className="inbound-detail-section-title">
                Customer & Agent Conversation
              </div>
              <div className="inbound-conversation-list">
                {activeItem.conversation.map((message) => (
                  <div
                    className={[
                      'inbound-conversation-message',
                      message.sender === 'Agent'
                        ? 'inbound-conversation-message--agent'
                        : 'inbound-conversation-message--customer',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={message.id}
                  >
                    <div className="inbound-conversation-message__meta">
                      <strong>{message.sender}</strong>
                      <span>{message.time}</span>
                    </div>
                    <p>{message.message}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="inbound-summary-panel">
              <div className="inbound-detail-section-title">Summary</div>
              <Space size={6} wrap>
                <ChannelTag compact value={activeItem.channel} />
                <StatusBadge
                  label={activeItem.result}
                  size="small"
                  status={activeItem.result === 'Success' ? 'success' : 'failed'}
                />
                <Tag className="inbound-neutral-tag">{activeItem.date}</Tag>
              </Space>
              <div className="inbound-summary-list">
                <section>
                  <span>Interaction Summary</span>
                  <p>{activeItem.communicationDetail}</p>
                </section>
                <section>
                  <span>Resolution Result</span>
                  <p>{activeItem.resolutionResult}</p>
                </section>
                <section>
                  <span>Follow-up Notes</span>
                  <p>{activeItem.followUpNotes}</p>
                </section>
              </div>
            </aside>
          </div>
        )}
      </BaseModal>
      <CallRecordDetailModal
        record={activeRecord}
        onClose={() => setActiveRecordId(null)}
      />
    </>
  )
}
