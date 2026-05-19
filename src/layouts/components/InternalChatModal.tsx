import { useMemo, useState } from 'react'
import {
  FileImageOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Input, Modal } from 'antd'
import { AppButton } from '../../components'
import { internalChatSessions } from '../../mock/chat'
import type { InternalChatSession } from '../../types'

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
          <Avatar src={session.avatarUrl}>{session.agentName.slice(0, 1)}</Avatar>
        </Badge>
        <span className="aicc-internal-chat__session-main">
          <span>
            <strong>{session.agentName}</strong>
            <em>{session.latestMessageTime}</em>
          </span>
          <small>{session.latestMessage}</small>
        </span>
      </button>
    )
  }

  return (
    <Modal
      className="aicc-internal-chat-modal"
      footer={null}
      open={open}
      title="Internal Chat"
      width={880}
      onCancel={onClose}
    >
      <div className="aicc-internal-chat">
        <aside className="aicc-internal-chat__list">
          <div className="aicc-internal-chat__search">
            <Input
              allowClear
              prefix={<SearchOutlined />}
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
            <Avatar size={34} src={activeSession.avatarUrl}>
              {activeSession.agentName.slice(0, 1)}
            </Avatar>
            <span>
              <strong>{activeSession.agentName}</strong>
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
            <button aria-label="Emoji" type="button">
              <SmileOutlined />
            </button>
            <button aria-label="Upload image" type="button">
              <FileImageOutlined />
            </button>
            <Input
              placeholder="Type internal message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <AppButton icon={<SendOutlined />} type="primary">
              Send
            </AppButton>
          </footer>
        </section>
      </div>
    </Modal>
  )
}
