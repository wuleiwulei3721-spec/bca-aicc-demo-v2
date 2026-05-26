import {
  ClockCircleOutlined,
  DownOutlined,
  EditOutlined,
  GlobalOutlined,
  LeftOutlined,
  MobileOutlined,
  RightOutlined,
  SortAscendingOutlined,
  StarFilled,
  SwapOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown, Select, Tooltip } from 'antd'
import type { ReactNode } from 'react'
import type { MenuProps } from 'antd'
import type {
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
  isFlashing: boolean
  lastMessageDisplay: string
  lastMessageTimeDisplay: string
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
  newAccessCount: number
  selectedChannels: LiveChat2Channel[]
  serviceSessions: LiveChat2SessionView[]
  sortMode: LiveChat2SortMode
  totalServingCount: number
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
  Haloapps: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
}

const liveChat2Channels: LiveChat2Channel[] = [
  'WhatsApp',
  'Haloapps',
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
    label: channelLabels.Haloapps,
    value: 'Haloapps',
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

  if (channel === 'Haloapps') {
    return <MobileOutlined />
  }

  return <GlobalOutlined />
}

function getChannelClassName(channel: LiveChat2ChannelFilter) {
  if (channel === 'all') {
    return 'livechat2-channel-avatar--all'
  }

  if (channel === 'Haloapps') {
    return 'livechat2-channel-avatar--bankapp'
  }

  return `livechat2-channel-avatar--${channel.toLowerCase()}`
}

function getStarMenuItems(): MenuProps['items'] {
  return (['gray', 'red', 'blue', 'yellow'] as LiveChat2StarColor[]).map(
    (color) => ({
      key: color,
      label: (
        <span className="livechat2-star-menu-item">
          <StarFilled
            className={[
              'livechat2-star',
              `livechat2-star--${color}`,
            ].join(' ')}
          />
          {starColorLabels[color]}
        </span>
      ),
    }),
  )
}

function renderTransferSource(session: LiveChat2SessionView) {
  if (!session.transferSource) {
    return null
  }

  const { agentName, employeeId, team, transferredAt } =
    session.transferSource

  return (
    <Tooltip
      placement="right"
      title={`${agentName} (${employeeId}) transferred this customer from ${team} at ${transferredAt}.`}
    >
      <span
        aria-label="Transferred customer"
        className="livechat2-session-card__transfer"
        role="img"
      >
        <SwapOutlined />
      </span>
    </Tooltip>
  )
}

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

  return (
    <div
      aria-pressed={isActive}
      className={[
        'livechat2-session-card',
        isActive ? 'livechat2-session-card--active' : '',
        isEnded || isHistory ? 'livechat2-session-card--ended' : '',
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
        </span>
      </Badge>

      <span className="livechat2-session-card__body">
        <span className="livechat2-session-card__topline">
          <strong>{session.customer.profile.name}</strong>
          <span className="livechat2-session-card__time">
            {session.lastMessageTimeDisplay}
          </span>
        </span>
        <span className="livechat2-session-card__message">
          {session.draftMessage && !isActive ? (
            <em>
              <EditOutlined />
              Draft: {session.draftMessage}
            </em>
          ) : (
            session.lastMessageDisplay
          )}
        </span>
      </span>

      <span className="livechat2-session-card__tools">
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
            <ClockCircleOutlined />
            {unansweredLabel}
          </span>
        )}
        {renderTransferSource(session)}
        {!isHistory && (
          <Dropdown
            menu={{
              items: getStarMenuItems(),
              onClick: ({ key }) =>
                onStarColorChange(session.id, key as LiveChat2StarColor),
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <span
              className="livechat2-session-card__star-button"
              onClick={(event) => event.stopPropagation()}
            >
              <StarFilled
                className={[
                  'livechat2-star',
                  `livechat2-star--${session.starColor}`,
                ].join(' ')}
              />
              <DownOutlined />
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
    </div>
  )
}

export function LiveChat2CustomerPanel({
  activeSessionId,
  collapsed,
  historySessions,
  newAccessCount,
  selectedChannels,
  serviceSessions,
  sortMode,
  totalServingCount,
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

  return (
    <aside
      className={[
        'livechat2-customer-panel',
        collapsed ? 'livechat2-customer-panel--collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="livechat2 customers"
    >
      <header className="livechat2-customer-panel__header">
        <div
          aria-label="Filter livechat2 customers by channel"
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
              ? 'Expand livechat2 customer list'
              : 'Collapse livechat2 customer list'
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
        <div className="livechat2-customer-panel__tools">
          <div className="livechat2-customer-panel__metrics">
            <Badge count={newAccessCount} overflowCount={99} size="small">
              <span className="livechat2-customer-panel__metric-icon">
                <WhatsAppOutlined />
              </span>
            </Badge>
            <span>Serving: {totalServingCount}</span>
          </div>
          <Select
            aria-label="Sort livechat2 customers"
            className="livechat2-customer-panel__sort"
            options={[
              {
                label: 'Access time',
                value: 'access-time',
              },
              {
                label: 'Message time',
                value: 'message-time',
              },
            ]}
            prefix={<SortAscendingOutlined />}
            size="small"
            value={sortMode}
            onChange={onSortModeChange}
          />
        </div>
      )}

      {!collapsed && (
        <div
          className="livechat2-customer-panel__view-toggle"
          role="tablist"
        >
          <button
            aria-selected={view === 'current'}
            className={
              view === 'current'
                ? 'livechat2-customer-panel__view-toggle-button livechat2-customer-panel__view-toggle-button--active'
                : 'livechat2-customer-panel__view-toggle-button'
            }
            role="tab"
            type="button"
            onClick={() => onViewChange('current')}
          >
            Current
            <span>{visibleServiceSessions.length}</span>
          </button>
          <button
            aria-selected={view === 'history'}
            className={
              view === 'history'
                ? 'livechat2-customer-panel__view-toggle-button livechat2-customer-panel__view-toggle-button--active'
                : 'livechat2-customer-panel__view-toggle-button'
            }
            role="tab"
            type="button"
            onClick={() => onViewChange('history')}
          >
            History
            <span>{visibleHistorySessions.length}</span>
          </button>
        </div>
      )}

      <section className="livechat2-customer-panel__section">
        <div className="livechat2-customer-panel__list" role="list">
          {visibleSessions.slice(0, view === 'history' ? 30 : undefined).map((session) =>
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
