import { useRef, useState } from 'react'
import {
  CalendarOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Input, Select } from 'antd'
import { BaseButton, BaseModal } from '../../../components'
import { TransferModal } from '../../../layouts/components/TransferModal'
import type { LiveChat2Message } from '../../../types'
import { formatDuration } from '../../../utils/duration'
import type { LiveChat2SessionView } from './LiveChat2CustomerPanel'

interface LiveChat2ConversationWorkspaceProps {
  draftMessage: string
  messages: LiveChat2Message[]
  recalledMessageIds: string[]
  session: LiveChat2SessionView
  onCloseSession: (sessionId: string) => void
  onDraftChange: (sessionId: string, message: string) => void
  onEndSession: (sessionId: string, baseMessages: LiveChat2Message[]) => void
  onRecallMessage: (messageId: string) => void
  onSendMessage: (
    sessionId: string,
    message: string,
    baseMessages: LiveChat2Message[],
  ) => void
}

const quickReplies = [
  {
    code: 'aa',
    source: 'My phrases',
    text: 'Thank you for waiting. I am checking the latest record now.',
  },
  {
    code: 'ab',
    source: 'Public phrases',
    text: 'Please provide your registered mobile number for verification.',
  },
  {
    code: 'ac',
    source: 'My phrases',
    text: 'I have submitted the request. Please wait for confirmation.',
  },
  {
    code: 'ad',
    source: 'Public phrases',
    text: 'For your security, please do not share OTP or PIN in this chat.',
  },
  {
    code: 'ae',
    source: 'My phrases',
    text: 'The ticket has been created and will be followed up by the related team.',
  },
  {
    code: 'af',
    source: 'Public phrases',
    text: 'Is there anything else I can help you with today?',
  },
]

function getMessageDisplayType(message: LiveChat2Message) {
  if (message.sender === 'system') {
    return 'system'
  }

  if (message.isCurrentAgent) {
    return 'current-agent'
  }

  if (message.sender === 'agent' || message.sender === 'bot') {
    return 'previous-agent'
  }

  return 'customer'
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

function highlightSearch(value: string, search: string) {
  const normalizedSearch = search.trim()

  if (!normalizedSearch) {
    return value
  }

  const index = value.toLowerCase().indexOf(normalizedSearch.toLowerCase())

  if (index < 0) {
    return value
  }

  return (
    <>
      {value.slice(0, index)}
      <mark>{value.slice(index, index + normalizedSearch.length)}</mark>
      {value.slice(index + normalizedSearch.length)}
    </>
  )
}

function renderMessageContent(
  message: LiveChat2Message,
  isRecalled: boolean,
  search = '',
) {
  if (isRecalled) {
    return <p className="livechat2-message__recalled">Message recalled</p>
  }

  if (message.kind === 'image') {
    return (
      <div className="livechat2-message__attachment">
        <FileImageOutlined />
        <span>{message.message}</span>
      </div>
    )
  }

  if (message.kind === 'file') {
    return (
      <div className="livechat2-message__attachment">
        <PaperClipOutlined />
        <span>{message.fileName ?? message.message}</span>
      </div>
    )
  }

  return <p>{highlightSearch(message.message, search)}</p>
}

export function LiveChat2ConversationWorkspace({
  draftMessage,
  messages,
  recalledMessageIds,
  session,
  onCloseSession,
  onDraftChange,
  onEndSession,
  onRecallMessage,
  onSendMessage,
}: LiveChat2ConversationWorkspaceProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRecordOpen, setIsRecordOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [loadCount, setLoadCount] = useState(0)
  const [quoteMessage, setQuoteMessage] = useState<string | null>(null)
  const [recordSearch, setRecordSearch] = useState('')
  const [recordScope, setRecordScope] = useState('all')
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const readOnly = session.statusDisplay === 'history'
  const isEnded = session.statusDisplay === 'ended'
  const canCompose = !readOnly && !isEnded
  const trimmedDraft = draftMessage.trim()
  const visibleHistory = session.historyMessages.slice(
    Math.max(0, session.historyMessages.length - loadCount * 20),
  )
  const visibleMessages = [...visibleHistory, ...messages]
  const recordMessages = [...session.historyMessages, ...messages]
  const matchedRecordMessages = recordSearch.trim()
    ? recordMessages.filter((message) =>
        message.message.toLowerCase().includes(recordSearch.trim().toLowerCase()),
      )
    : recordMessages
  const quickReplyKeyword = draftMessage.startsWith('/')
    ? draftMessage.slice(1).trim().toLowerCase()
    : ''
  const filteredQuickReplies = draftMessage.startsWith('/')
    ? quickReplies
        .filter((reply) =>
          [reply.code, reply.text].some((value) =>
            value.toLowerCase().includes(quickReplyKeyword),
          ),
        )
        .slice(0, 10)
    : []

  const handleSend = () => {
    if (!trimmedDraft || !canCompose) {
      return
    }

    const message = quoteMessage
      ? `Replying to "${quoteMessage}": ${trimmedDraft}`
      : trimmedDraft

    onSendMessage(session.id, message, messages)
    setQuoteMessage(null)
  }

  const handleQuickReplySelect = (reply: (typeof quickReplies)[number]) => {
    onDraftChange(session.id, reply.text)
    window.setTimeout(() => composerRef.current?.focus(), 0)
  }

  return (
    <div
      className={[
        'livechat2-conversation',
        isRecordOpen ? 'livechat2-conversation--record-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="livechat2-conversation__header">
        <div className="livechat2-conversation__identity">
          <strong>{session.customer.profile.name}</strong>
          <span>{session.intent}</span>
          <span className="livechat2-conversation__duration">
            <ClockCircleOutlined />
            {formatDuration(session.elapsedSeconds)}
          </span>
          {session.unansweredSeconds !== null && !isEnded && (
            <span
              className={[
                'livechat2-conversation__unanswered',
                session.slaState !== 'normal'
                  ? `livechat2-conversation__unanswered--${session.slaState}`
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Unanswered {formatDuration(session.unansweredSeconds)}
            </span>
          )}
        </div>

        {!readOnly && (
          <div className="livechat2-conversation__actions" role="group">
            {!isEnded && (
              <button
                title="Transfer"
                type="button"
                onClick={() => setIsTransferOpen(true)}
              >
                <SwapOutlined />
                Transfer
              </button>
            )}
            <button
              className="livechat2-conversation__record-action"
              title="Message record"
              type="button"
              onClick={() => setIsRecordOpen((current) => !current)}
            >
              <HistoryOutlined />
              Message Record
            </button>
            {isEnded ? (
              <button
                className="livechat2-conversation__end-action"
                title="Close"
                type="button"
                onClick={() => onCloseSession(session.id)}
              >
                <CloseOutlined />
                Close
              </button>
            ) : (
              <button
                className="livechat2-conversation__end-action"
                title="End service"
                type="button"
                onClick={() => setIsConfirmOpen(true)}
              >
                <CloseOutlined />
              </button>
            )}
          </div>
        )}
      </header>

      <div className="livechat2-conversation__body">
        <section className="livechat2-conversation__messages" role="log">
          {loadCount < 3 ? (
            <button
              className="livechat2-conversation__load-more"
              type="button"
              onClick={() => setLoadCount((current) => current + 1)}
            >
              Click to load more
            </button>
          ) : (
            <span className="livechat2-conversation__load-end">
              No more records. Open Message Record for full history.
            </span>
          )}

          {visibleMessages.map((message) => {
            const displayType = getMessageDisplayType(message)
            const isRecalled = recalledMessageIds.includes(message.id)

            return (
              <article
                className={[
                  'livechat2-message',
                  `livechat2-message--${displayType}`,
                ].join(' ')}
                key={message.id}
              >
                {displayType !== 'system' && displayType !== 'current-agent' && (
                  <span className="livechat2-message__avatar">
                    {displayType === 'customer'
                      ? session.customer.profile.avatarInitials
                      : getInitials(message.senderName)}
                  </span>
                )}
                <div className="livechat2-message__main">
                  <div className="livechat2-message__meta">
                    {displayType === 'previous-agent' && (
                      <strong>{message.senderName}</strong>
                    )}
                    <time>{message.time}</time>
                  </div>
                  {message.quotedMessage && (
                    <div className="livechat2-message__quote">
                      {message.quotedMessage}
                    </div>
                  )}
                  <div className="livechat2-message__bubble">
                    {renderMessageContent(message, isRecalled)}
                  </div>
                  {displayType !== 'system' && (
                    <div className="livechat2-message__tools">
                      <button
                        type="button"
                        onClick={() => setQuoteMessage(message.message)}
                      >
                        <RollbackOutlined />
                        Quote
                      </button>
                      {message.isCurrentAgent && !isRecalled && (
                        <button
                          type="button"
                          onClick={() => onRecallMessage(message.id)}
                        >
                          <ReloadOutlined />
                          Recall
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>

        {isRecordOpen && (
          <aside
            className="livechat2-records"
            aria-label={`${session.customer.profile.name} message record`}
          >
            <header className="livechat2-records__header">
              <strong>Message Record</strong>
              <button
                aria-label="Close message record"
                type="button"
                onClick={() => setIsRecordOpen(false)}
              >
                <CloseOutlined />
              </button>
            </header>
            <div className="livechat2-records__search">
              <Select
                aria-label="Message record scope"
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Last month', value: 'month' },
                  { label: 'Last 3 months', value: 'quarter' },
                  { label: 'Last year', value: 'year' },
                ]}
                size="small"
                value={recordScope}
                onChange={setRecordScope}
              />
              <Input
                allowClear
                aria-label="Search message record"
                placeholder="Search messages"
                prefix={<SearchOutlined />}
                size="small"
                value={recordSearch}
                onChange={(event) => setRecordSearch(event.target.value)}
              />
              <span>
                {recordSearch
                  ? `${matchedRecordMessages.length} records found`
                  : `${recordMessages.length} records`}
              </span>
            </div>
            <div className="livechat2-records__date">
              <CalendarOutlined />
              <span>2026-05-27</span>
            </div>
            <div className="livechat2-records__list">
              {matchedRecordMessages.map((message) => (
                <article key={`record-${message.id}`}>
                  <time>
                    {message.timestamp.slice(0, 10)} {message.time}
                  </time>
                  <strong>{message.senderName}</strong>
                  <p>{highlightSearch(message.message, recordSearch)}</p>
                </article>
              ))}
            </div>
          </aside>
        )}
      </div>

      {canCompose && (
        <footer className="livechat2-composer">
          {quoteMessage && (
            <div className="livechat2-composer__quote">
              <span>{quoteMessage}</span>
              <button
                aria-label="Remove quote"
                type="button"
                onClick={() => setQuoteMessage(null)}
              >
                <CloseOutlined />
              </button>
            </div>
          )}
          <textarea
            aria-label={`Message ${session.customer.profile.name}`}
            placeholder="Type / for quick replies"
            ref={composerRef}
            value={draftMessage}
            onChange={(event) => onDraftChange(session.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
          />
          {filteredQuickReplies.length > 0 && (
            <div className="livechat2-quick-replies">
              {filteredQuickReplies.map((reply) => (
                <button
                  key={reply.code}
                  type="button"
                  onClick={() => handleQuickReplySelect(reply)}
                >
                  <strong>{reply.code}</strong>
                  <span>{reply.text}</span>
                  <em>{reply.source}</em>
                </button>
              ))}
            </div>
          )}
          <div className="livechat2-composer__toolbar">
            <div className="livechat2-composer__tools">
              <button title="Emoji" type="button">
                <SmileOutlined />
              </button>
              <button title="Image" type="button">
                <FileImageOutlined />
              </button>
              <button title="File" type="button">
                <FolderOpenOutlined />
              </button>
              <button
                title="Message record"
                type="button"
                onClick={() => setIsRecordOpen((current) => !current)}
              >
                <HistoryOutlined />
              </button>
            </div>
            <BaseButton
              icon={<SendOutlined />}
              size="small"
              type="primary"
              variant="primary"
              onClick={handleSend}
            >
              Send
            </BaseButton>
          </div>
        </footer>
      )}

      {readOnly && (
        <footer className="livechat2-readonly-footer">
          Service duration {formatDuration(session.elapsedSeconds)}
        </footer>
      )}

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
          Are you sure you want to end service for{' '}
          {session.customer.profile.name}?
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
            onClick={() => {
              onEndSession(session.id, messages)
              setIsConfirmOpen(false)
            }}
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
