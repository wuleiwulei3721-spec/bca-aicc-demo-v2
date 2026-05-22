import { useMemo, useState } from 'react'
import { liveChatSessions } from '../../mock/inbound'
import type { LiveChatConversationMessage, LiveChatSession } from '../../types'
import { LiveChatCustomerList } from './components/LiveChatCustomerList'
import { InteractionWorkspace } from './InteractionWorkspace'

type LiveChatChannel = LiveChatSession['channel']
type LiveChatSessionSummary = Pick<
  LiveChatSession,
  'lastMessage' | 'lastMessageTime' | 'unreadCount'
>

const liveChatChannels: LiveChatChannel[] = [
  'WhatsApp',
  'Haloapps',
  'Webchat',
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
  const [activeSessionId, setActiveSessionId] = useState(
    liveChatSessions[0]?.id ?? '',
  )
  const [openSessionIds, setOpenSessionIds] = useState(() =>
    liveChatSessions.map((session) => session.id),
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

  const availableSessions = useMemo(
    () =>
      liveChatSessions
        .filter((session) => openSessionIds.includes(session.id))
        .map((session) => ({
          ...session,
          ...(sessionSummariesById[session.id] ?? {}),
        })),
    [openSessionIds, sessionSummariesById],
  )

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
      setActiveSessionId(nextSessions[0].id)
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

    setOpenSessionIds((currentSessionIds) =>
      currentSessionIds.filter((id) => id !== sessionId),
    )

    if (activeSessionId === sessionId) {
      setActiveSessionId(nextSession?.id ?? '')
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
          sessions={filteredSessions}
          onActiveSessionChange={setActiveSessionId}
          onChannelFilterChange={handleChannelFilterChange}
          onCollapsedChange={setIsCustomerListCollapsed}
        />
        <div className="live-chat-empty-workspace">
          <strong>No active conversation</strong>
          <span>All selected live chat customers have been closed.</span>
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
        messages:
          conversationMessagesBySessionId[activeSession.id] ??
          activeSession.conversation,
        session: activeSession,
        onEndService: handleEndService,
        onSendMessage: handleSendConversationMessage,
      }}
      customer={activeSession.customer}
      leadPanel={
        <LiveChatCustomerList
          activeSessionId={activeSession.id}
          collapsed={isCustomerListCollapsed}
          selectedChannels={selectedChannels}
          sessions={filteredSessions}
          onActiveSessionChange={setActiveSessionId}
          onChannelFilterChange={handleChannelFilterChange}
          onCollapsedChange={setIsCustomerListCollapsed}
        />
      }
    />
  )
}
