import {
  ClockCircleOutlined,
  DownOutlined,
  EditOutlined,
  GlobalOutlined,
  MobileOutlined,
  SortAscendingOutlined,
  StarFilled,
  SwapOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown, Select, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import type {
  LiveChat2Session,
  LiveChat2SortMode,
  LiveChat2StarColor,
} from '../../../types'
import { formatDuration, type InteractionSlaState } from '../../../utils/duration'

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
  historySessions: LiveChat2SessionView[]
  newAccessCount: number
  serviceSessions: LiveChat2SessionView[]
  sortMode: LiveChat2SortMode
  totalServingCount: number
  onCloseSession: (sessionId: string) => void
  onSelectSession: (sessionId: string) => void
  onSortModeChange: (sortMode: LiveChat2SortMode) => void
  onStarColorChange: (
    sessionId: string,
    starColor: LiveChat2StarColor,
  ) => void
}

const channelLabels: Record<LiveChat2Session['channel'], string> = {
  Haloapps: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
}

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

function getChannelClassName(channel: LiveChat2Session['channel']) {
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
        <span className="livechat2-session-card__meta">
          <span>{channelLabels[session.channel]}</span>
          <span>{session.queueName}</span>
          {unansweredLabel && (
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
        </span>
      </span>

      <span className="livechat2-session-card__tools">
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
  historySessions,
  newAccessCount,
  serviceSessions,
  sortMode,
  totalServingCount,
  onCloseSession,
  onSelectSession,
  onSortModeChange,
  onStarColorChange,
}: LiveChat2CustomerPanelProps) {
  return (
    <aside className="livechat2-customer-panel" aria-label="livechat2 customers">
      <header className="livechat2-customer-panel__header">
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
      </header>

      <section className="livechat2-customer-panel__section">
        <div className="livechat2-customer-panel__section-title">
          <strong>Current Service</strong>
          <span>{serviceSessions.length}</span>
        </div>
        <div className="livechat2-customer-panel__list" role="list">
          {serviceSessions.map((session) =>
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

      <section className="livechat2-customer-panel__section livechat2-customer-panel__section--history">
        <div className="livechat2-customer-panel__section-title">
          <strong>History</strong>
          <span>{historySessions.length}</span>
        </div>
        <div className="livechat2-customer-panel__history" role="list">
          {historySessions.slice(0, 30).map((session) =>
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
