import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  AimOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  HistoryOutlined,
  MobileOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  SwapOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { DatePicker, Input } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { BaseButton, BaseModal } from '../../../components'
import { TransferModal } from '../../../layouts/components/TransferModal'
import type { LiveChat2Message } from '../../../types'
import { formatDuration } from '../../../utils/duration'
import type { LiveChat2SessionView } from './LiveChat2CustomerPanel'
import {
  getLiveChat2VisibleMessages,
  type LiveChat2MessageLocateRequest,
} from './liveChat2MessageUtils'
import type { LiveChat2QuickReplyOption } from './liveChat2QuickReplies'

const { RangePicker } = DatePicker

interface LiveChat2ConversationWorkspaceProps {
  composerFocusRequest: LiveChat2ComposerFocusRequest | null
  draftMessage: string
  isMessageRecordOpen: boolean
  messageLocateRequest: LiveChat2MessageLocateRequest | null
  messages: LiveChat2Message[]
  quickReplies: LiveChat2QuickReplyOption[]
  recalledMessageIds: string[]
  session: LiveChat2SessionView
  onCloseSession: (sessionId: string) => void
  onDraftChange: (sessionId: string, message: string) => void
  onEndSession: (sessionId: string, baseMessages: LiveChat2Message[]) => void
  onOpenMessageRecord: () => void
  onRecallMessage: (messageId: string) => void
  onSendMessage: (
    sessionId: string,
    message: string,
    baseMessages: LiveChat2Message[],
    quotedMessage?: string | null,
  ) => void
}

interface LiveChat2ComposerFocusRequest {
  caretPosition: number
  requestId: number
  sessionId: string
}

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

function getChannelLabel(channel: LiveChat2SessionView['channel']) {
  if (channel === 'Haloapps') {
    return 'BankApp'
  }

  return channel
}

function getChannelIcon(channel: LiveChat2SessionView['channel']) {
  if (channel === 'WhatsApp') {
    return <WhatsAppOutlined />
  }

  if (channel === 'Haloapps') {
    return <MobileOutlined />
  }

  return <GlobalOutlined />
}

function getChannelClassName(channel: LiveChat2SessionView['channel']) {
  if (channel === 'Haloapps') {
    return 'livechat2-channel-avatar--bankapp'
  }

  return `livechat2-channel-avatar--${channel.toLowerCase()}`
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

interface LiveChat2MessageRecordPanelProps {
  messages: LiveChat2Message[]
  onLocateMessage: (messageId: string) => void
}

type MessageRecordDateRange = [Dayjs, Dayjs]

interface MessageRecordFilters {
  dateRange: MessageRecordDateRange
  keyword: string
}

function getDefaultRecordDateRange(): MessageRecordDateRange {
  const today = dayjs()

  return [today.subtract(6, 'day'), today]
}

function getDefaultRecordFilters(): MessageRecordFilters {
  return {
    dateRange: getDefaultRecordDateRange(),
    keyword: '',
  }
}

function getDateBoundary(dateValue: Dayjs, type: 'end' | 'start') {
  return type === 'start'
    ? dateValue.startOf('day').valueOf()
    : dateValue.endOf('day').valueOf()
}

function getMessageTime(message: LiveChat2Message) {
  const time = new Date(message.timestamp).getTime()

  return Number.isFinite(time) ? time : 0
}

export function LiveChat2MessageRecordPanel({
  messages,
  onLocateMessage,
}: LiveChat2MessageRecordPanelProps) {
  const [draftFilters, setDraftFilters] = useState<MessageRecordFilters>(() =>
    getDefaultRecordFilters(),
  )
  const [appliedFilters, setAppliedFilters] = useState<MessageRecordFilters>(
    () => getDefaultRecordFilters(),
  )
  const [isSearchResultMode, setIsSearchResultMode] = useState(false)
  const appliedKeyword = appliedFilters.keyword.trim()
  const matchedRecordMessages = useMemo(() => {
    const fromTime = getDateBoundary(appliedFilters.dateRange[0], 'start')
    const toTime = getDateBoundary(appliedFilters.dateRange[1], 'end')
    const normalizedKeyword = appliedKeyword.toLowerCase()

    return messages
      .filter((message) => {
        const messageTime = getMessageTime(message)
        const isInDateRange = messageTime >= fromTime && messageTime <= toTime
        const isKeywordMatch = normalizedKeyword
          ? message.message.toLowerCase().includes(normalizedKeyword)
          : true

        return isInDateRange && isKeywordMatch
      })
      .sort((first, second) => getMessageTime(second) - getMessageTime(first))
  }, [
    appliedFilters.dateRange,
    appliedKeyword,
    messages,
  ])
  const handleSearch = () => {
    setIsSearchResultMode(true)
    setAppliedFilters({
      dateRange: [draftFilters.dateRange[0], draftFilters.dateRange[1]],
      keyword: draftFilters.keyword.trim(),
    })
  }
  const handleLocateMessage = (messageId: string) => {
    const nextFilters = getDefaultRecordFilters()
    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
    setIsSearchResultMode(false)
    onLocateMessage(messageId)
  }

  return (
    <aside
      aria-label="Message record"
      className="livechat2-records livechat2-records--right-tab"
    >
      <form
        className="livechat2-records__search"
        onSubmit={(event) => {
          event.preventDefault()
          handleSearch()
        }}
      >
        <RangePicker
          allowClear={false}
          className="livechat2-records__range-picker"
          format="MM-DD"
          inputReadOnly
          size="small"
          value={draftFilters.dateRange}
          onChange={(dates) => {
            if (!dates?.[0] || !dates?.[1]) {
              return
            }

            setDraftFilters((current) => ({
              ...current,
              dateRange: [dates[0], dates[1]],
            }))
          }}
        />
        <Input
          allowClear
          aria-label="Search message record"
          placeholder="Search messages"
          prefix={<SearchOutlined />}
          size="small"
          value={draftFilters.keyword}
          onChange={(event) =>
            setDraftFilters((current) => ({
              ...current,
              keyword: event.target.value,
            }))
          }
        />
        <BaseButton htmlType="submit" size="small" type="primary" variant="primary">
          Search
        </BaseButton>
        <span
          className="livechat2-records__result-count"
          title={`${matchedRecordMessages.length} records found`}
        >
          {matchedRecordMessages.length}
        </span>
      </form>
      <div className="livechat2-records__list">
        {matchedRecordMessages.length > 0 ? (
          matchedRecordMessages.map((message) => (
            <article key={`record-${message.id}`} tabIndex={0}>
              <div className="livechat2-records__item-head">
                <strong>{message.senderName}</strong>
                <time>
                  {message.timestamp.slice(0, 10)} {message.time}
                </time>
              </div>
              <p>{highlightSearch(message.message, appliedKeyword)}</p>
              {isSearchResultMode && (
                <button
                  className="livechat2-records__locate"
                  type="button"
                  onClick={() => handleLocateMessage(message.id)}
                >
                  <AimOutlined />
                  Locate
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="livechat2-records__empty">No records found</div>
        )}
      </div>
    </aside>
  )
}

export function LiveChat2ConversationWorkspace({
  composerFocusRequest,
  draftMessage,
  isMessageRecordOpen,
  messageLocateRequest,
  messages,
  quickReplies,
  recalledMessageIds,
  session,
  onCloseSession,
  onDraftChange,
  onEndSession,
  onOpenMessageRecord,
  onRecallMessage,
  onSendMessage,
}: LiveChat2ConversationWorkspaceProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [quoteMessage, setQuoteMessage] = useState<string | null>(null)
  const [quickReplySelection, setQuickReplySelection] = useState({
    index: 0,
    listKey: '',
  })
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const messageNodeRefs = useRef<Record<string, HTMLElement | null>>({})
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(
    null,
  )
  const readOnly = session.statusDisplay === 'history'
  const isEnded = session.statusDisplay === 'ended'
  const canCompose = !readOnly && !isEnded
  const trimmedDraft = draftMessage.trim()
  const visibleMessages = getLiveChat2VisibleMessages(
    session.historyMessages,
    messages,
  )
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
  const quickReplyListKey = filteredQuickReplies
    .map((reply) => reply.id)
    .join('|')
  const selectedQuickReplyIndex =
    filteredQuickReplies.length > 0 &&
    quickReplySelection.listKey === quickReplyListKey
      ? Math.min(quickReplySelection.index, filteredQuickReplies.length - 1)
      : 0

  useEffect(() => {
    if (!messageLocateRequest) {
      return undefined
    }

    const targetNode = messageNodeRefs.current[messageLocateRequest.messageId]

    if (!targetNode) {
      return undefined
    }

    targetNode.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    setHighlightedMessageId(messageLocateRequest.messageId)

    const timeoutId = window.setTimeout(() => {
      setHighlightedMessageId((currentMessageId) =>
        currentMessageId === messageLocateRequest.messageId
          ? null
          : currentMessageId,
      )
    }, 1800)

    return () => window.clearTimeout(timeoutId)
  }, [messageLocateRequest])

  useEffect(() => {
    if (
      !composerFocusRequest ||
      composerFocusRequest.sessionId !== session.id ||
      !canCompose
    ) {
      return
    }

    const caretPosition = Math.min(
      composerFocusRequest.caretPosition,
      draftMessage.length,
    )

    composerRef.current?.focus()
    composerRef.current?.setSelectionRange(caretPosition, caretPosition)
  }, [
    canCompose,
    composerFocusRequest,
    draftMessage.length,
    session.id,
  ])

  const handleSend = () => {
    if (!trimmedDraft || !canCompose) {
      return
    }

    onSendMessage(session.id, trimmedDraft, messages, quoteMessage)
    setQuoteMessage(null)
  }

  const handleQuickReplySelect = (reply: LiveChat2QuickReplyOption) => {
    onDraftChange(session.id, reply.text)
    window.setTimeout(() => {
      composerRef.current?.focus()
      composerRef.current?.setSelectionRange(reply.text.length, reply.text.length)
    }, 0)
  }

  const handleComposerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (filteredQuickReplies.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setQuickReplySelection((currentSelection) => {
          const currentIndex =
            currentSelection.listKey === quickReplyListKey
              ? currentSelection.index
              : selectedQuickReplyIndex

          return {
            index: (currentIndex + 1) % filteredQuickReplies.length,
            listKey: quickReplyListKey,
          }
        })
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setQuickReplySelection((currentSelection) => {
          const currentIndex =
            currentSelection.listKey === quickReplyListKey
              ? currentSelection.index
              : selectedQuickReplyIndex

          return {
            index:
              (currentIndex - 1 + filteredQuickReplies.length) %
              filteredQuickReplies.length,
            listKey: quickReplyListKey,
          }
        })
        return
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleQuickReplySelect(
          filteredQuickReplies[selectedQuickReplyIndex] ??
            filteredQuickReplies[0],
        )
        return
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleReEditMessage = (message: LiveChat2Message) => {
    setQuoteMessage(null)
    onDraftChange(session.id, message.message)
    window.setTimeout(() => composerRef.current?.focus(), 0)
  }

  return (
    <div
      className={[
        'livechat2-conversation',
        isEnded ? 'livechat2-conversation--ended' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="livechat2-conversation__header">
        <div className="livechat2-conversation__identity">
          <span
            aria-label={getChannelLabel(session.channel)}
            className={[
              'livechat2-channel-avatar',
              'livechat2-conversation__channel-icon',
              getChannelClassName(session.channel),
            ].join(' ')}
            role="img"
            title={getChannelLabel(session.channel)}
          >
            {getChannelIcon(session.channel)}
          </span>
          <strong>{session.customer.profile.name}</strong>
          <span className="livechat2-conversation__duration">
            <ClockCircleOutlined />
            {formatDuration(session.elapsedSeconds)}
          </span>
          {session.unansweredSeconds !== null && !isEnded && (
            <span
              aria-label={`Unanswered ${formatDuration(session.unansweredSeconds)}`}
              className={[
                'livechat2-conversation__unanswered',
                session.slaState !== 'normal'
                  ? `livechat2-conversation__unanswered--${session.slaState}`
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title={`Unanswered ${formatDuration(session.unansweredSeconds)}`}
            >
              <ExclamationCircleOutlined />
              {formatDuration(session.unansweredSeconds)}
            </span>
          )}
        </div>

        {!readOnly && (
          <div className="livechat2-conversation__actions" role="group">
            {isEnded ? (
              <button
                className="livechat2-conversation__close-action"
                title="Close"
                type="button"
                onClick={() => onCloseSession(session.id)}
              >
                <CloseOutlined />
                Close
              </button>
            ) : (
              <>
                <button
                  title="Transfer"
                  type="button"
                  onClick={() => setIsTransferOpen(true)}
                >
                  <SwapOutlined />
                  Transfer
                </button>
                <button
                  className="livechat2-conversation__end-action"
                  title="End service"
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <CloseOutlined />
                  End Service
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <div className="livechat2-conversation__body">
        <section className="livechat2-conversation__messages" role="log">
          {visibleMessages.map((message) => {
            const displayType = getMessageDisplayType(message)
            const isRecalled = recalledMessageIds.includes(message.id)

            return (
              <article
                className={[
                  'livechat2-message',
                  `livechat2-message--${displayType}`,
                  highlightedMessageId === message.id
                    ? 'livechat2-message--located'
                    : '',
                ].join(' ')}
                data-livechat2-message-id={message.id}
                key={message.id}
                ref={(node) => {
                  messageNodeRefs.current[message.id] = node
                }}
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
                      {!isRecalled && (
                        <>
                          <button
                            type="button"
                            onClick={() => setQuoteMessage(message.message)}
                          >
                            <RollbackOutlined />
                            Quote
                          </button>
                          {message.isCurrentAgent && (
                            <button
                              type="button"
                              onClick={() => onRecallMessage(message.id)}
                            >
                              <ReloadOutlined />
                              Recall
                            </button>
                          )}
                        </>
                      )}
                      {message.isCurrentAgent && isRecalled && canCompose && (
                        <button
                          type="button"
                          onClick={() => handleReEditMessage(message)}
                        >
                          <ReloadOutlined />
                          Re-edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>

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
            onKeyDown={handleComposerKeyDown}
          />
          {filteredQuickReplies.length > 0 && (
            <div className="livechat2-quick-replies" role="listbox">
              {filteredQuickReplies.map((reply, index) => (
                <button
                  aria-selected={index === selectedQuickReplyIndex}
                  className={
                    index === selectedQuickReplyIndex ? 'is-selected' : ''
                  }
                  key={reply.id}
                  role="option"
                  type="button"
                  onMouseEnter={() =>
                    setQuickReplySelection({
                      index,
                      listKey: quickReplyListKey,
                    })
                  }
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
              <button title="File" type="button">
                <FolderOpenOutlined />
              </button>
              <button
                aria-label="Message record"
                className={isMessageRecordOpen ? 'is-active' : ''}
                title="Message record"
                type="button"
                onClick={onOpenMessageRecord}
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
