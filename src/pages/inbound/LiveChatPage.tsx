import { useMemo, useState } from 'react'
import { liveChatSessions } from '../../mock/inbound'
import { LiveChatCustomerList } from './components/LiveChatCustomerList'
import { InteractionWorkspace } from './InteractionWorkspace'

export function LiveChatPage() {
  const [activeSessionId, setActiveSessionId] = useState(
    liveChatSessions[0]?.id ?? '',
  )
  const [isCustomerListCollapsed, setIsCustomerListCollapsed] =
    useState(false)
  const activeSession = useMemo(
    () =>
      liveChatSessions.find((session) => session.id === activeSessionId) ??
      liveChatSessions[0],
    [activeSessionId],
  )

  if (!activeSession) {
    return null
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
      customer={activeSession.customer}
      leadPanel={
        <LiveChatCustomerList
          activeSessionId={activeSession.id}
          collapsed={isCustomerListCollapsed}
          sessions={liveChatSessions}
          onActiveSessionChange={setActiveSessionId}
          onCollapsedChange={setIsCustomerListCollapsed}
        />
      }
    />
  )
}
