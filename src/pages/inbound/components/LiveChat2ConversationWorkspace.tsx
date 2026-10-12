import {
  Fragment,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CaretDownOutlined,
  CloseOutlined,
  DownOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  RobotOutlined,
  RollbackOutlined,
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  SwapOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { Alert, DatePicker, Dropdown, Input } from 'antd'
import type { MenuProps } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import {
  AgentAvatar,
  BaseButton,
  BaseModal,
  ChannelLogo,
  CustomerAvatar,
} from '../../../components'
import { TransferModal } from '../../../layouts/components/TransferModal'
import type { LiveChat2Message, SessionEndReasonEntry } from '../../../types'
import { formatAgentDisplay } from '../../../utils/agentDisplay'
import { formatDuration } from '../../../utils/duration'
import type { LiveChat2SessionView } from './LiveChat2CustomerPanel'
import {
  getLiveChat2VisibleMessages,
} from './liveChat2MessageUtils'
import { getLiveChat2CustomerDisplayName } from './liveChat2CustomerDisplayName'
import type { LiveChat2QuickReplyOption } from './liveChat2QuickReplies'

const { RangePicker } = DatePicker
const MESSAGE_RECORD_DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss'

interface LiveChat2ConversationWorkspaceProps {
  composerFocusRequest: LiveChat2ComposerFocusRequest | null
  draftMessage: string
  isMessageRecordOpen: boolean
  messages: LiveChat2Message[]
  quickReplies: LiveChat2QuickReplyOption[]
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

  if (message.sender === 'bot') {
    return 'bot'
  }

  if (message.sender === 'agent') {
    return 'previous-agent'
  }

  return 'customer'
}

function getChannelLabel(channel: LiveChat2SessionView['channel']) {
  if (channel === 'HaloBCA') {
    return 'HaloBCA'
  }

  return channel
}

function getChannelClassName(channel: LiveChat2SessionView['channel']) {
  if (channel === 'HaloBCA') {
    return 'livechat2-channel-avatar--bankapp'
  }

  return `livechat2-channel-avatar--${channel.toLowerCase()}`
}

function getEndedStatusLabel(session: LiveChat2SessionView) {
  if (session.endReason === 'customer') {
    return 'Customer ended'
  }

  if (session.endReason === 'timeout') {
    return 'Timed out'
  }

  return 'Agent ended'
}

function highlightSearch(
  value: string,
  search: string,
  currentOffset: number | null = null,
) {
  const normalizedSearch = search.trim()

  if (!normalizedSearch) {
    return value
  }

  const normalizedValue = value.toLowerCase()
  const normalizedNeedle = normalizedSearch.toLowerCase()
  const segments: React.ReactNode[] = []
  let cursor = 0
  let matchIndex = normalizedValue.indexOf(normalizedNeedle)

  if (matchIndex < 0) {
    return value
  }

  while (matchIndex >= 0) {
    if (matchIndex > cursor) {
      segments.push(value.slice(cursor, matchIndex))
    }

    const matchEnd = matchIndex + normalizedSearch.length
    segments.push(
      <mark
        className={
          matchIndex === currentOffset
            ? 'livechat2-records__mark--current'
            : undefined
        }
        data-livechat2-match-start={matchIndex}
        key={`${matchIndex}-${matchEnd}`}
      >
        {value.slice(matchIndex, matchEnd)}
      </mark>,
    )
    cursor = matchEnd
    matchIndex = normalizedValue.indexOf(normalizedNeedle, cursor)
  }

  if (cursor < value.length) {
    segments.push(value.slice(cursor))
  }

  return <>{segments}</>
}

function renderMessageContent(
  message: LiveChat2Message,
  search = '',
) {
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

function LiveChat2BotSummary({
  status,
  summary,
}: {
  status: LiveChat2SessionView['botSummaryStatus']
  summary: string
}) {
  const isGenerating = status === 'generating'

  return (
    <section
      aria-live="polite"
      className="livechat2-bot-summary"
      data-livechat2-bot-summary={isGenerating ? 'generating' : 'ready'}
    >
      <div className="livechat2-bot-summary__card">
        <div className="livechat2-bot-summary__title">
          <RobotOutlined />
          <span>BOT CONVERSATION SUMMARY</span>
        </div>
        <p>
          {isGenerating
            ? 'Organizing the bot conversation. Please wait...'
            : summary}
        </p>
      </div>
    </section>
  )
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
}

interface MessageRecordOccurrence {
  key: string
  messageId: string
  startIndex: number
}

type MessageRecordDisabledTime = NonNullable<RangePickerProps['disabledTime']>

const MESSAGE_RECORD_MAX_RANGE_MS = 7 * 24 * 60 * 60 * 1000
const MESSAGE_RECORD_RANGE_ERROR = 'Select a range up to 7 days with end after start.'

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
  const anchorDate = latestMessageDate.isValid()
    ? latestMessageDate.millisecond(0)
    : dayjs().millisecond(0)

  return [anchorDate.subtract(168, 'hour'), anchorDate]
}

function getDefaultRecordFilters(
  latestMessageTimestamp = 0,
): MessageRecordFilters {
  return {
    dateRange: getDefaultRecordDateRange(latestMessageTimestamp),
    keyword: '',
  }
}

function formatMessageRecordTimestamp(timestamp: string) {
  const date = dayjs(timestamp)

  return date.isValid()
    ? date.format(MESSAGE_RECORD_DATE_TIME_FORMAT)
    : timestamp
}

function getMessageRecordSearchText(message: LiveChat2Message) {
  return message.kind === 'file' ? message.fileName ?? message.message : message.message
}

function getMessageRecordOccurrences(
  messages: LiveChat2Message[],
  keyword: string,
): MessageRecordOccurrence[] {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) {
    return []
  }

  return messages.flatMap((message) => {
    const text = getMessageRecordSearchText(message)
    const normalizedText = text.toLowerCase()
    const occurrences: MessageRecordOccurrence[] = []
    let matchIndex = normalizedText.indexOf(normalizedKeyword)

    while (matchIndex >= 0) {
      occurrences.push({
        key: `${message.id}:${matchIndex}`,
        messageId: message.id,
        startIndex: matchIndex,
      })
      const cursor = matchIndex + normalizedKeyword.length
      matchIndex = normalizedText.indexOf(normalizedKeyword, cursor)
    }

    return occurrences
  })
}

function isValidMessageRecordRange(dateRange: MessageRecordDateRange) {
  const [start, end] = dateRange

  return (
    start.isValid() &&
    end.isValid() &&
    !end.isBefore(start) &&
    end.valueOf() - start.valueOf() <= MESSAGE_RECORD_MAX_RANGE_MS
  )
}

function getMessageRecordRangeError(dateRange: MessageRecordDateRange) {
  return isValidMessageRecordRange(dateRange) ? null : MESSAGE_RECORD_RANGE_ERROR
}

function getMessageRecordDisabledDate(date: Dayjs, info: { from?: Dayjs }) {
  if (!info.from) {
    return false
  }

  return Math.abs(date.startOf('day').diff(info.from.startOf('day'), 'day')) > 7
}

function getDisabledRecordTime(
  date: Dayjs | null,
  range: 'start' | 'end',
  info: { from?: Dayjs },
): ReturnType<MessageRecordDisabledTime> {
  const from = info.from

  if (!date || !from || Math.abs(date.startOf('day').diff(from.startOf('day'), 'day')) !== 7) {
    return {}
  }

  const boundary =
    range === 'start'
      ? from.subtract(168, 'hour')
      : from.add(168, 'hour')

  if (!date.isSame(boundary, 'day')) {
    return {}
  }

  const disabledHours = () =>
    Array.from({ length: 24 }, (_, hour) => hour).filter((hour) =>
      range === 'start' ? hour < boundary.hour() : hour > boundary.hour(),
    )
  const disabledMinutes = (hour: number) => {
    if (hour !== boundary.hour()) {
      return []
    }

    return Array.from({ length: 60 }, (_, minute) => minute).filter((minute) =>
      range === 'start' ? minute < boundary.minute() : minute > boundary.minute(),
    )
  }
  const disabledSeconds = (hour: number, minute: number) => {
    if (hour !== boundary.hour() || minute !== boundary.minute()) {
      return []
    }

    return Array.from({ length: 60 }, (_, second) => second).filter((second) =>
      range === 'start' ? second < boundary.second() : second > boundary.second(),
    )
  }

  return {
    disabledHours,
    disabledMinutes,
    disabledSeconds,
  }
}

export function LiveChat2MessageRecordPanel({
  messages,
}: LiveChat2MessageRecordPanelProps) {
  const latestMessageTimestamp = getLatestMessageTimestamp(messages)
  const [filterState, setFilterState] = useState<MessageRecordFilterState>(() => {
    const defaultFilters = getDefaultRecordFilters(latestMessageTimestamp)

    return {
      appliedFilters: defaultFilters,
      draftFilters: defaultFilters,
      isSearchResultMode: false,
    }
  })
  const [rangeError, setRangeError] = useState<string | null>(null)
  const [currentOccurrence, setCurrentOccurrence] =
    useState<MessageRecordOccurrence | null>(null)
  const [searchRequestId, setSearchRequestId] = useState(0)
  const { appliedFilters, draftFilters, isSearchResultMode } = filterState
  const appliedKeyword = appliedFilters.keyword.trim()
  const recordNodeRefs = useRef<Record<string, HTMLElement | null>>({})
  const recordListRef = useRef<HTMLDivElement | null>(null)

  const rangeFilteredRecordMessages = useMemo(() => {
    const fromTime = appliedFilters.dateRange[0].startOf('second').valueOf()
    const toTime = appliedFilters.dateRange[1].endOf('second').valueOf()

    return messages
      .filter((message) => {
        const messageTime = getMessageTime(message)

        return messageTime >= fromTime && messageTime <= toTime
      })
      .sort((first, second) => getMessageTime(first) - getMessageTime(second))
  }, [appliedFilters.dateRange, messages])

  const recordOccurrences = useMemo(
    () => getMessageRecordOccurrences(rangeFilteredRecordMessages, appliedKeyword),
    [appliedKeyword, rangeFilteredRecordMessages],
  )

  const currentMatchIndex = currentOccurrence
    ? recordOccurrences.findIndex(
        (occurrence) => occurrence.key === currentOccurrence.key,
      )
    : -1
  const effectiveCurrentMatchIndex =
    currentMatchIndex >= 0 ? currentMatchIndex : recordOccurrences.length > 0 ? 0 : -1
  const effectiveCurrentOccurrence =
    effectiveCurrentMatchIndex >= 0
      ? recordOccurrences[effectiveCurrentMatchIndex] ?? null
      : null
  const currentMessageId = effectiveCurrentOccurrence?.messageId ?? null
  const currentOffset = effectiveCurrentOccurrence?.startIndex ?? null
  const matchCount = recordOccurrences.length
  const canGoPrevious = effectiveCurrentMatchIndex > 0
  const canGoNext =
    effectiveCurrentMatchIndex >= 0 && effectiveCurrentMatchIndex < matchCount - 1

  const applyDraftRange = (dateRange: MessageRecordDateRange) => {
    setRangeError(getMessageRecordRangeError(dateRange))
    setFilterState((current) => ({
      ...current,
      draftFilters: {
        ...current.draftFilters,
        dateRange,
      },
    }))
  }
  const handleSearch = () => {
    const validationError = getMessageRecordRangeError(draftFilters.dateRange)

    setRangeError(validationError)

    if (validationError) {
      return
    }

    const nextFilters: MessageRecordFilters = {
      dateRange: [draftFilters.dateRange[0], draftFilters.dateRange[1]],
      keyword: draftFilters.keyword.trim(),
    }
    const fromTime = nextFilters.dateRange[0].startOf('second').valueOf()
    const toTime = nextFilters.dateRange[1].endOf('second').valueOf()
    const nextRangeFilteredMessages = messages
      .filter((message) => {
        const messageTime = getMessageTime(message)

        return messageTime >= fromTime && messageTime <= toTime
      })
      .sort((first, second) => getMessageTime(first) - getMessageTime(second))
    const firstOccurrence = getMessageRecordOccurrences(
      nextRangeFilteredMessages,
      nextFilters.keyword,
    )[0]

    setFilterState((current) => ({
      appliedFilters: nextFilters,
      draftFilters: current.draftFilters,
      isSearchResultMode: true,
    }))
    setCurrentOccurrence(firstOccurrence ?? null)
    setSearchRequestId((requestId) => requestId + 1)
  }
  const handlePreviousMatch = () => {
    if (!canGoPrevious) {
      return
    }

    const previousOccurrence = recordOccurrences[effectiveCurrentMatchIndex - 1]

    if (previousOccurrence) {
      setCurrentOccurrence(previousOccurrence)
      setSearchRequestId((requestId) => requestId + 1)
    }
  }
  const handleNextMatch = () => {
    if (!canGoNext) {
      return
    }

    const nextOccurrence = recordOccurrences[effectiveCurrentMatchIndex + 1]

    if (nextOccurrence) {
      setCurrentOccurrence(nextOccurrence)
      setSearchRequestId((requestId) => requestId + 1)
    }
  }

  useEffect(() => {
    if (
      !isSearchResultMode ||
      !currentMessageId ||
      currentOffset === null ||
      searchRequestId === 0
    ) {
      return
    }

    const listNode = recordListRef.current
    const recordNode = recordNodeRefs.current[currentMessageId]
    const targetNode = recordNode?.querySelector<HTMLElement>(
      `mark[data-livechat2-match-start="${currentOffset}"]`,
    )

    if (!listNode || !targetNode) {
      return
    }

    const listRect = listNode.getBoundingClientRect()
    const targetRect = targetNode.getBoundingClientRect()
    const targetOffset =
      targetRect.top - listRect.top + listNode.scrollTop - listNode.clientHeight / 2 + targetNode.offsetHeight / 2

    listNode.scrollTo({
      behavior: 'smooth',
      top: Math.max(targetOffset, 0),
    })
  }, [currentMessageId, currentOffset, isSearchResultMode, searchRequestId])

  const getDraftDisabledRecordTime: MessageRecordDisabledTime = (date, range, info) =>
    getDisabledRecordTime(date, range, {
      from:
        info.from ??
        (range === 'start'
          ? draftFilters.dateRange[1]
          : draftFilters.dateRange[0]),
    })

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
          disabledDate={getMessageRecordDisabledDate}
          format={MESSAGE_RECORD_DATE_TIME_FORMAT}
          inputReadOnly
          size="small"
          disabledTime={getDraftDisabledRecordTime}
          showTime={{
            format: 'HH:mm:ss',
          }}
          value={draftFilters.dateRange}
          onChange={(dates) => {
            if (!dates?.[0] || !dates?.[1]) {
              return
            }

            applyDraftRange([dates[0], dates[1]])
          }}
        />
        <Input
          allowClear
          aria-label="Search message record"
          placeholder="Search messages"
          prefix={<SearchOutlined />}
          size="small"
          value={draftFilters.keyword}
          onChange={(event) => {
            setFilterState((current) => ({
              ...current,
              draftFilters: {
                ...current.draftFilters,
                keyword: event.target.value,
              },
            }))
          }}
        />
        <BaseButton htmlType="submit" size="small" type="primary" variant="primary">
          Search
        </BaseButton>
        {rangeError && (
          <Alert
            showIcon
            className="livechat2-records__range-alert"
            message={rangeError}
            type="warning"
          />
        )}
        {isSearchResultMode && (
          <div className="livechat2-records__result-nav">
            <span
              className="livechat2-records__result-count"
              title={`${matchCount} keyword occurrences found`}
            >
              {effectiveCurrentMatchIndex >= 0 ? effectiveCurrentMatchIndex + 1 : 0}/{matchCount}
            </span>
            <BaseButton
              aria-label="Previous match"
              disabled={!canGoPrevious}
              icon={<UpOutlined />}
              size="small"
              title="Previous match"
              variant="ghost"
              onClick={handlePreviousMatch}
            />
            <BaseButton
              aria-label="Next match"
              disabled={!canGoNext}
              icon={<DownOutlined />}
              size="small"
              title="Next match"
              variant="ghost"
              onClick={handleNextMatch}
            />
          </div>
        )}
      </form>
      <div className="livechat2-records__list" ref={recordListRef}>
        {rangeFilteredRecordMessages.length > 0 ? (
          rangeFilteredRecordMessages.map((message) => {
            const selectedStart =
              isSearchResultMode && currentMessageId === message.id
                ? currentOffset
                : null
            const displayMessage = getMessageRecordSearchText(message)

            return (
              <article
                data-livechat2-record-id={message.id}
                key={`record-${message.id}`}
                ref={(node) => {
                  recordNodeRefs.current[message.id] = node
                }}
              >
                <div className="livechat2-records__item-head">
                  <strong>
                    {message.sender === 'agent' || message.sender === 'bot'
                      ? formatAgentDisplay(
                          message.senderEmployeeId,
                          message.senderName,
                        )
                      : message.senderName}
                  </strong>
                  <time>
                    {formatMessageRecordTimestamp(message.timestamp)}
                  </time>
                </div>
                <p>{highlightSearch(displayMessage, appliedKeyword, selectedStart)}</p>
              </article>
            )
          })
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
  sendBlockedMessage,
  session,
  sessionEndReasons = [],
  onCloseSession,
  onDraftChange,
  onEndSession,
  onOpenMessageRecord,
  onSendMessage,
}: LiveChat2ConversationWorkspaceProps) {
  const customerDisplayName = getLiveChat2CustomerDisplayName(session)
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
  const trimmedDraft = draftMessage.trim()
  const visibleMessages = getLiveChat2VisibleMessages(
    session.historyMessages,
    messages,
  )
  const shouldShowBotSummary =
    session.statusDisplay !== 'history' && Boolean(session.botSummary)
  const lastBotMessageIndex = shouldShowBotSummary
    ? visibleMessages.reduce(
        (lastIndex, message, index) =>
          message.sender === 'bot' ? index : lastIndex,
        -1,
      )
    : -1
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
            <ChannelLogo channel={session.channel} variant="livechat" />
          </span>
          <strong>{customerDisplayName}</strong>
          <span className="livechat2-conversation__duration">
            <ClockCircleOutlined />
            {formatDuration(session.elapsedSeconds)}
          </span>
        </div>

        {!readOnly && (
          <div className="livechat2-conversation__actions" role="group">
            {isEnded ? (
              <>
                <span className="livechat2-conversation__end-status">
                  {getEndedStatusLabel(session)}
                </span>
                <button
                  className="livechat2-conversation__close-action"
                  title="Close"
                  type="button"
                  onClick={() => onCloseSession(session.id)}
                >
                  <CloseOutlined />
                  Close
                </button>
              </>
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
          {visibleMessages.map((message, index) => {
            const displayType = getMessageDisplayType(message)
            return (
              <Fragment key={message.id}>
                <article
                  className={[
                    'livechat2-message',
                    `livechat2-message--${displayType}`,
                  ].join(' ')}
                  data-livechat2-message-id={message.id}
                >
                  {displayType !== 'system' &&
                    displayType !== 'current-agent' &&
                    (displayType === 'customer' ? (
                      <CustomerAvatar
                        className="livechat2-message__avatar"
                        size={30}
                      />
                    ) : displayType === 'bot' ? (
                      <span
                        aria-label="AI Assistant avatar"
                        className="livechat2-bot-avatar livechat2-message__avatar"
                        role="img"
                      >
                        <RobotOutlined />
                      </span>
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
                        <strong>
                          {formatAgentDisplay(
                            message.senderEmployeeId,
                            message.senderName,
                          )}
                        </strong>
                      )}
                      {displayType === 'bot' && <strong>{message.senderName}</strong>}
                      <time>{message.time}</time>
                    </div>
                    {message.quotedMessage && (
                      <div className="livechat2-message__quote">
                        {message.quotedMessage}
                      </div>
                    )}
                    <div className="livechat2-message__bubble">
                      {renderMessageContent(message)}
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
                      </div>
                    )}
                  </div>
                </article>
                {index === lastBotMessageIndex && session.botSummary && (
                  <LiveChat2BotSummary
                    status={session.botSummaryStatus}
                    summary={session.botSummary}
                  />
                )}
              </Fragment>
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
              aria-label={`Message ${customerDisplayName}`}
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
          {customerDisplayName}?
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
