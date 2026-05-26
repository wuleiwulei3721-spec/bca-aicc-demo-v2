import { useCallback, useEffect, useMemo } from 'react'
import { liveChat2Sessions } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type {
  LiveChat2Message,
  LiveChat2Session,
  LiveChat2SortMode,
  LiveChat2StarColor,
} from '../../types'
import {
  getElapsedSeconds,
  getLiveChatSlaState,
  parseDurationSeconds,
} from '../../utils/duration'
import { useNow } from '../../hooks/useNow'
import { InteractionWorkspace } from './InteractionWorkspace'
import { LiveChat2ConversationWorkspace } from './components/LiveChat2ConversationWorkspace'
import {
  LiveChat2CustomerPanel,
  type LiveChat2SessionView,
} from './components/LiveChat2CustomerPanel'

const liveChat2SessionById = Object.fromEntries(
  liveChat2Sessions.map((session) => [session.id, session]),
) as Record<string, LiveChat2Session>

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

export function LiveChat2Page() {
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
      const elapsedSeconds = timing
        ? getElapsedSeconds(timing.startedAt, endedAt ?? now)
        : parseDurationSeconds(session.customer.accessDuration)
      const unansweredSince =
        statusDisplay === 'active'
          ? liveChat2UnansweredSinceBySessionId[session.id]
          : undefined
      const unansweredSeconds = unansweredSince
        ? getElapsedSeconds(unansweredSince, now)
        : null
      const isRead = liveChat2ReadSessionIds.includes(session.id)

      return {
        ...session,
        draftMessage: liveChat2DraftMessages[session.id] ?? '',
        elapsedSeconds,
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
        lastMessageTimeDisplay:
          summaryOverride?.lastMessageTime ?? session.lastMessageTime,
        slaState: getLiveChatSlaState(unansweredSeconds ?? 0),
        starColor:
          liveChat2StarColors[session.id] ?? session.initialStarColor ?? 'gray',
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
  const newAccessCount = serviceSessions.filter(
    (session) => !liveChat2ReadSessionIds.includes(session.id),
  ).length
  const totalServingCount = serviceSessions.filter(
    (session) => session.statusDisplay === 'active',
  ).length

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

  const leadPanel = (
    <LiveChat2CustomerPanel
      activeSessionId={activeSession?.id ?? ''}
      historySessions={historySessions}
      newAccessCount={newAccessCount}
      serviceSessions={serviceSessions}
      sortMode={liveChat2SortMode}
      totalServingCount={totalServingCount}
      onCloseSession={closeLiveChat2Session}
      onSelectSession={handleSelectSession}
      onSortModeChange={setLiveChat2SortMode}
      onStarColorChange={(
        sessionId: string,
        starColor: LiveChat2StarColor,
      ) => setLiveChat2StarColor(sessionId, starColor)}
    />
  )

  if (!activeSession) {
    return (
      <section
        aria-label="livechat2 workspace"
        className="inbound-page inbound-page--livechat2"
      >
        {leadPanel}
        <div className="livechat2-empty-workspace">
          <strong>No livechat2 customers</strong>
          <span>Use Channel Simulation &gt; livechat2 to add customers.</span>
        </div>
      </section>
    )
  }

  return (
    <InteractionWorkspace
      ariaLabel="livechat2 workspace"
      className="inbound-page--livechat2"
      conversationContent={
        <LiveChat2ConversationWorkspace
          draftMessage={liveChat2DraftMessages[activeSession.id] ?? ''}
          messages={messages}
          recalledMessageIds={liveChat2RecalledMessageIds}
          session={activeSession}
          onCloseSession={closeLiveChat2Session}
          onDraftChange={setLiveChat2DraftMessage}
          onEndSession={(sessionId, baseMessages: LiveChat2Message[]) =>
            endLiveChat2Session(sessionId, 'agent', baseMessages)
          }
          onRecallMessage={recallLiveChat2Message}
          onSendMessage={sendLiveChat2Message}
        />
      }
      conversationKey={activeSession.id}
      customer={activeSession.customer}
      leadPanel={leadPanel}
    />
  )
}
