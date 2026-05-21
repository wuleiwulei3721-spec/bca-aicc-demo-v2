import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Avatar, Badge } from 'antd'
import type { LiveChatSession } from '../../../types'
import { ChannelTag } from './ChannelTag'

interface LiveChatCustomerListProps {
  activeSessionId: string
  collapsed: boolean
  sessions: LiveChatSession[]
  onActiveSessionChange: (sessionId: string) => void
  onCollapsedChange: (collapsed: boolean) => void
}

export function LiveChatCustomerList({
  activeSessionId,
  collapsed,
  sessions,
  onActiveSessionChange,
  onCollapsedChange,
}: LiveChatCustomerListProps) {
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
        {!collapsed && (
          <div className="live-chat-customer-list__heading">
            <strong>Live Chat</strong>
            <span>{sessions.length} active</span>
          </div>
        )}
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
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <div className="live-chat-customer-list__items" role="list">
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
              title={`${profile.name} - ${session.channel}`}
              type="button"
              onClick={() => onActiveSessionChange(session.id)}
            >
              <Badge count={session.unreadCount} size="small">
                <Avatar
                  className="live-chat-customer-list__avatar"
                  size={collapsed ? 32 : 36}
                  src={profile.avatarUrl || undefined}
                >
                  {profile.avatarInitials}
                </Avatar>
              </Badge>

              {!collapsed && (
                <span className="live-chat-customer-list__content">
                  <span className="live-chat-customer-list__topline">
                    <strong>{profile.name}</strong>
                    <em>{session.lastMessageTime}</em>
                  </span>
                  <span className="live-chat-customer-list__meta">
                    <ChannelTag compact value={session.channel} />
                    {session.priority === 'High' && (
                      <span className="live-chat-customer-list__priority">
                        High
                      </span>
                    )}
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
