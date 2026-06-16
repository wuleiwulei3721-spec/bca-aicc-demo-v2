import {
  DisconnectOutlined,
  EditOutlined,
  GlobalOutlined,
  LeftOutlined,
  MenuOutlined,
  MobileOutlined,
  RightOutlined,
  StarFilled,
  StarOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown } from 'antd'
import type { ReactNode } from 'react'
import type { MenuProps } from 'antd'
import type {
  LiveChat2EndReason,
  LiveChat2Session,
  LiveChat2SortMode,
  LiveChat2StarColor,
} from '../../../types'
import { formatDuration, type InteractionSlaState } from '../../../utils/duration'

type LiveChat2Channel = LiveChat2Session['channel']
type LiveChat2ChannelFilter = 'all' | LiveChat2Channel
type LiveChat2ListView = 'current' | 'history'

export interface LiveChat2SessionView extends LiveChat2Session {
  draftMessage: string
  elapsedSeconds: number
  endReason: LiveChat2EndReason | null
  endTimeDisplay: string | null
  isFlashing: boolean
  lastMessageDisplay: string
  slaState: InteractionSlaState
  starColor: LiveChat2StarColor
  statusDisplay: 'active' | 'ended' | 'history'
  unansweredSeconds: number | null
  unreadCountDisplay: number
}

interface LiveChat2CustomerPanelProps {
  activeSessionId: string
  collapsed: boolean
  historySessions: LiveChat2SessionView[]
  selectedChannels: LiveChat2Channel[]
  serviceSessions: LiveChat2SessionView[]
  sortMode: LiveChat2SortMode
  view: LiveChat2ListView
  onCloseSession: (sessionId: string) => void
  onCollapsedChange: (collapsed: boolean) => void
  onChannelFilterChange: (channel: LiveChat2ChannelFilter) => void
  onSelectSession: (sessionId: string) => void
  onSortModeChange: (sortMode: LiveChat2SortMode) => void
  onStarColorChange: (
    sessionId: string,
    starColor: LiveChat2StarColor,
  ) => void
  onViewChange: (view: LiveChat2ListView) => void
}

const channelLabels: Record<LiveChat2Session['channel'], string> = {
  BankApp: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
}

const liveChat2Channels: LiveChat2Channel[] = [
  'WhatsApp',
  'BankApp',
  'Webchat',
]

const channelFilterOptions: Array<{
  icon: ReactNode
  label: string
  value: LiveChat2ChannelFilter
}> = [
  {
    icon: <span className="livechat2-channel-avatar__all-label">ALL</span>,
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
    label: channelLabels.BankApp,
    value: 'BankApp',
  },
  {
    icon: <GlobalOutlined />,
    label: channelLabels.Webchat,
    value: 'Webchat',
  },
]

const starColorLabels: Record<LiveChat2StarColor, string> = {
  blue: 'Blue flag',
  gray: 'No flag',
  red: 'Red flag',
  yellow: 'Yellow flag',
}

function getChannelIcon(channel: LiveChat2Session['channel']) {
  if (channel === 'WhatsApp') {
    return <WhatsAppOutlined />
  }

  if (channel === 'BankApp') {
    return <MobileOutlined />
  }

  return <GlobalOutlined />
}

function getChannelClassName(channel: LiveChat2ChannelFilter) {
  if (channel === 'all') {
    return 'livechat2-channel-avatar--all'
  }

  if (channel === 'BankApp') {
    return 'livechat2-channel-avatar--bankapp'
  }

  return `livechat2-channel-avatar--${channel.toLowerCase()}`
}

function getStarMenuItems(): MenuProps['items'] {
  return (['gray', 'red', 'blue', 'yellow'] as LiveChat2StarColor[]).map(
    (color) => ({
      key: color,
      label: (
        <span
          aria-label={starColorLabels[color]}
          className="livechat2-star-menu-item"
          title={starColorLabels[color]}
        >
          {color === 'gray' && (
            <StarOutlined
              aria-hidden="true"
              className={[
                'livechat2-star',
                `livechat2-star--${color}`,
              ].join(' ')}
            />
          )}
          {color !== 'gray' && (
            <StarFilled
              aria-hidden="true"
              className={[
                'livechat2-star',
                `livechat2-star--${color}`,
              ].join(' ')}
            />
          )}
        </span>
      ),
    }),
  )
}

const sortMenuItems: MenuProps['items'] = [
  {
    key: 'access-time',
    label: 'Access time',
  },
  {
    key: 'message-time',
    label: 'Message time',
  },
]

function renderSessionCard({
  activeSessionId,
  session,
  onCloseSession,
  onSelectSession,
  onStarColorChange,
}: {
  activeSessionId: string
  session: LiveChat2SessionView
  onCloseSession: (sessionId: string) => void
  onSelectSession: (sessionId: string) => void
  onStarColorChange: (
    sessionId: string,
    starColor: LiveChat2StarColor,
  ) => void
}) {
  const isActive = session.id === activeSessionId
  const isEnded = session.statusDisplay === 'ended'
  const isHistory = session.statusDisplay === 'history'
  const unansweredLabel =
    session.unansweredSeconds === null
      ? null
      : formatDuration(session.unansweredSeconds)
  const hasVisibleSecondRowAction =
    isEnded || (!isHistory && session.starColor !== 'gray')

  return (
    <div
      aria-pressed={isActive}
      className={[
        'livechat2-session-card',
        isActive ? 'livechat2-session-card--active' : '',
        isEnded || isHistory ? 'livechat2-session-card--ended' : '',
        session.slaState !== 'normal'
          ? `livechat2-session-card--${session.slaState}`
          : '',
        session.isFlashing ? 'livechat2-session-card--flash' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      key={session.id}
      role="button"
      tabIndex={0}
      onClick={() => onSelectSession(session.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectSession(session.id)
        }
      }}
    >
      <Badge count={session.unreadCountDisplay} overflowCount={99} size="small">
        <span className="livechat2-session-card__icon-slot">
          <span
            aria-label={channelLabels[session.channel]}
            className={[
              'livechat2-channel-avatar',
              getChannelClassName(session.channel),
            ].join(' ')}
            role="img"
            title={channelLabels[session.channel]}
          >
            {getChannelIcon(session.channel)}
            {!isHistory && session.starColor !== 'gray' && (
              <StarFilled
                aria-hidden="true"
                className={[
                  'livechat2-session-card__collapsed-star',
                  'livechat2-star',
                  `livechat2-star--${session.starColor}`,
                ].join(' ')}
              />
            )}
          </span>
        </span>
      </Badge>

      <span className="livechat2-session-card__content">
        <span className="livechat2-session-card__topline">
          <strong>{session.customer.profile.name}</strong>
        </span>
        {unansweredLabel && !isHistory && (
          <span
            className={[
              'livechat2-session-card__unanswered',
              session.slaState !== 'normal'
                ? `livechat2-session-card__unanswered--${session.slaState}`
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {unansweredLabel}
          </span>
        )}
        {isHistory && session.endTimeDisplay && (
          <span
            aria-label={`Ended ${session.endTimeDisplay}`}
            className="livechat2-session-card__end-time"
            title={`Ended ${session.endTimeDisplay}`}
          >
            <DisconnectOutlined />
            {session.endTimeDisplay}
          </span>
        )}
        <span
          className={[
            'livechat2-session-card__message',
            isHistory || !hasVisibleSecondRowAction
              ? 'livechat2-session-card__message--full-row'
              : '',
            !isHistory && !hasVisibleSecondRowAction
              ? 'livechat2-session-card__message--floating-action'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {session.draftMessage && !isActive ? (
            <em>
              <EditOutlined />
              Draft: {session.draftMessage}
            </em>
          ) : (
            session.lastMessageDisplay
          )}
        </span>
        <span
          className={[
            'livechat2-session-card__action-row',
            !hasVisibleSecondRowAction
              ? 'livechat2-session-card__action-row--floating'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {!isHistory && !isEnded && (
            <Dropdown
              menu={{
                items: getStarMenuItems(),
                onClick: ({ key }) =>
                  onStarColorChange(session.id, key as LiveChat2StarColor),
              }}
              placement="bottomRight"
              trigger={['hover']}
            >
              <span
                aria-label={starColorLabels[session.starColor]}
                className={[
                  'livechat2-session-card__star-button',
                  session.starColor === 'gray'
                    ? 'livechat2-session-card__star-button--empty'
                    : 'livechat2-session-card__star-button--marked',
                ].join(' ')}
                role="button"
                tabIndex={0}
                title={starColorLabels[session.starColor]}
                onClick={(event) => event.stopPropagation()}
              >
                {session.starColor === 'gray' ? (
                  <StarOutlined
                    className={[
                      'livechat2-star',
                      `livechat2-star--${session.starColor}`,
                    ].join(' ')}
                  />
                ) : (
                  <StarFilled
                    className={[
                      'livechat2-star',
                      `livechat2-star--${session.starColor}`,
                    ].join(' ')}
                  />
                )}
              </span>
            </Dropdown>
          )}
          {isEnded && (
            <span
              className="livechat2-session-card__close"
              onClick={(event) => {
                event.stopPropagation()
                onCloseSession(session.id)
              }}
            >
              Close
            </span>
          )}
        </span>
      </span>
    </div>
  )
}

export function LiveChat2CustomerPanel({
  activeSessionId,
  collapsed,
  historySessions,
  selectedChannels,
  serviceSessions,
  sortMode,
  view,
  onCloseSession,
  onCollapsedChange,
  onChannelFilterChange,
  onSelectSession,
  onSortModeChange,
  onStarColorChange,
  onViewChange,
}: LiveChat2CustomerPanelProps) {
  const isAllChannelsSelected = liveChat2Channels.every((channel) =>
    selectedChannels.includes(channel),
  )
  const visibleServiceSessions = serviceSessions.filter((session) =>
    selectedChannels.includes(session.channel),
  )
  const visibleHistorySessions = historySessions.filter((session) =>
    selectedChannels.includes(session.channel),
  )
  const visibleSessions =
    view === 'current' ? visibleServiceSessions : visibleHistorySessions
  const emptyListTitle =
    view === 'current' ? 'No current conversations' : 'No history conversations'
  const emptyListDescription =
    selectedChannels.length === 0
      ? 'Select a channel filter to show conversations.'
      : view === 'current'
        ? 'New conversations will appear here.'
        : 'Closed conversations will appear here.'

  return (
    <aside
      className={[
        'livechat2-customer-panel',
        collapsed ? 'livechat2-customer-panel--collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Live Chat customers"
    >
      <header className="livechat2-customer-panel__header">
        <div
          aria-label="Filter Live Chat customers by channel"
          className="livechat2-customer-panel__filters"
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
                  'livechat2-customer-panel__filter',
                  isActive ? 'livechat2-customer-panel__filter--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={option.value}
                title={option.label}
                type="button"
                onClick={() => onChannelFilterChange(option.value)}
              >
                <span
                  className={[
                    'livechat2-channel-avatar',
                    getChannelClassName(option.value),
                  ].join(' ')}
                >
                  {option.icon}
                </span>
              </button>
            )
          })}
        </div>

        <button
          aria-label={
            collapsed
              ? 'Expand Live Chat customer list'
              : 'Collapse Live Chat customer list'
          }
          className="livechat2-customer-panel__toggle"
          title={collapsed ? 'Expand' : 'Collapse'}
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </header>

      {!collapsed && (
        <div
          className="livechat2-customer-panel__view-toggle"
        >
          <div
            className="livechat2-customer-panel__view-tabs"
            role="tablist"
          >
            <button
              aria-label={`Current conversations, ${visibleServiceSessions.length}`}
              aria-selected={view === 'current'}
              className={
                view === 'current'
                  ? 'livechat2-customer-panel__view-toggle-button livechat2-customer-panel__view-toggle-button--active'
                  : 'livechat2-customer-panel__view-toggle-button'
              }
              role="tab"
              title="Current"
              type="button"
              onClick={() => onViewChange('current')}
            >
              <span className="livechat2-customer-panel__view-label">
                Current
              </span>
              <span className="livechat2-customer-panel__view-count">
                {visibleServiceSessions.length}
              </span>
            </button>
            <button
              aria-label={`History conversations, ${visibleHistorySessions.length}`}
              aria-selected={view === 'history'}
              className={
                view === 'history'
                  ? 'livechat2-customer-panel__view-toggle-button livechat2-customer-panel__view-toggle-button--active'
                  : 'livechat2-customer-panel__view-toggle-button'
              }
              role="tab"
              title="History"
              type="button"
              onClick={() => onViewChange('history')}
            >
              <span className="livechat2-customer-panel__view-label">
                History
              </span>
              <span className="livechat2-customer-panel__view-count">
                {visibleHistorySessions.length}
              </span>
            </button>
          </div>
          <Dropdown
            menu={{
              items: sortMenuItems,
              onClick: ({ key }) =>
                onSortModeChange(key as LiveChat2SortMode),
              selectedKeys: [sortMode],
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <button
              aria-label="Sort Live Chat customers"
              className="livechat2-customer-panel__sort-button"
              title={
                sortMode === 'access-time'
                  ? 'Sort by access time'
                  : 'Sort by message time'
              }
              type="button"
            >
              <MenuOutlined />
            </button>
          </Dropdown>
        </div>
      )}

      <section className="livechat2-customer-panel__section">
        <div className="livechat2-customer-panel__list" role="list">
          {!collapsed && visibleSessions.length === 0 && (
            <div
              className="livechat2-customer-panel__empty"
              role="status"
            >
              <strong>{emptyListTitle}</strong>
              <span>{emptyListDescription}</span>
            </div>
          )}
          {visibleSessions
            .slice(0, view === 'history' ? 30 : undefined)
            .map((session) =>
              renderSessionCard({
                activeSessionId,
                session,
                onCloseSession,
                onSelectSession,
                onStarColorChange,
              }),
            )}
        </div>
      </section>
    </aside>
  )
}
