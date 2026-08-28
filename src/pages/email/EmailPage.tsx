import {
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  FilterOutlined,
  InboxOutlined,
  LeftOutlined,
  LinkOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  RightOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  SendOutlined,
  UserOutlined,
  WarningFilled,
} from '@ant-design/icons'
import {
  Dropdown,
  Empty,
  Input,
  Select,
  Tooltip,
} from 'antd'
import type { MenuProps } from 'antd'
import type { PointerEvent, ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import {
  BaseButton,
  StatusBadge,
  TicketRegistrationDrawer,
} from '../../components'
import type { TicketRegistrationDraft } from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useNow } from '../../hooks/useNow'
import { createEmailDemoMessages } from '../../mock/email'
import {
  customerJourney,
  nextBestActions,
  ticketingHistory,
} from '../../mock/inbound'
import type {
  CrmWorkspaceTab,
  EmailComposeDraft,
  EmailFolder,
  EmailIgnoreReason,
  EmailLanguage,
  EmailMessage,
  EmailStatus,
} from '../../types'
import {
  CONVERSATION_TAB_KEY,
  CRM_TAB_KEY,
  CrmPanel,
} from '../inbound/components/CrmPanel'
import { LeftColumn } from '../inbound/components/LeftColumn'
import {
  EmailComposeModal,
  EmailComposePanel,
} from './components/EmailComposeModal'

const BANK_EMAIL_ACCOUNT = 'contact@bank1.demo'
const BANK_PUBLIC_WEBSITE = 'https://www.bca.co.id'
const BANK_SIGNATURE_IMAGE = '/email-assets/bank-service-counter.jpg'
const TEAM_LEADER_EMAIL = 'tl.budi.kartika@bank1.demo'
const AGENT_NAME = 'Budi Kartika'
const DEFAULT_EMAIL_LANGUAGE: EmailLanguage = 'ID'

const emailStatusOptions: Array<{ label: string; value: EmailStatus }> = [
  { label: 'Monitoring', value: 'pending' },
  { label: 'In progressing', value: 'open' },
  { label: 'Close', value: 'closed' },
]

const emailStatusLabels: Record<EmailStatus, string> = {
  closed: 'Close',
  open: 'In progressing',
  pending: 'Monitoring',
}

const emailCommonLinks = [
  {
    description: 'Public BCA service and product information.',
    href: BANK_PUBLIC_WEBSITE,
    id: 'bca-official',
    title: 'BCA Official Website',
  },
  {
    description: 'Credit card dispute process and required documents.',
    href: 'https://www.bca.co.id/en/Individu/produk/Kartu-Kredit',
    id: 'credit-card-dispute',
    title: 'Credit Card Dispute Guide',
  },
  {
    description: 'BCA mobile activation and troubleshooting reference.',
    href: 'https://www.bca.co.id/en/Individu/layanan/e-banking/BCA-Mobile',
    id: 'bca-mobile-help',
    title: 'BCA Mobile Support',
  },
]

const transferAgents = [
  {
    employeeId: 'AICC1025',
    extension: '81025',
    id: 'tl-arif-prasetyo',
    name: 'Arif Prasetyo',
    role: 'TL',
    skillName: 'Debit Card',
    status: 'Ready',
  },
]

const transferSkillOptions = [
  { label: 'All skill Name', value: 'all' },
  { label: 'Debit Card', value: 'Debit Card' },
]

const transferStatusOptions = [
  { label: 'All status', value: 'all' },
  { label: 'Ready', value: 'Ready' },
]

const folderDefinitions: Array<{
  icon: ReactNode
  key: EmailFolder
  label: string
}> = [
  { icon: <InboxOutlined />, key: 'inbox', label: 'Inbox' },
  { icon: <SendOutlined />, key: 'sent', label: 'Sent' },
  { icon: <FileTextOutlined />, key: 'drafts', label: 'Drafts' },
  { icon: <DeleteOutlined />, key: 'trash', label: 'No Reply' },
]

function cloneMessages(messages: EmailMessage[]) {
  return messages.map((email) => ({
    ...email,
    customer: {
      ...email.customer,
      profile: { ...email.customer.profile },
    },
    cwu: email.cwu
      ? {
          ...email.cwu,
        }
      : undefined,
  }))
}

function sanitizeEmailHtml(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html

  template.content
    .querySelectorAll('script, style, iframe, object, embed')
    .forEach((element) => element.remove())

  template.content.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()

      if (
        name.startsWith('on') ||
        ((name === 'href' || name === 'src') && value.startsWith('javascript:'))
      ) {
        element.removeAttribute(attribute.name)
      }
    })
  })

  return template.innerHTML
}

function getEmailText(html: string) {
  const template = document.createElement('template')
  template.innerHTML = sanitizeEmailHtml(html)
  return (template.content.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function formatSignatureDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function createEmailSignature(language: EmailLanguage) {
  const dateLabel = language === 'EN' ? 'Date' : 'Tanggal'
  const regards = language === 'EN' ? 'Regards' : 'Salam'

  return `
    <section class="email-signature" data-public-mailbox="${BANK_EMAIL_ACCOUNT}" data-language="${language}">
      <p>${regards},</p>
      <p><strong>${AGENT_NAME}</strong><br>BANK 1 Customer Service</p>
      <p>${dateLabel}: ${formatSignatureDate()}</p>
      <p>
        <img src="${BANK_SIGNATURE_IMAGE}" alt="BANK 1 banking service" width="28" height="28" />
        <a href="${BANK_PUBLIC_WEBSITE}" target="_blank" rel="noreferrer">${BANK_PUBLIC_WEBSITE}</a>
      </p>
    </section>
  `
}

function formatMailboxTime(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  return new Intl.DateTimeFormat('en-GB',
    isToday
      ? { hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: 'short' },
  ).format(date)
}

function formatEmailTime(timestamp: number) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(timestamp)
}

function formatElapsed(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(wholeSeconds / 60)
  const remainingSeconds = wholeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function getSlaState(email: EmailMessage, now: number) {
  if (!email.slaStartedAt || !email.slaTargetSeconds) {
    return null
  }

  const elapsedSeconds = Math.max(
    0,
    ((email.slaStoppedAt ?? now) - email.slaStartedAt) / 1000,
  )
  const progress = Math.min(100, (elapsedSeconds / email.slaTargetSeconds) * 100)

  return {
    elapsedSeconds,
    progress,
    tone: progress >= 100 ? 'breach' : progress >= 75 ? 'warning' : 'normal',
  }
}

function getHandlingBadge(email: EmailMessage) {
  if (email.handlingStatus === 'replied') {
    return <StatusBadge label="Replied" size="small" status="success" />
  }

  if (email.handlingStatus === 'ignored') {
    return (
      <StatusBadge
        label={`No reply: ${email.ignoreReason ?? 'Selected'}`}
        size="small"
        status="warning"
      />
    )
  }

  if (email.handlingStatus === 'failed') {
    return <StatusBadge label="Send failed" size="small" status="failed" />
  }

  if (email.handlingStatus === 'draft') {
    return <StatusBadge label="Draft" size="small" status="neutral" />
  }

  if (email.handlingStatus === 'sent') {
    return (
      <StatusBadge
        label={email.emailStatus ? emailStatusLabels[email.emailStatus] : 'Sent'}
        size="small"
        status={email.emailStatus === 'closed' ? 'success' : 'selected'}
      />
    )
  }

  if (email.handlingStatus === 'transferred') {
    return <StatusBadge label="Transferred" size="small" status="selected" />
  }

  return null
}

function createComposeDraft(
  mode: EmailComposeDraft['mode'],
  source?: EmailMessage,
  options: { receiverLocked?: boolean } = {},
): EmailComposeDraft {
  const replySubject = source?.subject.replace(/^(RE|FW|TR):\s*/i, '') ?? ''

  if (mode === 'draft' && source) {
    const transferSourceMessageId = source.transferSourceMessageId
    const language = source.language ?? DEFAULT_EMAIL_LANGUAGE

    return {
      bodyHtml: source.bodyHtml,
      draftMessageId: source.id,
      emailStatus: source.emailStatus,
      language,
      mode: transferSourceMessageId ? 'transfer' : mode,
      receiver: source.receiver,
      receiverLocked: options.receiverLocked,
      sender: source.sender,
      sourceMessageId: transferSourceMessageId ?? source.id,
      subject: source.subject,
      threadId: source.threadId,
    }
  }

  if (mode === 'reply' && source) {
    return {
      bodyHtml: createEmailSignature(DEFAULT_EMAIL_LANGUAGE),
      language: DEFAULT_EMAIL_LANGUAGE,
      mode,
      receiver: source.sender,
      receiverLocked: options.receiverLocked,
      sender: BANK_EMAIL_ACCOUNT,
      sourceMessageId: source.id,
      subject: `RE: ${replySubject}`,
      threadId: source.threadId,
    }
  }

  if (mode === 'transfer' && source) {
    return {
      bodyHtml: `${createEmailSignature(DEFAULT_EMAIL_LANGUAGE)}<blockquote><strong>Transferred message</strong><br>${sanitizeEmailHtml(source.bodyHtml)}</blockquote>`,
      emailStatus: 'pending',
      language: DEFAULT_EMAIL_LANGUAGE,
      mode,
      receiver: TEAM_LEADER_EMAIL,
      receiverLocked: options.receiverLocked,
      sender: BANK_EMAIL_ACCOUNT,
      sourceMessageId: source.id,
      subject: `TR: ${replySubject}`,
      threadId: source.threadId,
    }
  }

  return {
    bodyHtml: createEmailSignature(DEFAULT_EMAIL_LANGUAGE),
    language: DEFAULT_EMAIL_LANGUAGE,
    mode: 'new',
    receiver: source?.customer.profile.email ?? '',
    receiverLocked: options.receiverLocked,
    sender: BANK_EMAIL_ACCOUNT,
    subject: '',
    threadId: `email-thread-new-${Date.now()}`,
  }
}

interface MailboxPanelProps {
  activeFolder: EmailFolder
  collapsed: boolean
  messages: EmailMessage[]
  now: number
  searchValue: string
  selectedMessageId: string | null
  sentStatusFilter: EmailStatus | 'all'
  onFolderChange: (folder: EmailFolder) => void
  onCompose: () => void
  onCollapsedChange: (collapsed: boolean) => void
  onRefresh: () => void
  onSearchChange: (value: string) => void
  onSelectMessage: (messageId: string) => void
  onSentStatusFilterChange: (status: EmailStatus | 'all') => void
}

function MailboxPanel({
  activeFolder,
  collapsed,
  messages,
  now,
  searchValue,
  selectedMessageId,
  sentStatusFilter,
  onCompose,
  onCollapsedChange,
  onFolderChange,
  onRefresh,
  onSearchChange,
  onSelectMessage,
  onSentStatusFilterChange,
}: MailboxPanelProps) {
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false)
  const folderCounts = useMemo(
    () =>
      folderDefinitions.reduce<Record<EmailFolder, number>>(
        (counts, folder) => {
          counts[folder.key] = messages.filter(
            (message) => message.folder === folder.key,
          ).length
          return counts
        },
        { drafts: 0, inbox: 0, sent: 0, trash: 0 },
      ),
    [messages],
  )
  const normalizedSearch = searchValue.trim().toLowerCase()
  const visibleMessages = messages
    .filter((message) => message.folder === activeFolder)
    .filter((message) => {
      if (activeFolder !== 'sent' || sentStatusFilter === 'all') {
        return true
      }

      return message.emailStatus === sentStatusFilter
    })
    .filter((message) => {
      if (!normalizedSearch) {
        return true
      }

      return [
        message.sender,
        message.receiver,
        message.subject,
        message.preview,
        message.customer.profile.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
    .sort((first, second) => second.sentAt - first.sentAt)
  const [sendmailOffset, setSendmailOffset] = useState({ x: 0, y: 0 })
  const sendmailDragRef = useRef<{
    dragged: boolean
    originX: number
    originY: number
    pointerId: number | null
    startX: number
    startY: number
  }>({
    dragged: false,
    originX: 0,
    originY: 0,
    pointerId: null,
    startX: 0,
    startY: 0,
  })

  const clampSendmailOffset = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

  const handleSendmailPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    sendmailDragRef.current = {
      dragged: false,
      originX: sendmailOffset.x,
      originY: sendmailOffset.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleSendmailPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = sendmailDragRef.current
    if (dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      dragState.dragged = true
    }

    const horizontalLimit = collapsed ? 5 : 98
    const upwardLimit = collapsed ? 420 : 360
    setSendmailOffset({
      x: clampSendmailOffset(
        dragState.originX + deltaX,
        -horizontalLimit,
        horizontalLimit,
      ),
      y: clampSendmailOffset(dragState.originY + deltaY, -upwardLimit, 10),
    })
  }

  const handleSendmailPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = sendmailDragRef.current
    if (dragState.pointerId !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragState.pointerId = null
  }

  const handleSendmailClick = () => {
    if (sendmailDragRef.current.dragged) {
      sendmailDragRef.current.dragged = false
      return
    }

    onCompose()
  }

  return (
    <aside
      className={[
        'email-mailbox-panel',
        collapsed ? 'email-mailbox-panel--collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Email mailbox"
    >
      <div
        className={[
          'email-mailbox-panel__folders',
          collapsed ? 'email-mailbox-panel__folders--collapsed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <button
          aria-label={collapsed ? 'Expand folders' : 'Collapse folders'}
          className="email-mailbox-panel__folder-toggle"
          type="button"
          onClick={() => {
            setSendmailOffset({ x: 0, y: 0 })
            onCollapsedChange(!collapsed)
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        {folderDefinitions.map((folder) => (
          <button
            aria-pressed={activeFolder === folder.key}
            className={[
              'email-folder-button',
              activeFolder === folder.key ? 'email-folder-button--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={folder.key}
            type="button"
            onClick={() => {
              onFolderChange(folder.key)
              if (folder.key !== 'sent') {
                setIsStatusFilterOpen(false)
              }
            }}
          >
            <span className={`email-folder-button__icon email-folder-button__icon--${folder.key}`}>
              {folder.icon}
            </span>
            {folderCounts[folder.key] > 0 && (
              <span className={`email-folder-button__count email-folder-button__count--${folder.key}`}>
                {folderCounts[folder.key]}
              </span>
            )}
            <span className="email-folder-button__label">{folder.label}</span>
          </button>
        ))}
      </div>

      <div
        className={[
          'email-mailbox-panel__search',
          activeFolder === 'sent'
            ? 'email-mailbox-panel__search--with-filter'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Input
          allowClear
          aria-label="Search email"
          placeholder="Search email"
          prefix={<SearchOutlined />}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {activeFolder === 'sent' && (
          <Tooltip title="Filter email">
            <button
              aria-label="Filter email"
              aria-pressed={isStatusFilterOpen}
              className={
                isStatusFilterOpen
                  ? 'email-mailbox-panel__toolbar-button email-mailbox-panel__toolbar-button--active'
                  : 'email-mailbox-panel__toolbar-button'
              }
              type="button"
              onClick={() => setIsStatusFilterOpen((current) => !current)}
            >
              <FilterOutlined />
            </button>
          </Tooltip>
        )}
        <Tooltip title="Refresh mailbox">
          <button
            aria-label="Refresh mailbox"
            className="email-mailbox-panel__toolbar-button"
            type="button"
            onClick={onRefresh}
          >
            <ReloadOutlined />
          </button>
        </Tooltip>
      </div>

      {activeFolder === 'sent' && isStatusFilterOpen && (
        <div className="email-mailbox-panel__sent-filter">
          <div className="email-mailbox-panel__status-chips">
            {[
              { label: 'All', value: 'all' },
              ...emailStatusOptions,
            ].map((option) => (
              <button
                key={option.value}
                aria-pressed={sentStatusFilter === option.value}
                className={
                  sentStatusFilter === option.value
                    ? `email-mailbox-panel__status-chip email-mailbox-panel__status-chip--${option.value} email-mailbox-panel__status-chip--active`
                    : `email-mailbox-panel__status-chip email-mailbox-panel__status-chip--${option.value}`
                }
                type="button"
                onClick={() =>
                  onSentStatusFilterChange(option.value as EmailStatus | 'all')
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="email-mailbox-panel__list">
        {visibleMessages.length > 0 ? (
          visibleMessages.map((email) => {
            const sla = getSlaState(email, now)
            const displayContact =
              email.direction === 'outbound'
                ? email.receiver
                : email.sender

            return (
              <button
                className={[
                  'email-list-item',
                  selectedMessageId === email.id ? 'email-list-item--active' : '',
                  !email.isRead ? 'email-list-item--unread' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={email.id}
                type="button"
                onClick={() => onSelectMessage(email.id)}
              >
                <span className="email-list-item__topline">
                  <strong>{displayContact}</strong>
                  {email.hasAttachment && <span title="Attachment">&#128206;</span>}
                  {email.folder === 'drafts' && (
                    <span
                      className={[
                        'email-list-item__draft-state',
                        email.handlingStatus === 'failed'
                          ? 'email-list-item__draft-state--failed'
                          : 'email-list-item__draft-state--draft',
                      ].join(' ')}
                      title={
                        email.handlingStatus === 'failed'
                          ? 'Send failed'
                          : 'Draft saved'
                      }
                    >
                      {email.handlingStatus === 'failed' ? (
                        <WarningFilled />
                      ) : (
                        <SaveOutlined />
                      )}
                    </span>
                  )}
                  <time>{formatMailboxTime(email.sentAt)}</time>
                </span>
                <span className="email-list-item__subject">{email.subject}</span>
                <span className="email-list-item__preview">{email.preview}</span>
                {sla && (
                  <span className={`email-list-item__sla email-list-item__sla--${sla.tone}`}>
                    <time>{formatElapsed(sla.elapsedSeconds)}</time>
                  </span>
                )}
                {sla && (
                  <span className={`email-list-item__sla-track email-list-item__sla-track--${sla.tone}`}>
                    <span style={{ width: `${sla.progress}%` }} />
                  </span>
                )}
                {email.handlingStatus === 'ignored' && (
                  <span className="email-list-item__handled">
                    No reply: {email.ignoreReason}
                  </span>
                )}
                {email.handlingStatus === 'transferred' && (
                  <span className="email-list-item__transferred">
                    Transferred to TL
                  </span>
                )}
                {email.handlingStatus === 'failed' && (
                  <span className="email-list-item__failed">Send failed</span>
                )}
              </button>
            )
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No email found" />
        )}
      </div>
      <div className="email-mailbox-panel__compose-footer">
        <button
          aria-label="Compose email"
          className="email-mailbox-panel__sendmail-button"
          style={{
            transform: `translate(${sendmailOffset.x}px, ${sendmailOffset.y}px)`,
          }}
          type="button"
          onClick={handleSendmailClick}
          onPointerDown={handleSendmailPointerDown}
          onPointerMove={handleSendmailPointerMove}
          onPointerUp={handleSendmailPointerUp}
        >
          <span>
            <MailOutlined />
          </span>
          <strong>Sendmail</strong>
        </button>
      </div>
    </aside>
  )
}

interface EmailCustomerContextProps {
  activeEmail: EmailMessage | null
  now: number
  onCompose: () => void
  onOpenCrm: (tab: CrmWorkspaceTab) => void
}

function EmailCustomerContext({
  activeEmail,
  now,
  onCompose,
  onOpenCrm,
}: EmailCustomerContextProps) {
  if (!activeEmail) {
    return (
      <aside className="inbound-left-column email-customer-context--empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select an email" />
      </aside>
    )
  }

  const customer = {
    ...activeEmail.customer,
    accessDuration: activeEmail.slaStartedAt
      ? formatElapsed(
          ((activeEmail.slaStoppedAt ?? now) - activeEmail.slaStartedAt) /
            1000,
        )
      : '-',
  }

  return (
    <LeftColumn
      customer={{ ...customer, accessChannel: 'Email' }}
      journey={customerJourney}
      nextBestActions={nextBestActions}
      tickets={ticketingHistory}
      onOpenCrm={onOpenCrm}
      onOpenVerification={() => undefined}
      onSendEmail={onCompose}
      onVerificationFinish={() => undefined}
    />
  )
}

interface EmailThreadPanelProps {
  activeMessageId: string | null
  allMessages: EmailMessage[]
  searchValue: string
  threadMessages: EmailMessage[]
  onSelect: (messageId: string) => void
  onSearchChange: (value: string) => void
}

type EmailThreadPanelTab = 'record' | 'link'

function EmailThreadPanel({
  activeMessageId,
  allMessages,
  searchValue,
  threadMessages,
  onSelect,
  onSearchChange,
}: EmailThreadPanelProps) {
  const [activeTab, setActiveTab] = useState<EmailThreadPanelTab>('record')
  const normalizedSearch = searchValue.trim().toLowerCase()
  const visibleMessages = (normalizedSearch ? allMessages : threadMessages)
    .filter((email) => {
      if (!normalizedSearch) {
        return true
      }

      return [
        email.sender,
        email.receiver,
        email.subject,
        email.preview,
        getEmailText(email.bodyHtml),
        email.customer.profile.name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
    .sort((first, second) => second.sentAt - first.sentAt)
  const visibleLinks = emailCommonLinks.filter((link) => {
    if (!normalizedSearch) {
      return true
    }

    return [link.title, link.description, link.href]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  })

  return (
    <aside className="email-thread-panel" aria-label="Email thread record">
      <header>
        <div className="email-thread-panel__tabs" role="tablist" aria-label="Email side panel">
          <button
            aria-selected={activeTab === 'record'}
            className={
              activeTab === 'record'
                ? 'email-thread-panel__tab email-thread-panel__tab--active'
                : 'email-thread-panel__tab'
            }
            role="tab"
            type="button"
            onClick={() => setActiveTab('record')}
          >
            <FileTextOutlined />
            Record
            <span>{visibleMessages.length}</span>
          </button>
          <button
            aria-selected={activeTab === 'link'}
            className={
              activeTab === 'link'
                ? 'email-thread-panel__tab email-thread-panel__tab--active'
                : 'email-thread-panel__tab'
            }
            role="tab"
            type="button"
            onClick={() => setActiveTab('link')}
          >
            <LinkOutlined />
            Link
            <span>{visibleLinks.length}</span>
          </button>
        </div>
      </header>
      <div className="email-thread-panel__search">
        <Input
          allowClear
          aria-label={
            activeTab === 'record'
              ? 'Search all email records'
              : 'Search common links'
          }
          placeholder={
            activeTab === 'record' ? 'Search all records' : 'Search common links'
          }
          prefix={<SearchOutlined />}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      {activeTab === 'record' ? (
        <div className="email-thread-panel__list" role="tabpanel">
          {visibleMessages.map((email) => (
            <button
              className={activeMessageId === email.id ? 'email-thread-item--active' : ''}
              key={email.id}
              type="button"
              onClick={() => onSelect(email.id)}
            >
              <span>
                {email.direction === 'outbound' ? <SendOutlined /> : <UserOutlined />}
                <strong>{email.sender}</strong>
                <time>{formatMailboxTime(email.sentAt)}</time>
              </span>
              <em>{email.subject}</em>
              <small>{email.preview}</small>
            </button>
          ))}
        </div>
      ) : (
        <div className="email-thread-panel__links" role="tabpanel">
          {visibleLinks.map((link) => (
            <a href={link.href} key={link.id} rel="noreferrer" target="_blank">
              <strong>{link.title}</strong>
              <span>{link.description}</span>
              <small>{link.href.replace(/^https?:\/\//, '')}</small>
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}

interface EmailTransferModalProps {
  open: boolean
  onClose: () => void
  onTransfer: (agent: (typeof transferAgents)[number]) => void
}

function EmailTransferModal({
  open,
  onClose,
  onTransfer,
}: EmailTransferModalProps) {
  const [searchValue, setSearchValue] = useState('')
  const [skillName, setSkillName] = useState('all')
  const [status, setStatus] = useState('all')

  if (!open) {
    return null
  }

  const normalizedSearch = searchValue.trim().toLowerCase()
  const visibleAgents = transferAgents.filter((agent) => {
    const matchesSearch =
      !normalizedSearch ||
      [agent.employeeId, agent.name]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    const matchesSkill = skillName === 'all' || agent.skillName === skillName
    const matchesStatus = status === 'all' || agent.status === status

    return matchesSearch && matchesSkill && matchesStatus
  })

  const resetFilters = () => {
    setSearchValue('')
    setSkillName('all')
    setStatus('all')
  }

  return (
    <div className="email-transfer-modal-overlay" role="presentation">
      <section className="email-transfer-modal" aria-label="Transfer">
        <header>
          <h2>Transfer</h2>
          <button aria-label="Close transfer modal" type="button" onClick={onClose}>
            <CloseOutlined />
          </button>
        </header>

        <div className="email-transfer-modal__filters">
          <button aria-label="Reset transfer filters" type="button" onClick={resetFilters}>
            <ReloadOutlined />
          </button>
          <Input
            allowClear
            aria-label="Search employee"
            placeholder="Employee ID or Name"
            prefix={<SearchOutlined />}
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Select
            aria-label="Skill name"
            options={transferSkillOptions}
            value={skillName}
            onChange={setSkillName}
          />
          <Select
            aria-label="Agent status"
            options={transferStatusOptions}
            value={status}
            onChange={setStatus}
          />
          <BaseButton icon={<SearchOutlined />} variant="primary">
            Srh
          </BaseButton>
        </div>

        <div className="email-transfer-modal__table">
          <div className="email-transfer-modal__table-head">
            <span>Employee ID</span>
            <span>Name</span>
            <span>Skill Name</span>
            <span>Extension</span>
            <span>Extension</span>
            <span>Actions</span>
          </div>
          {visibleAgents.length > 0 ? (
            visibleAgents.map((agent) => (
              <div className="email-transfer-modal__table-row" key={agent.id}>
                <span>{agent.employeeId}</span>
                <span>
                  {agent.name}
                  <em>{agent.role}</em>
                </span>
                <span>{agent.skillName}</span>
                <span>{agent.extension}</span>
                <span>
                  <i />
                  {agent.status}
                </span>
                <span>
                  <button type="button" onClick={() => onTransfer(agent)}>
                    <SendOutlined />
                    Transfer
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="email-transfer-modal__empty">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No transfer agent found" />
            </div>
          )}
        </div>

        <footer className="email-transfer-modal__pager">
          <span>Total: {visibleAgents.length} items</span>
          <span>Per page</span>
          <Select
            aria-label="Items per page"
            options={[{ label: '10', value: '10' }]}
            value="10"
          />
          <span>items</span>
          <div>
            <button aria-label="Previous page" disabled type="button">
              <LeftOutlined />
            </button>
            <button aria-current="page" type="button">1</button>
            <button aria-label="Next page" disabled type="button">
              <RightOutlined />
            </button>
          </div>
          <span>Go to</span>
          <Input aria-label="Go to page" value="1" readOnly />
          <span>page</span>
        </footer>
      </section>
    </div>
  )
}

interface EmailDetailProps {
  email: EmailMessage | null
  now: number
  onEditDraft: () => void
  onIgnore: (reason: EmailIgnoreReason) => void
  onRecover: () => void
  onReply: () => void
  onTransfer: () => void
}

function EmailDetail({
  email,
  now,
  onEditDraft,
  onIgnore,
  onRecover,
  onReply,
  onTransfer,
}: EmailDetailProps) {
  if (!email) {
    return (
      <div className="email-detail email-detail--empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Select an email to view" />
      </div>
    )
  }

  const sla = getSlaState(email, now)
  const ignoreItems: MenuProps['items'] = [
    { key: 'AD', label: 'AD' },
    { key: 'Spam', label: 'Spam' },
    { key: 'Sales Email', label: 'Sales Email' },
  ]
  const canHandleInboxEmail =
    email.folder === 'inbox' &&
    email.handlingStatus !== 'ignored' &&
    email.handlingStatus !== 'transferred'

  return (
    <article className="email-detail">
      <div className="email-detail__actions">
        {canHandleInboxEmail && (
          <>
            <BaseButton icon={<SendOutlined />} size="small" onClick={onTransfer}>
              Transfer
            </BaseButton>
            <span className="email-detail__actions-spacer" />
            <BaseButton size="small" variant="primary" onClick={onReply}>
              Reply
            </BaseButton>
            <Dropdown
              menu={{
                items: ignoreItems,
                onClick: ({ key }) => onIgnore(key as EmailIgnoreReason),
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <BaseButton danger size="small">
                No Reply
              </BaseButton>
            </Dropdown>
          </>
        )}
        {email.folder === 'sent' && (
          <BaseButton icon={<SendOutlined />} size="small" onClick={onTransfer}>
            Transfer
          </BaseButton>
        )}
        {email.folder === 'drafts' && (
          <BaseButton icon={<EditOutlined />} size="small" variant="primary" onClick={onEditDraft}>
            Edit
          </BaseButton>
        )}
        {email.folder === 'trash' && (
          <BaseButton icon={<RollbackOutlined />} size="small" variant="primary" onClick={onRecover}>
            Restore
          </BaseButton>
        )}
        {getHandlingBadge(email)}
      </div>

      <header className="email-detail__header">
        <div>
          <strong>{email.subject}</strong>
          {email.hasAttachment && (
            <span className="email-detail__attachment">Attachment included</span>
          )}
        </div>
        <dl>
          <div>
            <dt>Sender</dt>
            <dd>{email.sender}</dd>
          </div>
          <div>
            <dt>Receiver</dt>
            <dd>{email.receiver}</dd>
          </div>
          <div>
            <dt>Sending Time</dt>
            <dd>{formatEmailTime(email.sentAt)}</dd>
          </div>
        </dl>
        {sla && (
          <div className={`email-detail__sla email-detail__sla--${sla.tone}`}>
            <ClockCircleOutlined />
            <span>SLA elapsed</span>
            <strong>{formatElapsed(sla.elapsedSeconds)}</strong>
          </div>
        )}
      </header>

      <div
        className="email-message-rich"
        dangerouslySetInnerHTML={{ __html: sanitizeEmailHtml(email.bodyHtml) }}
      />
    </article>
  )
}

export function EmailPage() {
  const { notify } = useOperationFeedback()
  const [messages, setMessages] = useState<EmailMessage[]>(() =>
    cloneMessages(createEmailDemoMessages()),
  )
  const [activeFolder, setActiveFolder] = useState<EmailFolder>('inbox')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    'email-inbox-001',
  )
  const [searchValue, setSearchValue] = useState('')
  const [isMailboxCollapsed, setIsMailboxCollapsed] = useState(false)
  const [sentStatusFilter, setSentStatusFilter] = useState<EmailStatus | 'all'>(
    'all',
  )
  const [threadSearchValue, setThreadSearchValue] = useState('')
  const [crmWorkspace, setCrmWorkspace] = useState<{
    activeKey: string
    tabs: CrmWorkspaceTab[]
  }>({
    activeKey: CONVERSATION_TAB_KEY,
    tabs: [],
  })
  const [composeDraft, setComposeDraft] = useState<EmailComposeDraft | null>(null)
  const [composeModalDraft, setComposeModalDraft] =
    useState<EmailComposeDraft | null>(null)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isCwuOpen, setIsCwuOpen] = useState(false)
  const hasRunningSla = messages.some(
    (email) => email.slaStartedAt && !email.slaStoppedAt,
  )
  const now = useNow(hasRunningSla)

  const selectedEmail =
    messages.find((email) => email.id === selectedMessageId) ?? null
  const threadMessages = selectedEmail
    ? messages
        .filter((email) => email.threadId === selectedEmail.threadId)
        .sort((first, second) => second.sentAt - first.sentAt)
    : []

  const showNotice = (text: string, tone: 'success' | 'info' = 'success') => {
    notify(text, tone)
  }

  const openComposeModal = (receiverLocked = false) => {
    if (!selectedEmail) {
      showNotice('Select an email before composing a proactive email.', 'info')
      return
    }

    setComposeDraft(null)
    setComposeModalDraft(
      createComposeDraft('new', selectedEmail, { receiverLocked }),
    )
  }

  const selectMessage = (messageId: string) => {
    setSelectedMessageId(messageId)
    setComposeDraft(null)
    setComposeModalDraft(null)
    setIsTransferOpen(false)
    setMessages((current) =>
      current.map((email) =>
        email.id === messageId
          ? {
              ...email,
              handlingStatus:
                email.handlingStatus === 'new' ? 'read' : email.handlingStatus,
              isRead: true,
            }
          : email,
      ),
    )
  }

  const changeFolder = (folder: EmailFolder) => {
    const firstMessage = messages
      .filter((email) => email.folder === folder)
      .sort((first, second) => second.sentAt - first.sentAt)[0]
    setActiveFolder(folder)
    setSearchValue('')
    setSentStatusFilter('all')
    setComposeDraft(null)
    setComposeModalDraft(null)
    setIsTransferOpen(false)
    setSelectedMessageId(firstMessage?.id ?? null)
    setCrmWorkspace((current) => ({
      ...current,
      activeKey: CONVERSATION_TAB_KEY,
    }))
  }

  const openCrm = (tab: CrmWorkspaceTab) => {
    setCrmWorkspace((current) => ({
      activeKey: tab.key,
      tabs: current.tabs.some((item) => item.key === tab.key)
        ? current.tabs
        : [...current.tabs, tab],
    }))
  }

  const closeCrmTab = (targetKey: string) => {
    setCrmWorkspace((current) => {
      const removedIndex = current.tabs.findIndex(
        (tab) => tab.key === targetKey,
      )
      const tabs = current.tabs.filter((tab) => tab.key !== targetKey)
      const nextActiveTab = tabs[Math.max(0, removedIndex - 1)] ?? tabs[0]

      return {
        activeKey:
          current.activeKey === targetKey
            ? nextActiveTab?.key ?? CRM_TAB_KEY
            : current.activeKey,
        tabs,
      }
    })
  }

  const createDraftMessage = (draft: EmailComposeDraft): EmailMessage => {
    const source = draft.sourceMessageId
      ? messages.find((email) => email.id === draft.sourceMessageId)
      : selectedEmail
    const customer = source?.customer ?? selectedEmail?.customer

    if (!customer) {
      throw new Error('Email customer context is unavailable.')
    }

    const bodyHtml = sanitizeEmailHtml(draft.bodyHtml)
    const shouldTrackDraftSla =
      (draft.mode === 'reply' || (draft.mode === 'draft' && source?.folder === 'drafts')) &&
      Boolean(source?.slaStartedAt) &&
      !source?.slaStoppedAt

    return {
      id: draft.draftMessageId ?? `email-draft-${Date.now()}`,
      attachmentName: draft.attachmentName,
      bodyHtml,
      customer: {
        ...customer,
        profile: { ...customer.profile },
      },
      direction: 'outbound',
      emailStatus: draft.emailStatus,
      folder: 'drafts',
      transferSourceMessageId:
        draft.mode === 'transfer' ? draft.sourceMessageId : undefined,
      hasAttachment: Boolean(draft.attachmentName),
      handlingStatus: 'draft',
      isRead: true,
      language: draft.language,
      preview: getEmailText(bodyHtml).slice(0, 96) || 'Empty draft',
      receiver: draft.receiver,
      sender: draft.sender,
      slaStartedAt: shouldTrackDraftSla ? source?.slaStartedAt : undefined,
      slaTargetSeconds: shouldTrackDraftSla ? source?.slaTargetSeconds : undefined,
      sentAt: Date.now(),
      subject: draft.subject || '(No subject)',
      threadId: draft.threadId,
    }
  }

  const saveComposeDraft = (draft: EmailComposeDraft) => {
    const draftMessage = createDraftMessage(draft)
    setMessages((current) => {
      const withoutExistingDraft = draft.draftMessageId
        ? current.filter((email) => email.id !== draft.draftMessageId)
        : current
      return [...withoutExistingDraft, draftMessage]
    })
    setComposeDraft(null)
    setComposeModalDraft(null)
    setActiveFolder('drafts')
    setSelectedMessageId(draftMessage.id)
    setCrmWorkspace((current) => ({
      ...current,
      activeKey: CONVERSATION_TAB_KEY,
    }))
    showNotice('Draft saved in the Drafts folder.')
  }

  const autoSaveComposeDraft = (
    draft: EmailComposeDraft,
    setActiveDraft: (draft: EmailComposeDraft) => void,
  ) => {
    const draftMessage = createDraftMessage(draft)
    const savedDraft = {
      ...draft,
      autoSavedAt: draftMessage.sentAt,
      bodyHtml: draftMessage.bodyHtml,
      draftMessageId: draftMessage.id,
    }

    setMessages((current) => {
      const withoutExistingDraft = current.filter(
        (email) => email.id !== draftMessage.id,
      )
      return [...withoutExistingDraft, draftMessage]
    })

    setActiveDraft(savedDraft)
    return savedDraft
  }

  const sendSatisfactionSurvey = () => {
    showNotice('Satisfaction survey sent for the closed email.', 'info')
  }

  const sendComposeDraft = (draft: EmailComposeDraft) => {
    const source = draft.sourceMessageId
      ? messages.find((email) => email.id === draft.sourceMessageId)
      : selectedEmail

    const draftMessage = createDraftMessage(draft)
    const sentMessage: EmailMessage = {
      ...draftMessage,
      id: `email-sent-${Date.now()}`,
      folder: 'sent',
      hasAttachment: Boolean(draft.attachmentName),
      handlingStatus: 'sent',
      sentAt: Date.now(),
    }

    setMessages((current) =>
      current
        .filter((email) => email.id !== draft.draftMessageId)
        .map((email) =>
          draft.mode === 'reply' && email.id === source?.id
            ? {
                ...email,
                emailStatus: draft.emailStatus,
                handlingStatus: 'replied',
                isRead: true,
                repliedAt: Date.now(),
                slaStoppedAt: Date.now(),
              }
            : email,
        )
        .concat(sentMessage),
    )
    setComposeDraft(null)
    setComposeModalDraft(null)
    setSelectedMessageId(sentMessage.id)
    setActiveFolder('sent')
    setCrmWorkspace((current) => ({
      ...current,
      activeKey: CONVERSATION_TAB_KEY,
    }))
    showNotice('Email sent and added to the conversation record.')
  }

  const openTransferModal = () => {
    if (!selectedEmail) {
      showNotice('Select an email before transferring.', 'info')
      return
    }

    setComposeDraft(null)
    setComposeModalDraft(null)
    setIsTransferOpen(true)
  }

  const transferEmail = (agent: (typeof transferAgents)[number]) => {
    if (!selectedEmail) {
      return
    }

    const transferredAt = Date.now()

    setMessages((current) =>
      current.map((email) =>
        email.id === selectedEmail.id
          ? {
              ...email,
              handlingStatus: 'transferred',
              isRead: true,
              slaStoppedAt: email.slaStoppedAt ?? transferredAt,
            }
          : email,
      ),
    )
    setIsTransferOpen(false)
    showNotice(`Email transferred to ${agent.name} (${agent.role}).`)
  }

  const ignoreEmail = (reason: EmailIgnoreReason) => {
    if (!selectedEmail) {
      return
    }

    setMessages((current) =>
      current.map((email) =>
        email.id === selectedEmail.id
          ? {
              ...email,
              folder: 'trash',
              handlingStatus: 'ignored',
              ignoreReason: reason,
              isRead: true,
              originalFolder:
                email.folder === 'trash' ? 'inbox' : email.folder,
              slaStoppedAt: Date.now(),
            }
          : email,
      ),
    )
    setActiveFolder('trash')
    showNotice(`Email marked as No Reply: ${reason}.`, 'info')
  }

  const recoverEmail = () => {
    if (!selectedEmail || selectedEmail.folder !== 'trash') {
      return
    }

    const recoveredFolder = selectedEmail.originalFolder ?? 'inbox'
    setMessages((current) =>
      current.map((email) =>
        email.id === selectedEmail.id
          ? {
              ...email,
              folder: recoveredFolder,
              handlingStatus: email.direction === 'inbound' ? 'read' : 'sent',
              ignoreReason: undefined,
              originalFolder: undefined,
            }
          : email,
      ),
    )
    setActiveFolder(recoveredFolder)
    showNotice('Email restored to the mailbox.')
  }

  const openCwu = () => {
    setIsCwuOpen(true)
  }

  const confirmCwu = (draft: TicketRegistrationDraft) => {
    if (!selectedEmail) {
      return
    }

    setMessages((current) =>
      current.map((email) =>
        email.id === selectedEmail.id
          ? {
              ...email,
              cwu: {
                caseCategory: draft.caseCategory,
                note: draft.note,
                product: draft.product,
                registeredAt: Date.now(),
                summary: draft.summary,
              },
            }
          : email,
      ),
    )
    notify('Ticket saved to CRM.')
  }

  const mailContent = (
    <div className="email-mail-workspace">
      {composeDraft ? (
        <EmailComposePanel
          draft={composeDraft}
          onAutoSave={(draft) => autoSaveComposeDraft(draft, setComposeDraft)}
          onCancel={() => setComposeDraft(null)}
          onChange={setComposeDraft}
          onSave={saveComposeDraft}
          onSend={sendComposeDraft}
          onSendSurvey={sendSatisfactionSurvey}
        />
      ) : (
        <EmailDetail
          email={selectedEmail}
          now={now}
          onEditDraft={() =>
            selectedEmail && setComposeDraft(createComposeDraft('draft', selectedEmail))
          }
          onIgnore={ignoreEmail}
          onRecover={recoverEmail}
          onReply={() =>
            selectedEmail && setComposeDraft(createComposeDraft('reply', selectedEmail))
          }
          onTransfer={openTransferModal}
        />
      )}
      <EmailThreadPanel
        allMessages={messages}
        activeMessageId={selectedMessageId}
        searchValue={threadSearchValue}
        threadMessages={threadMessages}
        onSelect={selectMessage}
        onSearchChange={setThreadSearchValue}
      />
    </div>
  )

  return (
    <section
      className={[
        'email-page',
        isMailboxCollapsed ? 'email-page--mailbox-collapsed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Email channel workspace"
    >
      <MailboxPanel
        activeFolder={activeFolder}
        collapsed={isMailboxCollapsed}
        messages={messages}
        now={now}
        searchValue={searchValue}
        selectedMessageId={selectedMessageId}
        sentStatusFilter={sentStatusFilter}
        onCompose={() => openComposeModal(false)}
        onCollapsedChange={setIsMailboxCollapsed}
        onFolderChange={changeFolder}
        onRefresh={() => {
          setSearchValue('')
          showNotice('Mailbox refreshed.', 'info')
        }}
        onSearchChange={setSearchValue}
        onSelectMessage={selectMessage}
        onSentStatusFilterChange={setSentStatusFilter}
      />

      <EmailCustomerContext
        activeEmail={selectedEmail}
        now={now}
        onCompose={() => openComposeModal(true)}
        onOpenCrm={openCrm}
      />

      <CrmPanel
        activeKey={crmWorkspace.activeKey}
        conversationContent={mailContent}
        conversationIcon={<MailOutlined />}
        conversationLabel="Email"
        tabBarExtraContent={
          <BaseButton
            disabled={!selectedEmail}
            size="small"
            variant="primary"
            onClick={openCwu}
          >
            Ticket
          </BaseButton>
        }
        workspaceTabs={crmWorkspace.tabs}
        onActiveKeyChange={(activeKey) =>
          setCrmWorkspace((current) => ({ ...current, activeKey }))
        }
        onCloseTab={closeCrmTab}
      />

      <EmailComposeModal
        draft={composeModalDraft}
        onAutoSave={(draft) => autoSaveComposeDraft(draft, setComposeModalDraft)}
        onCancel={() => setComposeModalDraft(null)}
        onChange={setComposeModalDraft}
        onSave={saveComposeDraft}
        onSend={sendComposeDraft}
        onSendSurvey={sendSatisfactionSurvey}
      />

      {isTransferOpen && (
        <EmailTransferModal
          open
          onClose={() => setIsTransferOpen(false)}
          onTransfer={transferEmail}
        />
      )}

      <TicketRegistrationDrawer
        contextLabel={selectedEmail?.subject}
        open={isCwuOpen}
        onClose={() => setIsCwuOpen(false)}
        onConfirm={confirmCwu}
      />
    </section>
  )
}
