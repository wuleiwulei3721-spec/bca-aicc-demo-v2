import { useCallback, useEffect, useMemo, useState } from 'react'
import { HistoryOutlined, MessageOutlined } from '@ant-design/icons'
import { liveChat2Sessions } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type {
  LiveChat2Message,
  LiveChat2Session,
  LiveChat2SortMode,
  LiveChat2StarColor,
} from '../../types'
import {
  formatDuration,
  getElapsedSeconds,
  getLiveChatSlaState,
  parseDurationSeconds,
} from '../../utils/duration'
import { useNow } from '../../hooks/useNow'
import { InteractionWorkspace } from './InteractionWorkspace'
import {
  LiveChat2ConversationWorkspace,
  LiveChat2MessageRecordPanel,
} from './components/LiveChat2ConversationWorkspace'
import {
  LiveChat2CustomerPanel,
  type LiveChat2SessionView,
} from './components/LiveChat2CustomerPanel'
import { LiveChat2QuickRepliesPanel } from './components/LiveChat2QuickRepliesPanel'
import {
  getLiveChat2VisibleMessages,
  type LiveChat2MessageLocateRequest,
} from './components/liveChat2MessageUtils'
import {
  defaultLiveChat2QuickReplyGroups,
  flattenLiveChat2QuickReplies,
} from './components/liveChat2QuickReplies'
import type { LiveChat2QuickReplyGroup } from './components/liveChat2QuickReplies'

const liveChat2Channels: Array<LiveChat2Session['channel']> = [
  'WhatsApp',
  'Haloapps',
  'Webchat',
]

const staticLiveChat2SessionById = Object.fromEntries(
  liveChat2Sessions.map((session) => [session.id, session]),
) as Record<string, LiveChat2Session>
const LIVECHAT2_MESSAGE_RECORD_TAB_KEY = 'livechat2-message-record'
const LIVECHAT2_QUICK_REPLIES_TAB_KEY = 'livechat2-quick-replies'

function getMessageTimestamp(session: LiveChat2SessionView) {
  return new Date(session.lastMessageAt).getTime()
}

function sortSessions(
  sessions: LiveChat2SessionView[],
  sortMode: LiveChat2SortMode,
) {
  return [...sessions].sort((first, second) => {
    if (sortMode === 'message-time') {
      return (
        getMessageTimestamp(second) - getMessageTimestamp(first) ||
        first.accessSequence - second.accessSequence
      )
    }

    return first.accessSequence - second.accessSequence
  })
}

function formatHistoryEndTime(endedAt: number | string | null) {
  if (endedAt === null) {
    return null
  }

  const date = new Date(endedAt)

  if (!Number.isFinite(date.getTime())) {
    return null
  }

  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  const pad = (value: number) => String(value).padStart(2, '0')
  const time = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
    .map(pad)
    .join(':')

  if (isToday) {
    return time
  }

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}`
}

export function LiveChat2Page() {
  const [isCustomerPanelCollapsed, setIsCustomerPanelCollapsed] =
    useState(false)
  const [selectedChannels, setSelectedChannels] =
    useState<Array<LiveChat2Session['channel']>>(liveChat2Channels)
  const [customerPanelView, setCustomerPanelView] = useState<
    'current' | 'history'
  >('current')
  const [isMessageRecordTabOpen, setIsMessageRecordTabOpen] = useState(false)
  const [quickReplyGroups, setQuickReplyGroups] = useState<
    LiveChat2QuickReplyGroup[]
  >(() => defaultLiveChat2QuickReplyGroups)
  const [composerFocusRequest, setComposerFocusRequest] = useState<{
    caretPosition: number
    requestId: number
    sessionId: string
  } | null>(null)
  const [messageLocateRequest, setMessageLocateRequest] =
    useState<LiveChat2MessageLocateRequest | null>(null)
  const [rightPanelActiveKey, setRightPanelActiveKey] = useState('assistant')
  const activeLiveChat2SessionIds = useAppStore(
    (state) => state.activeLiveChat2SessionIds,
  )
  const closeLiveChat2Session = useAppStore(
    (state) => state.closeLiveChat2Session,
  )
  const endLiveChat2Session = useAppStore(
    (state) => state.endLiveChat2Session,
  )
  const liveChat2ClosedSessionIds = useAppStore(
    (state) => state.liveChat2ClosedSessionIds,
  )
  const liveChat2DraftMessages = useAppStore(
    (state) => state.liveChat2DraftMessages,
  )
  const liveChat2FocusSessionId = useAppStore(
    (state) => state.liveChat2FocusSessionId,
  )
  const liveChat2LastMessageOverrides = useAppStore(
    (state) => state.liveChat2LastMessageOverrides,
  )
  const liveChat2MessagesBySessionId = useAppStore(
    (state) => state.liveChat2MessagesBySessionId,
  )
  const liveChat2ReadSessionIds = useAppStore(
    (state) => state.liveChat2ReadSessionIds,
  )
  const liveChat2RecalledMessageIds = useAppStore(
    (state) => state.liveChat2RecalledMessageIds,
  )
  const liveChat2SessionInstances = useAppStore(
    (state) => state.liveChat2SessionInstances,
  )
  const liveChat2SessionStatuses = useAppStore(
    (state) => state.liveChat2SessionStatuses,
  )
  const liveChat2SessionTimings = useAppStore(
    (state) => state.liveChat2SessionTimings,
  )
  const liveChat2SortMode = useAppStore((state) => state.liveChat2SortMode)
  const liveChat2StarColors = useAppStore(
    (state) => state.liveChat2StarColors,
  )
  const liveChat2UnansweredSinceBySessionId = useAppStore(
    (state) => state.liveChat2UnansweredSinceBySessionId,
  )
  const markLiveChat2SessionRead = useAppStore(
    (state) => state.markLiveChat2SessionRead,
  )
  const recallLiveChat2Message = useAppStore(
    (state) => state.recallLiveChat2Message,
  )
  const sendLiveChat2Message = useAppStore(
    (state) => state.sendLiveChat2Message,
  )
  const setLiveChat2DraftMessage = useAppStore(
    (state) => state.setLiveChat2DraftMessage,
  )
  const setLiveChat2FocusedSession = useAppStore(
    (state) => state.setLiveChat2FocusedSession,
  )
  const setLiveChat2SortMode = useAppStore(
    (state) => state.setLiveChat2SortMode,
  )
  const setLiveChat2StarColor = useAppStore(
    (state) => state.setLiveChat2StarColor,
  )
  const now = useNow(activeLiveChat2SessionIds.length > 0)
  const quickReplyOptions = useMemo(
    () => flattenLiveChat2QuickReplies(quickReplyGroups),
    [quickReplyGroups],
  )
  const liveChat2SessionById = useMemo(
    () => ({
      ...staticLiveChat2SessionById,
      ...liveChat2SessionInstances,
    }),
    [liveChat2SessionInstances],
  )

  const createSessionView = useCallback(
    (session: LiveChat2Session): LiveChat2SessionView => {
      const summaryOverride = liveChat2LastMessageOverrides[session.id]
      const timing = liveChat2SessionTimings[session.id]
      const statusState = liveChat2SessionStatuses[session.id]
      const isClosedHistory = liveChat2ClosedSessionIds.includes(session.id)
      const statusDisplay =
        session.isInitialHistory || isClosedHistory
          ? 'history'
          : statusState?.status ?? session.status
      const endedAt = statusState?.endedAt ?? null
      const endReason = statusState?.endReason ?? session.endReason ?? null
      const endTimeDisplay =
        statusDisplay === 'history'
          ? formatHistoryEndTime(
              endedAt ?? summaryOverride?.lastMessageAt ?? session.lastMessageAt,
            )
          : null
      const elapsedSeconds = timing
        ? getElapsedSeconds(timing.startedAt, endedAt ?? now)
        : parseDurationSeconds(session.customer.accessDuration)
      const unansweredSince =
        statusDisplay === 'active'
          ? liveChat2UnansweredSinceBySessionId[session.id]
          : undefined
      const unansweredSeconds = unansweredSince
        ? Math.min(getElapsedSeconds(unansweredSince, now), elapsedSeconds)
        : null
      const isRead = liveChat2ReadSessionIds.includes(session.id)

      return {
        ...session,
        draftMessage: liveChat2DraftMessages[session.id] ?? '',
        elapsedSeconds,
        endReason,
        endTimeDisplay,
        isFlashing:
          statusDisplay === 'active' && timing
            ? timing.flashUntil > now
            : false,
        lastMessage: summaryOverride?.lastMessage ?? session.lastMessage,
        lastMessageAt: summaryOverride?.lastMessageAt ?? session.lastMessageAt,
        lastMessageDisplay:
          summaryOverride?.lastMessage ?? session.lastMessage,
        lastMessageTime:
          summaryOverride?.lastMessageTime ?? session.lastMessageTime,
        slaState: getLiveChatSlaState(unansweredSeconds ?? 0),
        starColor: liveChat2StarColors[session.id] ?? 'gray',
        statusDisplay,
        unansweredSeconds,
        unreadCount: isRead
          ? 0
          : summaryOverride?.unreadCount ?? session.unreadCount,
        unreadCountDisplay: isRead
          ? 0
          : summaryOverride?.unreadCount ?? session.unreadCount,
      }
    },
    [
      liveChat2ClosedSessionIds,
      liveChat2DraftMessages,
      liveChat2LastMessageOverrides,
      liveChat2ReadSessionIds,
      liveChat2SessionStatuses,
      liveChat2SessionTimings,
      liveChat2StarColors,
      liveChat2UnansweredSinceBySessionId,
      now,
    ],
  )

  const serviceSessions = useMemo(
    () =>
      sortSessions(
        activeLiveChat2SessionIds
          .map((sessionId) => liveChat2SessionById[sessionId])
          .filter((session): session is LiveChat2Session => Boolean(session))
          .map(createSessionView),
        liveChat2SortMode,
      ),
    [
      activeLiveChat2SessionIds,
      liveChat2SortMode,
      liveChat2SessionById,
      createSessionView,
    ],
  )

  const historySessions = useMemo(() => {
    const historyIds = [
      ...liveChat2ClosedSessionIds,
      ...liveChat2Sessions
        .filter((session) => session.isInitialHistory)
        .map((session) => session.id),
    ]
    const uniqueHistoryIds = Array.from(new Set(historyIds))

    return uniqueHistoryIds
      .map((sessionId) => liveChat2SessionById[sessionId])
      .filter((session): session is LiveChat2Session => Boolean(session))
      .map(createSessionView)
      .sort((first, second) => getMessageTimestamp(second) - getMessageTimestamp(first))
  }, [
    liveChat2ClosedSessionIds,
    liveChat2SessionById,
    createSessionView,
  ])

  const activeSession =
    serviceSessions.find((session) => session.id === liveChat2FocusSessionId) ??
    historySessions.find((session) => session.id === liveChat2FocusSessionId) ??
    serviceSessions[0] ??
    historySessions[0]
  const messages = activeSession
    ? liveChat2MessagesBySessionId[activeSession.id] ?? activeSession.messages
    : []

  useEffect(() => {
    if (
      activeSession &&
      activeLiveChat2SessionIds.includes(activeSession.id) &&
      !liveChat2ReadSessionIds.includes(activeSession.id)
    ) {
      markLiveChat2SessionRead(activeSession.id)
    }
  }, [
    activeLiveChat2SessionIds,
    activeSession,
    liveChat2ReadSessionIds,
    markLiveChat2SessionRead,
  ])

  const handleSelectSession = (sessionId: string) => {
    setLiveChat2FocusedSession(sessionId)

    if (activeLiveChat2SessionIds.includes(sessionId)) {
      markLiveChat2SessionRead(sessionId)
    }
  }

  const handleChannelFilterChange = (
    nextChannel: 'all' | LiveChat2Session['channel'],
  ) => {
    if (nextChannel === 'all') {
      const isAllChannelsSelected = liveChat2Channels.every((channel) =>
        selectedChannels.includes(channel),
      )

      setSelectedChannels(isAllChannelsSelected ? [] : liveChat2Channels)
      return
    }

    setSelectedChannels((currentChannels) =>
      currentChannels.includes(nextChannel)
        ? currentChannels.filter((channel) => channel !== nextChannel)
        : [...currentChannels, nextChannel],
    )
  }

  const handleCloseRightPanelTab = (targetKey: string) => {
    if (targetKey !== LIVECHAT2_MESSAGE_RECORD_TAB_KEY) {
      return
    }

    setIsMessageRecordTabOpen(false)
    setRightPanelActiveKey((currentKey) =>
      currentKey === LIVECHAT2_MESSAGE_RECORD_TAB_KEY ? 'connection' : currentKey,
    )
  }

  const handleToggleMessageRecord = () => {
    if (isMessageRecordTabOpen) {
      handleCloseRightPanelTab(LIVECHAT2_MESSAGE_RECORD_TAB_KEY)
      return
    }

    setIsMessageRecordTabOpen(true)
    setRightPanelActiveKey(LIVECHAT2_MESSAGE_RECORD_TAB_KEY)
  }

  const handleLocateMessageRecord = (messageId: string) => {
    setMessageLocateRequest((currentRequest) => ({
      messageId,
      requestId: (currentRequest?.requestId ?? 0) + 1,
    }))
  }

  const handleInsertQuickReply = (text: string) => {
    if (!activeSession) {
      return
    }

    setLiveChat2DraftMessage(activeSession.id, text)
    setComposerFocusRequest((currentRequest) => ({
      caretPosition: text.length,
      requestId: (currentRequest?.requestId ?? 0) + 1,
      sessionId: activeSession.id,
    }))
  }

  const handleEndService = (
    sessionId: string,
    baseMessages: LiveChat2Message[],
  ) => {
    endLiveChat2Session(sessionId, 'agent', baseMessages)
    closeLiveChat2Session(sessionId)
  }

  const leadPanel = (
    <LiveChat2CustomerPanel
      activeSessionId={activeSession?.id ?? ''}
      collapsed={isCustomerPanelCollapsed}
      historySessions={historySessions}
      selectedChannels={selectedChannels}
      serviceSessions={serviceSessions}
      sortMode={liveChat2SortMode}
      view={customerPanelView}
      onCloseSession={closeLiveChat2Session}
      onCollapsedChange={setIsCustomerPanelCollapsed}
      onChannelFilterChange={handleChannelFilterChange}
      onSelectSession={handleSelectSession}
      onSortModeChange={setLiveChat2SortMode}
      onStarColorChange={(
        sessionId: string,
        starColor: LiveChat2StarColor,
      ) => setLiveChat2StarColor(sessionId, starColor)}
      onViewChange={setCustomerPanelView}
    />
  )

  if (!activeSession) {
    return (
      <section
        aria-label="Live Chat workspace"
        className={[
          'inbound-page',
          'inbound-page--livechat2',
          isCustomerPanelCollapsed
            ? 'inbound-page--livechat2-list-collapsed'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {leadPanel}
        <div className="livechat2-empty-workspace">
          <strong>No Live Chat customers</strong>
          <span>Use WhatsApp or BankApp Demo to route a live chat customer.</span>
        </div>
      </section>
    )
  }

  const messageRecordMessages = getLiveChat2VisibleMessages(
    activeSession.historyMessages,
    messages,
  )
  const assistantExtraTabs = [
    {
      children: (
        <LiveChat2QuickRepliesPanel
          groups={quickReplyGroups}
          onGroupsChange={setQuickReplyGroups}
          onInsertPhrase={handleInsertQuickReply}
        />
      ),
      closable: false,
      icon: <MessageOutlined />,
      key: LIVECHAT2_QUICK_REPLIES_TAB_KEY,
      title: 'Quick Replies',
    },
    ...(isMessageRecordTabOpen
      ? [
          {
            children: (
              <LiveChat2MessageRecordPanel
                messages={messageRecordMessages}
                onLocateMessage={handleLocateMessageRecord}
              />
            ),
            icon: <HistoryOutlined />,
            key: LIVECHAT2_MESSAGE_RECORD_TAB_KEY,
            title: 'Message Record',
          },
        ]
      : []),
  ]

  return (
    <InteractionWorkspace
      ariaLabel="Live Chat workspace"
      assistantActiveKey={rightPanelActiveKey}
      assistantExtraTabs={assistantExtraTabs}
      className={[
        'inbound-page--livechat2',
        isCustomerPanelCollapsed
          ? 'inbound-page--livechat2-list-collapsed'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      conversationContent={
        <LiveChat2ConversationWorkspace
          composerFocusRequest={composerFocusRequest}
          draftMessage={liveChat2DraftMessages[activeSession.id] ?? ''}
          isMessageRecordOpen={isMessageRecordTabOpen}
          messageLocateRequest={messageLocateRequest}
          messages={messages}
          quickReplies={quickReplyOptions}
          recalledMessageIds={liveChat2RecalledMessageIds}
          session={activeSession}
          onCloseSession={closeLiveChat2Session}
          onDraftChange={setLiveChat2DraftMessage}
          onEndSession={handleEndService}
          onOpenMessageRecord={handleToggleMessageRecord}
          onRecallMessage={recallLiveChat2Message}
          onSendMessage={sendLiveChat2Message}
        />
      }
      conversationKey={activeSession.id}
      customer={{
        ...activeSession.customer,
        accessDuration: formatDuration(activeSession.elapsedSeconds),
      }}
      leadPanel={leadPanel}
      onAssistantActiveKeyChange={setRightPanelActiveKey}
      onAssistantCloseExtraTab={handleCloseRightPanelTab}
    />
  )
}
