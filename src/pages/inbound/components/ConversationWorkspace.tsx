import { useEffect, useRef, useState } from 'react'
import {
  ClockCircleOutlined,
  CloseOutlined,
  GlobalOutlined,
  MobileOutlined,
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
  SwapOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { BaseButton, BaseModal } from '../../../components'
import { TransferModal } from '../../../layouts/components/TransferModal'
import type { LiveChatConversationMessage, LiveChatSession } from '../../../types'
import { formatDuration } from '../../../utils/duration'
import type { InteractionSlaState } from '../../../utils/duration'

export interface ConversationWorkspaceConfig {
  elapsedSeconds: number
  messages: LiveChatConversationMessage[]
  session: LiveChatSession
  slaState: InteractionSlaState
  onEndService: (sessionId: string) => void
  onSendMessage: (sessionId: string, message: string) => void
}

function getMessageDisplayType(message: LiveChatConversationMessage) {
  if (message.isCurrentAgent) {
    return 'current-agent'
  }

  if (message.sender === 'agent') {
    return 'previous-agent'
  }

  return 'customer'
}

function getMessageClassName(message: LiveChatConversationMessage) {
  const displayType = getMessageDisplayType(message)

  return [
    'live-chat-conversation__bubble',
    `live-chat-conversation__bubble--${displayType}`,
  ]
    .filter(Boolean)
    .join(' ')
}

function getMessageRowClassName(message: LiveChatConversationMessage) {
  const displayType = getMessageDisplayType(message)

  return [
    'live-chat-conversation__message',
    `live-chat-conversation__message--${displayType}`,
  ]
    .filter(Boolean)
    .join(' ')
}

function getMessageMainClassName(message: LiveChatConversationMessage) {
  const displayType = getMessageDisplayType(message)

  return [
    'live-chat-conversation__message-main',
    `live-chat-conversation__message-main--${displayType}`,
  ]
    .filter(Boolean)
    .join(' ')
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const channelLabels: Record<LiveChatSession['channel'], string> = {
  Haloapps: 'BankApp',
  Webchat: 'Webchat',
  WhatsApp: 'WhatsApp',
}

function getChannelIconClassName(channel: LiveChatSession['channel']) {
  if (channel === 'Haloapps') {
    return 'live-chat-channel-icon--bankapp'
  }

  return `live-chat-channel-icon--${channel.toLowerCase()}`
}

function renderChannelIcon(channel: LiveChatSession['channel']) {
  const label = channelLabels[channel]
  const icon =
    channel === 'WhatsApp' ? (
      <WhatsAppOutlined />
    ) : channel === 'Haloapps' ? (
      <MobileOutlined />
    ) : (
      <GlobalOutlined />
    )

  return (
    <span
      aria-label={label}
      className={[
        'live-chat-channel-icon',
        getChannelIconClassName(channel),
        'live-chat-channel-icon--customer',
        'live-chat-conversation__channel-icon',
      ].join(' ')}
      role="img"
      title={label}
    >
      {icon}
    </span>
  )
}

export function ConversationWorkspace({
  elapsedSeconds,
  messages,
  session,
  slaState,
  onEndService,
  onSendMessage,
}: ConversationWorkspaceConfig) {
  const [draftMessage, setDraftMessage] = useState('')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { profile } = session.customer
  const trimmedDraftMessage = draftMessage.trim()
  const elapsedTime = formatDuration(elapsedSeconds)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, session.id])

  const handleSendMessage = () => {
    if (!trimmedDraftMessage) {
      return
    }

    onSendMessage(session.id, trimmedDraftMessage)
    setDraftMessage('')
  }

  const handleConfirmEndService = () => {
    onEndService(session.id)
    setIsConfirmOpen(false)
  }

  const renderAvatar = (message: LiveChatConversationMessage) => {
    if (message.isCurrentAgent) {
      return null
    }

    const isCustomer = message.sender === 'customer'
    const avatarUrl = isCustomer ? profile.avatarUrl : ''
    const initials = isCustomer
      ? profile.avatarInitials
      : getInitials(message.senderName)

    return (
      <span
        aria-hidden="true"
        className={[
          'live-chat-conversation__avatar',
          isCustomer
            ? 'live-chat-conversation__avatar--customer'
            : 'live-chat-conversation__avatar--agent',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {avatarUrl ? <img alt="" src={avatarUrl} /> : initials}
      </span>
    )
  }

  const renderMessageMeta = (message: LiveChatConversationMessage) => {
    const displayType = getMessageDisplayType(message)

    if (displayType === 'previous-agent') {
      return (
        <div className="live-chat-conversation__meta live-chat-conversation__meta--previous-agent">
          <strong>{message.senderName}</strong>
          <time>{message.time}</time>
        </div>
      )
    }

    return (
      <div
        className={[
          'live-chat-conversation__meta',
          `live-chat-conversation__meta--${displayType}`,
        ].join(' ')}
      >
        <time>{message.time}</time>
      </div>
    )
  }

  return (
    <div className="live-chat-conversation">
      <header className="live-chat-conversation__header">
        <div className="live-chat-conversation__identity">
          {renderChannelIcon(session.channel)}
          <strong>{profile.name}</strong>
          <span
            className={[
              'live-chat-conversation__timer',
              slaState !== 'normal'
                ? `live-chat-conversation__timer--${slaState}`
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <ClockCircleOutlined />
            {elapsedTime}
          </span>
        </div>

        <div
          aria-label="Conversation actions"
          className="live-chat-conversation__header-actions"
          role="group"
        >
          <button
            title="Transfer"
            type="button"
            onClick={() => setIsTransferOpen(true)}
          >
            <SwapOutlined />
            Transfer
          </button>
          <button
            aria-label="End service"
            className="live-chat-conversation__end-action"
            title="End service"
            type="button"
            onClick={() => setIsConfirmOpen(true)}
          >
            <CloseOutlined />
          </button>
        </div>
      </header>

      <div
        aria-label={`${profile.name} conversation history`}
        className="live-chat-conversation__messages"
        role="log"
      >
        {messages.map((message) => (
          <article
            className={getMessageRowClassName(message)}
            key={message.id}
          >
            {message.sender === 'customer' && renderAvatar(message)}
            {getMessageDisplayType(message) === 'previous-agent' &&
              renderAvatar(message)}

            <div className={getMessageMainClassName(message)}>
              {renderMessageMeta(message)}
              <div className={getMessageClassName(message)}>
                <p>{message.message}</p>
              </div>
            </div>
          </article>
        ))}
        <div
          aria-hidden="true"
          className="live-chat-conversation__messages-end"
          ref={messagesEndRef}
        />
      </div>

      <footer className="live-chat-conversation__composer">
        <textarea
          aria-label={`Message ${profile.name}`}
          placeholder="Type message to customer"
          value={draftMessage}
          onChange={(event) => setDraftMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSendMessage()
            }
          }}
        />

        <div className="live-chat-conversation__composer-toolbar">
          <div
            aria-label="Message attachments"
            className="live-chat-conversation__composer-tools"
            role="group"
          >
            <button aria-label="Choose emoji" title="Emoji" type="button">
              <SmileOutlined />
            </button>
            <button aria-label="Attach file" title="File" type="button">
              <PaperClipOutlined />
            </button>
          </div>

          <div
            aria-label="Message actions"
            className="live-chat-conversation__actions"
            role="group"
          >
            <BaseButton
              icon={<SendOutlined />}
              size="small"
              type="primary"
              variant="primary"
              onClick={handleSendMessage}
            >
              Send
            </BaseButton>
          </div>
        </div>
      </footer>

      <BaseModal
        centered
        destroyOnHidden
        kind="standard"
        open={isConfirmOpen}
        title="End service?"
        width={420}
        onCancel={() => setIsConfirmOpen(false)}
      >
        <p className="live-chat-conversation__confirm-text">
          Are you sure you want to end service for {profile.name}?
        </p>
        <footer className="aicc-modal-footer live-chat-conversation__confirm-footer">
          <BaseButton
            size="small"
            variant="secondary"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </BaseButton>
          <BaseButton
            danger
            size="small"
            type="primary"
            variant="danger"
            onClick={handleConfirmEndService}
          >
            Confirm
          </BaseButton>
        </footer>
      </BaseModal>

      <TransferModal
        open={isTransferOpen}
        variant="conversation"
        onClose={() => setIsTransferOpen(false)}
      />
    </div>
  )
}
