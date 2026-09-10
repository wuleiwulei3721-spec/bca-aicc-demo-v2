import { useMemo, useState } from 'react'
import { Badge, Input } from 'antd'
import { AgentAvatar, AppButton, BaseModal, SearchInput } from '../../components'
import { internalChatSessions } from '../../mock/chat'
import type { InternalChatSession } from '../../types'
import { formatAgentDisplay } from '../../utils/agentDisplay'

const { TextArea } = Input

interface InternalChatModalProps {
  open: boolean
  onClose: () => void
}

export function InternalChatModal({ open, onClose }: InternalChatModalProps) {
  const sortedSessions = useMemo(
    () =>
      [...internalChatSessions].sort(
        (first, second) =>
          second.latestMessageTimestamp - first.latestMessageTimestamp,
      ),
    [],
  )
  const [keyword, setKeyword] = useState('')
  const [activeSessionId, setActiveSessionId] = useState(sortedSessions[0]?.id)
  const [message, setMessage] = useState('')

  const filteredSessions = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return sortedSessions
    }

    return sortedSessions.filter((session) =>
      [session.agentName, session.employeeId].some((value) =>
        value.toLowerCase().includes(normalizedKeyword),
      ),
    )
  }, [keyword, sortedSessions])

  const activeSession =
    sortedSessions.find((session) => session.id === activeSessionId) ??
    sortedSessions[0]

  const renderSession = (session: InternalChatSession) => {
    const isActive = session.id === activeSession.id

    return (
      <button
        key={session.id}
        className={[
          'aicc-internal-chat__session',
          isActive ? 'aicc-internal-chat__session--active' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        type="button"
        onClick={() => setActiveSessionId(session.id)}
      >
        <Badge count={session.unreadCount} size="small">
          <AgentAvatar name={session.agentName} size={32} />
        </Badge>
        <span className="aicc-internal-chat__session-main">
          <span>
            <strong>{formatAgentDisplay(session.employeeId, session.agentName)}</strong>
            <em>{session.latestMessageTime}</em>
          </span>
          <small>{session.latestMessage}</small>
        </span>
      </button>
    )
  }

  return (
    <BaseModal
      className="aicc-internal-chat-modal"
      kind="internal-chat"
      open={open}
      title="Internal Chat"
      width={880}
      onCancel={onClose}
    >
      <div className="aicc-modal-section aicc-modal-section--flush aicc-internal-chat">
        <aside className="aicc-internal-chat__list">
          <header className="aicc-internal-chat__list-header">
            <span className="aicc-modal-section__title">Agent Sessions</span>
            <span className="aicc-modal-section__meta">
              {filteredSessions.length} active
            </span>
          </header>
          <div className="aicc-internal-chat__search">
            <SearchInput
              placeholder="Search name or employee ID"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
          <div className="aicc-internal-chat__sessions">
            {filteredSessions.map(renderSession)}
          </div>
        </aside>

        <section className="aicc-internal-chat__conversation">
          <header className="aicc-internal-chat__conversation-header">
            <AgentAvatar name={activeSession.agentName} size={34} />
            <span>
              <strong>
                {formatAgentDisplay(
                  activeSession.employeeId,
                  activeSession.agentName,
                )}
              </strong>
              <em>{activeSession.department}</em>
            </span>
          </header>

          <div className="aicc-internal-chat__messages">
            {activeSession.messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={[
                  'aicc-internal-chat__message',
                  chatMessage.sender === 'self'
                    ? 'aicc-internal-chat__message--self'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{chatMessage.content}</span>
                <em>{chatMessage.time}</em>
              </div>
            ))}
          </div>

          <footer className="aicc-internal-chat__composer">
            <div className="aicc-internal-chat__composer-box">
              <TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                placeholder="Type internal message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <AppButton type="primary">Send</AppButton>
            </div>
          </footer>
        </section>
      </div>
    </BaseModal>
  )
}
