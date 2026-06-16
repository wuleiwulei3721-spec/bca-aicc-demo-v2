import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNow } from '../../hooks/useNow'
import { liveChatSessions } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type { LiveChatConversationMessage, LiveChatSession } from '../../types'
import {
  getElapsedSeconds,
  getLiveChatSlaState,
  parseDurationSeconds,
} from '../../utils/duration'
import { LiveChatCustomerList } from './components/LiveChatCustomerList'
import { InteractionWorkspace } from './InteractionWorkspace'

type LiveChatChannel = LiveChatSession['channel']
type LiveChatSessionSummary = Pick<
  LiveChatSession,
  'lastMessage' | 'lastMessageTime' | 'unreadCount'
>

const liveChatChannels: LiveChatChannel[] = [
  'WhatsApp',
  'BankApp',
]

function createInitialConversationMessages() {
  return Object.fromEntries(
    liveChatSessions.map((session) => [session.id, session.conversation]),
  ) as Record<string, LiveChatConversationMessage[]>
}

function getCurrentMessageTime() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(new Date())
}

export function LiveChatPage() {
  const activeLiveChatSessionIds = useAppStore(
    (state) => state.activeLiveChatSessionIds,
  )
  const closeLiveChatSession = useAppStore(
    (state) => state.closeLiveChatSession,
  )
  const liveChatFocusRequestId = useAppStore(
    (state) => state.liveChatFocusRequestId,
  )
  const liveChatFocusSessionId = useAppStore(
    (state) => state.liveChatFocusSessionId,
  )
  const liveChatSessionTimings = useAppStore(
    (state) => state.liveChatSessionTimings,
  )
  const markLiveChatSessionRead = useAppStore(
    (state) => state.markLiveChatSessionRead,
  )
  const readLiveChatSessionIds = useAppStore(
    (state) => state.readLiveChatSessionIds,
  )
  const [activeSessionId, setActiveSessionId] = useState(
    activeLiveChatSessionIds[0] ?? '',
  )
  const [isCustomerListCollapsed, setIsCustomerListCollapsed] =
    useState(true)
  const [selectedChannels, setSelectedChannels] =
    useState<LiveChatChannel[]>(liveChatChannels)
  const [conversationMessagesBySessionId, setConversationMessagesBySessionId] =
    useState<Record<string, LiveChatConversationMessage[]>>(
      createInitialConversationMessages,
    )
  const [sessionSummariesById, setSessionSummariesById] = useState<
    Record<string, LiveChatSessionSummary>
  >({})
  const now = useNow(activeLiveChatSessionIds.length > 0)
  const markSessionAsRead = useCallback((sessionId: string) => {
    const sourceSession = liveChatSessions.find(
      (session) => session.id === sessionId,
    )
    markLiveChatSessionRead(sessionId)

    setSessionSummariesById((currentSummariesById) => {
      const currentSummary = currentSummariesById[sessionId]

      if (currentSummary?.unreadCount === 0) {
        return currentSummariesById
      }

      return {
        ...currentSummariesById,
        [sessionId]: {
          lastMessage:
            currentSummary?.lastMessage ?? sourceSession?.lastMessage ?? '',
          lastMessageTime:
            currentSummary?.lastMessageTime ??
            sourceSession?.lastMessageTime ??
            '',
          unreadCount: 0,
        },
      }
    })
  }, [markLiveChatSessionRead])

  const availableSessions = useMemo(
    () =>
      liveChatSessions
        .filter((session) => activeLiveChatSessionIds.includes(session.id))
        .filter((session) => liveChatChannels.includes(session.channel))
        .map((session) => {
          const summary = sessionSummariesById[session.id]

          return {
            ...session,
            ...(summary ?? {}),
            unreadCount: readLiveChatSessionIds.includes(session.id)
              ? 0
              : summary?.unreadCount ?? session.unreadCount,
          }
        }),
    [activeLiveChatSessionIds, readLiveChatSessionIds, sessionSummariesById],
  )

  const sessionRuntimeStates = useMemo(
    () =>
      Object.fromEntries(
        availableSessions.map((session) => {
          const timing = liveChatSessionTimings[session.id]
          const elapsedSeconds = timing
            ? getElapsedSeconds(timing.startedAt, now)
            : parseDurationSeconds(session.customer.accessDuration)

          return [
            session.id,
            {
              elapsedSeconds,
              isFlashing: timing ? timing.flashUntil > now : false,
              slaState: getLiveChatSlaState(elapsedSeconds),
            },
          ]
        }),
      ),
    [availableSessions, liveChatSessionTimings, now],
  )

  useEffect(() => {
    const focusedSession = liveChatSessions.find(
      (session) =>
        session.id === liveChatFocusSessionId &&
        activeLiveChatSessionIds.includes(session.id) &&
        liveChatChannels.includes(session.channel),
    )

    if (!liveChatFocusSessionId || !focusedSession) {
      return
    }

    const timer = window.setTimeout(() => {
      setSelectedChannels((currentChannels) =>
        currentChannels.includes(focusedSession.channel)
          ? currentChannels
          : liveChatChannels,
      )
      setActiveSessionId(liveChatFocusSessionId)
      markSessionAsRead(liveChatFocusSessionId)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [
    activeLiveChatSessionIds,
    liveChatFocusRequestId,
    liveChatFocusSessionId,
    markSessionAsRead,
  ])

  const filteredSessions = useMemo(
    () =>
      selectedChannels.length === 0
        ? []
        : availableSessions.filter((session) =>
            selectedChannels.includes(session.channel),
          ),
    [availableSessions, selectedChannels],
  )

  const activeSession = useMemo(
    () =>
      filteredSessions.find((session) => session.id === activeSessionId) ??
      (selectedChannels.length === 0
        ? availableSessions.find((session) => session.id === activeSessionId)
        : undefined) ??
      filteredSessions[0] ??
      (selectedChannels.length === 0 ? availableSessions[0] : undefined),
    [activeSessionId, availableSessions, filteredSessions, selectedChannels],
  )

  const handleActiveSessionChange = (sessionId: string) => {
    setActiveSessionId(sessionId)
    markSessionAsRead(sessionId)
  }

  const updateSelectedChannels = (nextSelectedChannels: LiveChatChannel[]) => {
    setSelectedChannels(nextSelectedChannels)

    const nextSessions =
      nextSelectedChannels.length === 0
        ? []
        : availableSessions.filter((session) =>
            nextSelectedChannels.includes(session.channel),
          )

    if (
      nextSessions.length > 0 &&
      !nextSessions.some((session) => session.id === activeSessionId)
    ) {
      handleActiveSessionChange(nextSessions[0].id)
    }
  }

  const handleChannelFilterChange = (nextChannel: 'all' | LiveChatChannel) => {
    if (nextChannel === 'all') {
      const isAllChannelsSelected = liveChatChannels.every((channel) =>
        selectedChannels.includes(channel),
      )

      updateSelectedChannels(isAllChannelsSelected ? [] : liveChatChannels)
      return
    }

    const nextSelectedChannels = selectedChannels.includes(nextChannel)
      ? selectedChannels.filter((channel) => channel !== nextChannel)
      : [...selectedChannels, nextChannel]

    updateSelectedChannels(nextSelectedChannels)
  }

  const handleEndService = (sessionId: string) => {
    const currentIndex = availableSessions.findIndex(
      (session) => session.id === sessionId,
    )
    const remainingSessions = availableSessions.filter(
      (session) => session.id !== sessionId,
    )
    const remainingSelectableSessions =
      selectedChannels.length === 0
        ? remainingSessions
        : remainingSessions.filter((session) =>
            selectedChannels.includes(session.channel),
          )
    const nextSession =
      remainingSelectableSessions[currentIndex] ??
      remainingSelectableSessions[currentIndex - 1] ??
      remainingSelectableSessions[0]

    closeLiveChatSession(sessionId)

    if (activeSessionId === sessionId) {
      if (nextSession) {
        handleActiveSessionChange(nextSession.id)
      } else {
        setActiveSessionId('')
      }
    }
  }

  const handleSendConversationMessage = (
    sessionId: string,
    message: string,
  ) => {
    const time = getCurrentMessageTime()
    const nextMessage: LiveChatConversationMessage = {
      id: `live-chat-message-${sessionId}-${Date.now()}`,
      isCurrentAgent: true,
      message,
      sender: 'agent',
      senderName: 'Nadia Putri',
      senderRole: 'Current Agent',
      time,
    }

    setConversationMessagesBySessionId((currentMessagesBySessionId) => ({
      ...currentMessagesBySessionId,
      [sessionId]: [
        ...(currentMessagesBySessionId[sessionId] ?? []),
        nextMessage,
      ],
    }))
    setSessionSummariesById((currentSummariesById) => ({
      ...currentSummariesById,
      [sessionId]: {
        lastMessage: message,
        lastMessageTime: time,
        unreadCount: 0,
      },
    }))
  }

  if (!activeSession) {
    return (
      <section
        aria-label="Live chat workspace"
        className={[
          'inbound-page',
          'inbound-page--live-chat',
          isCustomerListCollapsed
            ? 'inbound-page--live-chat-list-collapsed'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <LiveChatCustomerList
          activeSessionId=""
          collapsed={isCustomerListCollapsed}
          selectedChannels={selectedChannels}
          sessionRuntimeStates={sessionRuntimeStates}
          sessions={filteredSessions}
          onActiveSessionChange={handleActiveSessionChange}
          onChannelFilterChange={handleChannelFilterChange}
          onCollapsedChange={setIsCustomerListCollapsed}
        />
        <div className="live-chat-empty-workspace">
          <strong>No active conversation</strong>
          <span>
            New BankApp or WhatsApp customers will appear here after they
            enter the AICC queue.
          </span>
        </div>
      </section>
    )
  }

  return (
    <InteractionWorkspace
      ariaLabel="Live chat workspace"
      className={[
        'inbound-page--live-chat',
        isCustomerListCollapsed
          ? 'inbound-page--live-chat-list-collapsed'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      conversation={{
        elapsedSeconds:
          sessionRuntimeStates[activeSession.id]?.elapsedSeconds ??
          parseDurationSeconds(activeSession.customer.accessDuration),
        messages:
          conversationMessagesBySessionId[activeSession.id] ??
          activeSession.conversation,
        session: activeSession,
        slaState:
          sessionRuntimeStates[activeSession.id]?.slaState ?? 'normal',
        onEndService: handleEndService,
        onSendMessage: handleSendConversationMessage,
      }}
      customer={activeSession.customer}
      leadPanel={
        <LiveChatCustomerList
          activeSessionId={activeSession.id}
          collapsed={isCustomerListCollapsed}
          selectedChannels={selectedChannels}
          sessionRuntimeStates={sessionRuntimeStates}
          sessions={filteredSessions}
          onActiveSessionChange={handleActiveSessionChange}
          onChannelFilterChange={handleChannelFilterChange}
          onCollapsedChange={setIsCustomerListCollapsed}
        />
      }
    />
  )
}
