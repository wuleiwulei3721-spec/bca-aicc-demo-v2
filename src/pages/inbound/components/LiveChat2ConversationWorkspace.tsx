import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  AimOutlined,
  CaretDownOutlined,
  CloseOutlined,
  ClockCircleOutlined,
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
import { Alert, DatePicker, Dropdown, Input } from 'antd'
import type { InputRef, MenuProps } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { AgentAvatar, BaseButton, BaseModal, CustomerAvatar } from '../../../components'
import { TransferModal } from '../../../layouts/components/TransferModal'
import type { LiveChat2Message, SessionEndReasonEntry } from '../../../types'
import { formatDuration } from '../../../utils/duration'
import type { LiveChat2SessionView } from './LiveChat2CustomerPanel'
import {
  getLiveChat2VisibleMessages,
} from './liveChat2MessageUtils'
import type { LiveChat2QuickReplyOption } from './liveChat2QuickReplies'

const { RangePicker } = DatePicker

interface LiveChat2ConversationWorkspaceProps {
  composerFocusRequest: LiveChat2ComposerFocusRequest | null
  draftMessage: string
  isMessageRecordOpen: boolean
  messages: LiveChat2Message[]
  quickReplies: LiveChat2QuickReplyOption[]
  recalledMessageIds: string[]
  sendBlockedMessage?: string | null
  session: LiveChat2SessionView
  sessionEndReasons?: SessionEndReasonEntry[]
  onCloseSession: (sessionId: string) => void
  onDraftChange: (sessionId: string, message: string) => void
  onEndSession: (
    sessionId: string,
    baseMessages: LiveChat2Message[],
    endReasonName?: string,
  ) => void
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

function getChannelLabel(channel: LiveChat2SessionView['channel']) {
  if (channel === 'BankApp') {
    return 'BankApp'
  }

  return channel
}

function getChannelIcon(channel: LiveChat2SessionView['channel']) {
  if (channel === 'WhatsApp') {
    return <WhatsAppOutlined />
  }

  if (channel === 'BankApp') {
    return <MobileOutlined />
  }

  return <GlobalOutlined />
}

function getChannelClassName(channel: LiveChat2SessionView['channel']) {
  if (channel === 'BankApp') {
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
}

type MessageRecordDateRange = [Dayjs, Dayjs]

interface MessageRecordFilters {
  dateRange: MessageRecordDateRange
  keyword: string
}

interface MessageRecordFilterState {
  appliedFilters: MessageRecordFilters
  draftFilters: MessageRecordFilters
  isSearchResultMode: boolean
  latestMessageTimestamp: number
}

function getMessageTime(message: LiveChat2Message) {
  const time = new Date(message.timestamp).getTime()

  return Number.isFinite(time) ? time : 0
}

function getLatestMessageTimestamp(messages: LiveChat2Message[]) {
  return messages.reduce(
    (latestTimestamp, message) =>
      Math.max(latestTimestamp, getMessageTime(message)),
    0,
  )
}

function getDefaultRecordDateRange(
  latestMessageTimestamp = 0,
): MessageRecordDateRange {
  const latestMessageDate =
    latestMessageTimestamp > 0 ? dayjs(latestMessageTimestamp) : dayjs()
  const anchorDate = latestMessageDate.isValid() ? latestMessageDate : dayjs()

  return [anchorDate.subtract(6, 'day'), anchorDate]
}

function getDefaultRecordFilters(
  latestMessageTimestamp = 0,
): MessageRecordFilters {
  return {
    dateRange: getDefaultRecordDateRange(latestMessageTimestamp),
    keyword: '',
  }
}

function getDateBoundary(dateValue: Dayjs, type: 'end' | 'start') {
  return type === 'start'
    ? dateValue.startOf('day').valueOf()
    : dateValue.endOf('day').valueOf()
}

export function LiveChat2MessageRecordPanel({
  messages,
}: LiveChat2MessageRecordPanelProps) {
  const latestMessageTimestamp = getLatestMessageTimestamp(messages)
  const defaultFilters = getDefaultRecordFilters(latestMessageTimestamp)
  const [filterState, setFilterState] = useState<MessageRecordFilterState>(() => ({
    appliedFilters: defaultFilters,
    draftFilters: defaultFilters,
    isSearchResultMode: false,
    latestMessageTimestamp,
  }))
  const activeFilterState =
    filterState.latestMessageTimestamp === latestMessageTimestamp
      ? filterState
      : {
          appliedFilters: defaultFilters,
          draftFilters: defaultFilters,
          isSearchResultMode: false,
          latestMessageTimestamp,
        }
  const { appliedFilters, draftFilters, isSearchResultMode } =
    activeFilterState
  const appliedKeyword = appliedFilters.keyword.trim()
  const recordNodeRefs = useRef<Record<string, HTMLElement | null>>({})
  const searchInputRef = useRef<InputRef>(null)
  const [locatedRecordRequest, setLocatedRecordRequest] = useState<{
    messageId: string
    requestId: number
  } | null>(null)

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
    setLocatedRecordRequest(null)
    setFilterState({
      appliedFilters: {
        dateRange: [draftFilters.dateRange[0], draftFilters.dateRange[1]],
        keyword: draftFilters.keyword.trim(),
      },
      draftFilters,
      isSearchResultMode: true,
      latestMessageTimestamp,
    })
  }
  const handleLocateMessage = (messageId: string) => {
    const nextFilters = {
      dateRange: [appliedFilters.dateRange[0], appliedFilters.dateRange[1]],
      keyword: '',
    } satisfies MessageRecordFilters

    setFilterState({
      appliedFilters: nextFilters,
      draftFilters: nextFilters,
      isSearchResultMode: false,
      latestMessageTimestamp,
    })
    setLocatedRecordRequest((currentRequest) => ({
      messageId,
      requestId: (currentRequest?.requestId ?? 0) + 1,
    }))
  }

  useEffect(() => {
    if (!locatedRecordRequest) {
      return
    }

    const targetNode = recordNodeRefs.current[locatedRecordRequest.messageId]

    if (!targetNode) {
      return
    }

    targetNode.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
    window.setTimeout(() => {
      searchInputRef.current?.focus({
        cursor: 'end',
      })
    }, 0)
  }, [locatedRecordRequest, matchedRecordMessages])

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

            setLocatedRecordRequest(null)
            setFilterState((current) => ({
              ...activeFilterState,
              draftFilters: {
                ...(current.latestMessageTimestamp === latestMessageTimestamp
                  ? current.draftFilters
                  : draftFilters),
                dateRange: [dates[0], dates[1]],
              },
              latestMessageTimestamp,
            }))
          }}
        />
        <Input
          allowClear
          aria-label="Search message record"
          placeholder="Search messages"
          prefix={<SearchOutlined />}
          ref={searchInputRef}
          size="small"
          value={draftFilters.keyword}
          onChange={(event) => {
            setLocatedRecordRequest(null)
            setFilterState((current) => ({
              ...activeFilterState,
              draftFilters: {
                ...(current.latestMessageTimestamp === latestMessageTimestamp
                  ? current.draftFilters
                  : draftFilters),
                keyword: event.target.value,
              },
              latestMessageTimestamp,
            }))
          }}
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
            <article
              className={
                locatedRecordRequest?.messageId === message.id
                  ? 'livechat2-records__item--located'
                  : undefined
              }
              data-livechat2-record-id={message.id}
              key={`record-${message.id}`}
              ref={(node) => {
                recordNodeRefs.current[message.id] = node
              }}
              tabIndex={0}
            >
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
  messages,
  quickReplies,
  recalledMessageIds,
  sendBlockedMessage,
  session,
  sessionEndReasons = [],
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
  const messagesListRef = useRef<HTMLElement | null>(null)
  const readOnly = session.statusDisplay === 'history'
  const isEnded = session.statusDisplay === 'ended'
  const canCompose = !readOnly && !isEnded
  const canRecallMessages =
    session.channel === 'BankApp' || session.channel === 'Webchat'
  const trimmedDraft = draftMessage.trim()
  const visibleMessages = getLiveChat2VisibleMessages(
    session.historyMessages,
    messages,
  )
  const latestVisibleMessageId =
    visibleMessages[visibleMessages.length - 1]?.id ?? ''
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
    const messagesList = messagesListRef.current

    if (!messagesList) {
      return
    }

    messagesList.scrollTop = messagesList.scrollHeight
  }, [latestVisibleMessageId, session.id])

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
  const hasAbnormalEndReasons = sessionEndReasons.length > 0
  const abnormalEndReasonItems: MenuProps['items'] = [
    {
      key: 'abnormal-end-reason-title',
      label: 'Abnormal End Reason',
      type: 'group',
      children: sessionEndReasons.map((reason) => ({
        key: reason.id,
        label: reason.reasonName,
      })),
    },
  ]
  const handleAbnormalEndReasonClick: MenuProps['onClick'] = ({ key }) => {
    const selectedReason = sessionEndReasons.find((reason) => reason.id === key)

    if (!selectedReason) {
      return
    }

    onEndSession(session.id, messages, selectedReason.reasonName)
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
                {hasAbnormalEndReasons ? (
                  <span className="livechat2-conversation__split-action">
                    <button
                      className="livechat2-conversation__end-action livechat2-conversation__split-main"
                      title="End service"
                      type="button"
                      onClick={() => setIsConfirmOpen(true)}
                    >
                      <CloseOutlined />
                      End Service
                    </button>
                    <Dropdown
                      classNames={{ root: 'aicc-agent-status-menu' }}
                      menu={{
                        items: abnormalEndReasonItems,
                        onClick: handleAbnormalEndReasonClick,
                      }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <button
                        aria-label="Select abnormal end reason"
                        className="livechat2-conversation__end-caret"
                        title="Abnormal End Reason"
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <CaretDownOutlined />
                      </button>
                    </Dropdown>
                  </span>
                ) : (
                  <button
                    className="livechat2-conversation__end-action"
                    title="End service"
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    <CloseOutlined />
                    End Service
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </header>

      <div className="livechat2-conversation__body">
        <section
          className="livechat2-conversation__messages"
          ref={messagesListRef}
          role="log"
        >
          {visibleMessages.map((message) => {
            const displayType = getMessageDisplayType(message)
            const isRecalled = recalledMessageIds.includes(message.id)

            return (
              <article
                className={[
                  'livechat2-message',
                  `livechat2-message--${displayType}`,
                ].join(' ')}
                data-livechat2-message-id={message.id}
                key={message.id}
              >
                {displayType !== 'system' && displayType !== 'current-agent' &&
                  (displayType === 'customer' ? (
                    <CustomerAvatar
                      className="livechat2-message__avatar"
                      size={30}
                    />
                  ) : (
                    <AgentAvatar
                      className="livechat2-message__avatar"
                      name={message.senderName}
                      size={30}
                    />
                  ))}
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
                          {message.isCurrentAgent && canRecallMessages && (
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
                      {message.isCurrentAgent &&
                        canRecallMessages &&
                        isRecalled &&
                        canCompose && (
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
        <div className="livechat2-composer-shell">
          <footer className="livechat2-composer">
            {sendBlockedMessage && (
              <Alert
                showIcon
                className="livechat2-composer__warning"
                description={sendBlockedMessage}
                message="Message blocked by sensitive word check."
                type="warning"
              />
            )}
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
              onChange={(event) =>
                onDraftChange(session.id, event.target.value)
              }
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
        </div>
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
