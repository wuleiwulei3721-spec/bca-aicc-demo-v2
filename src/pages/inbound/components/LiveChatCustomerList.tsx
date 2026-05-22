import {
  GlobalOutlined,
  LeftOutlined,
  MobileOutlined,
  RightOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Badge } from 'antd'
import type { ReactNode } from 'react'
import type { LiveChatSession } from '../../../types'

type LiveChatChannelFilter = 'all' | LiveChatSession['channel']
type LiveChatChannel = LiveChatSession['channel']

interface LiveChatCustomerListProps {
  activeSessionId: string
  collapsed: boolean
  selectedChannels: LiveChatChannel[]
  sessions: LiveChatSession[]
  onActiveSessionChange: (sessionId: string) => void
  onChannelFilterChange: (channel: LiveChatChannelFilter) => void
  onCollapsedChange: (collapsed: boolean) => void
}

const channelLabels: Record<LiveChatSession['channel'], string> = {
  Haloapps: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
}

const liveChatChannels: LiveChatChannel[] = [
  'WhatsApp',
  'Haloapps',
  'Webchat',
]

const channelFilterOptions: Array<{
  icon: ReactNode
  label: string
  value: LiveChatChannelFilter
}> = [
  {
    icon: <span className="live-chat-channel-icon__all-label">ALL</span>,
    label: 'All channels',
    value: 'all',
  },
  {
    icon: <WhatsAppOutlined />,
    label: channelLabels.WhatsApp,
    value: 'WhatsApp',
  },
  {
    icon: <MobileOutlined />,
    label: channelLabels.Haloapps,
    value: 'Haloapps',
  },
  {
    icon: <GlobalOutlined />,
    label: channelLabels.Webchat,
    value: 'Webchat',
  },
]

function getChannelIconClassName(channel: LiveChatChannelFilter) {
  if (channel === 'all') {
    return 'live-chat-channel-icon--all'
  }

  if (channel === 'Haloapps') {
    return 'live-chat-channel-icon--bankapp'
  }

  return `live-chat-channel-icon--${channel.toLowerCase()}`
}

function getChannelLabel(channel: LiveChatSession['channel']) {
  return channelLabels[channel]
}

function renderChannelIcon(
  channel: LiveChatChannelFilter,
  icon: ReactNode,
  extraClassName = '',
) {
  return (
    <span
      className={[
        'live-chat-channel-icon',
        getChannelIconClassName(channel),
        extraClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
    </span>
  )
}

function getSessionIcon(session: LiveChatSession) {
  const filterOption = channelFilterOptions.find(
    (option) => option.value === session.channel,
  )

  return renderChannelIcon(
    session.channel,
    filterOption?.icon ?? <GlobalOutlined />,
    'live-chat-channel-icon--customer',
  )
}

export function LiveChatCustomerList({
  activeSessionId,
  collapsed,
  selectedChannels,
  sessions,
  onActiveSessionChange,
  onChannelFilterChange,
  onCollapsedChange,
}: LiveChatCustomerListProps) {
  const isAllChannelsSelected = liveChatChannels.every((channel) =>
    selectedChannels.includes(channel),
  )

  return (
    <aside
      className={[
        'live-chat-customer-list',
        collapsed ? 'live-chat-customer-list--collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Live chat customer list"
    >
      <div className="live-chat-customer-list__header">
        <div
          aria-label="Filter live chat customers by channel"
          className="live-chat-customer-list__filters"
          role="group"
        >
          {channelFilterOptions.map((option) => {
            const isActive =
              option.value === 'all'
                ? isAllChannelsSelected
                : selectedChannels.includes(option.value)

            return (
              <button
                aria-label={`Show ${option.label}`}
                aria-pressed={isActive}
                className={[
                  'live-chat-customer-list__filter',
                  isActive ? 'live-chat-customer-list__filter--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={option.value}
                title={option.label}
                type="button"
                onClick={() => onChannelFilterChange(option.value)}
              >
                {renderChannelIcon(option.value, option.icon)}
              </button>
            )
          })}
        </div>

        <button
          aria-label={
            collapsed
              ? 'Expand live chat customer list'
              : 'Collapse live chat customer list'
          }
          className="live-chat-customer-list__toggle"
          title={collapsed ? 'Expand' : 'Collapse'}
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </div>

      <div className="live-chat-customer-list__items" role="list">
        {sessions.length === 0 && (
          <span className="live-chat-customer-list__empty">
            No active chats
          </span>
        )}

        {sessions.map((session) => {
          const isActive = session.id === activeSessionId
          const { profile } = session.customer

          return (
            <button
              aria-pressed={isActive}
              className={[
                'live-chat-customer-list__item',
                isActive ? 'live-chat-customer-list__item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={session.id}
              title={`${profile.name} - ${getChannelLabel(session.channel)}`}
              type="button"
              onClick={() => onActiveSessionChange(session.id)}
            >
              <Badge count={session.unreadCount} size="small">
                {getSessionIcon(session)}
              </Badge>

              {!collapsed && (
                <span className="live-chat-customer-list__content">
                  <span className="live-chat-customer-list__topline">
                    <strong>{profile.name}</strong>
                    <em>{session.lastMessageTime}</em>
                  </span>
                  <span className="live-chat-customer-list__message">
                    {session.lastMessage}
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
