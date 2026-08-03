import {
  DisconnectOutlined,
  EditOutlined,
  GlobalOutlined,
  LeftOutlined,
  MenuOutlined,
  MobileOutlined,
  RightOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import type {
  LiveChat2EndReason,
  LiveChat2Session,
  LiveChat2SortMode,
  LiveChat2StarColor,
  ServiceEndedBy,
} from '../../../types'
import {
  formatDuration,
  LIVE_CHAT_SLA_BREACH_SECONDS,
  type InteractionSlaState,
} from '../../../utils/duration'

type LiveChat2Channel = LiveChat2Session['channel']
type LiveChat2ListView = 'current' | 'history'

export interface LiveChat2SessionView extends LiveChat2Session {
  draftMessage: string
  elapsedSeconds: number
  endedBy: ServiceEndedBy | null
  endReason: LiveChat2EndReason | null
  endReasonName: string | null
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
  currentSessions: LiveChat2SessionView[]
  historySessions: LiveChat2SessionView[]
  sortMode: LiveChat2SortMode
  view: LiveChat2ListView
  onCloseSession: (sessionId: string) => void
  onCollapsedChange: (collapsed: boolean) => void
  onSelectSession: (sessionId: string) => void
  onSortModeChange: (sortMode: LiveChat2SortMode) => void
  onViewChange: (view: LiveChat2ListView) => void
}

const channelLabels: Record<LiveChat2Session['channel'], string> = {
  BankApp: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
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

function getChannelClassName(channel: LiveChat2Channel) {
  if (channel === 'BankApp') {
    return 'livechat2-channel-avatar--bankapp'
  }

  return `livechat2-channel-avatar--${channel.toLowerCase()}`
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

function getUnansweredProgressPercent(unansweredSeconds: number) {
  return Math.min(
    100,
    Math.round((unansweredSeconds / LIVE_CHAT_SLA_BREACH_SECONDS) * 100),
  )
}

function renderSessionCard({
  activeSessionId,
  session,
  onCloseSession,
  onSelectSession,
}: {
  activeSessionId: string
  session: LiveChat2SessionView
  onCloseSession: (sessionId: string) => void
  onSelectSession: (sessionId: string) => void
}) {
  const isActive = session.id === activeSessionId
  const isEnded = session.statusDisplay === 'ended'
  const isHistory = session.statusDisplay === 'history'
  const unansweredLabel =
    session.unansweredSeconds === null
      ? null
      : formatDuration(session.unansweredSeconds)
  const hasVisibleSecondRowAction = isEnded
  const hasUnansweredProgress =
    session.unansweredSeconds !== null && !isHistory && !isEnded
  const unansweredProgressPercent =
    session.unansweredSeconds === null
      ? 0
      : getUnansweredProgressPercent(session.unansweredSeconds)
  const unansweredLimitLabel = formatDuration(LIVE_CHAT_SLA_BREACH_SECONDS)

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
        {isEnded && (
          <span className="livechat2-session-card__action-row">
            <span
              className="livechat2-session-card__close"
              onClick={(event) => {
                event.stopPropagation()
                onCloseSession(session.id)
              }}
            >
              Close
            </span>
          </span>
        )}
      </span>
      {hasUnansweredProgress && (
        <span
          aria-label={`Unanswered progress ${unansweredLabel ?? '00:00'} of ${unansweredLimitLabel}`}
          aria-valuemax={LIVE_CHAT_SLA_BREACH_SECONDS}
          aria-valuemin={0}
          aria-valuenow={Math.min(
            session.unansweredSeconds ?? 0,
            LIVE_CHAT_SLA_BREACH_SECONDS,
          )}
          className="livechat2-session-card__sla-progress"
          role="meter"
          title={`Unanswered ${unansweredLabel ?? '00:00'} / ${unansweredLimitLabel}`}
        >
          <span
            className={[
              'livechat2-session-card__sla-progress-fill',
              `livechat2-session-card__sla-progress-fill--${session.slaState}`,
            ].join(' ')}
            style={{ width: `${unansweredProgressPercent}%` }}
          />
        </span>
      )}
    </div>
  )
}

export function LiveChat2CustomerPanel({
  activeSessionId,
  collapsed,
  currentSessions,
  historySessions,
  sortMode,
  view,
  onCloseSession,
  onCollapsedChange,
  onSelectSession,
  onSortModeChange,
  onViewChange,
}: LiveChat2CustomerPanelProps) {
  const visibleCurrentSessions = currentSessions
  const visibleHistorySessions = historySessions
  const visibleSessions =
    view === 'current' ? visibleCurrentSessions : visibleHistorySessions
  const emptyListTitle =
    view === 'current' ? 'No current conversations' : 'No history conversations'
  const emptyListDescription =
    view === 'current'
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
      <div className="livechat2-customer-panel__view-toggle">
        {!collapsed && (
          <div className="livechat2-customer-panel__view-tabs" role="tablist">
            <button
              aria-label={`Current conversations, ${visibleCurrentSessions.length}`}
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
                {visibleCurrentSessions.length}
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
        )}
        <div className="livechat2-customer-panel__view-actions">
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
      </div>

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
              }),
            )}
        </div>
      </section>
    </aside>
  )
}
