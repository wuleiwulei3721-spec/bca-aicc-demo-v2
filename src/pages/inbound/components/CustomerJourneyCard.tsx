import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownOutlined,
  InstagramFilled,
  MailOutlined,
  TikTokFilled,
  WhatsAppOutlined,
  XOutlined,
} from '@ant-design/icons'
import { Modal, Space, Tag, Tooltip } from 'antd'
import type { CustomerJourneyItem, JourneyChannel } from '../../../types'
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
  const [day, month] = date.split(' ')
  return new Date(2026, monthIndex[month] ?? 0, Number(day)).getTime()
}

function renderChannelIcon(channel: JourneyChannel) {
  const iconMap: Record<JourneyChannel, ReactNode> = {
    Email: <MailOutlined />,
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

function renderResultIcon(result: CustomerJourneyItem['result']) {
  const isSuccess = result === 'Success'

  return (
    <Tooltip title={result}>
      <span
        className={
          isSuccess
            ? 'inbound-journey-result inbound-journey-result--success'
            : 'inbound-journey-result inbound-journey-result--failed'
        }
      >
        {isSuccess ? <CheckCircleFilled /> : <CloseCircleFilled />}
      </span>
    </Tooltip>
  )
}

export function CustomerJourneyCard({ items }: CustomerJourneyCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState<CustomerJourneyItem | null>(null)

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
          {visibleItems.map((item) => (
            <button
              className="inbound-compact-row inbound-compact-row--button inbound-journey-row"
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
            >
              {renderChannelIcon(item.channel)}
              <span className="inbound-compact-row__main">{item.summary}</span>
              {renderResultIcon(item.result)}
              <span className="inbound-compact-row__date">{item.date}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <Modal
        className="inbound-detail-modal"
        footer={null}
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
                <Tag
                  className={
                    activeItem.result === 'Success'
                      ? 'inbound-status-tag inbound-status-tag--success'
                      : 'inbound-status-tag inbound-status-tag--danger'
                  }
                >
                  {activeItem.result}
                </Tag>
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
      </Modal>
    </>
  )
}
