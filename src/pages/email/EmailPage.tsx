import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FilterOutlined,
  ForwardOutlined,
  InboxOutlined,
  LinkOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  RobotOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  SendOutlined,
  UserOutlined,
  WarningFilled,
} from '@ant-design/icons'
import {
  Badge,
  Checkbox,
  Drawer,
  Dropdown,
  Empty,
  Input,
  Select,
  Tooltip,
} from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BaseButton,
  StatusBadge,
} from '../../components'
import { useNow } from '../../hooks/useNow'
import { createEmailDemoMessages, emailTemplates } from '../../mock/email'
import {
  customerJourney,
  nextBestActions,
  quickActions,
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

const BANK_EMAIL_ACCOUNT = 'contact@bank1.demo'
const BANK_PUBLIC_WEBSITE = 'https://www.bca.co.id'
const TEAM_LEADER_EMAIL = 'tl.budi.kartika@bank1.demo'
const AGENT_NAME = 'Budi Kartika'
const DEFAULT_EMAIL_LANGUAGE: EmailLanguage = 'ID'

const emailLanguageOptions: Array<{ label: string; value: EmailLanguage }> = [
  { label: 'ID', value: 'ID' },
  { label: 'EN', value: 'EN' },
]

const emailStatusOptions: Array<{ label: string; value: EmailStatus }> = [
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' },
]

const emailStatusLabels: Record<EmailStatus, string> = {
  closed: 'Closed',
  open: 'Open',
  pending: 'Pending',
}

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

const cwuBusinessTypeOptions = [
  'Credit Card',
  'Investment',
  'Wealth Management',
  'Account Opening',
  'Others',
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
          businessTypes: [...email.cwu.businessTypes],
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

function stripEmailSignature(html: string) {
  return sanitizeEmailHtml(html)
    .replace(
      /<section class="email-signature"[\s\S]*?<\/section>/gi,
      '',
    )
    .trim()
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
        <img src="/favicon.svg" alt="BANK 1" width="28" height="28" />
        <a href="${BANK_PUBLIC_WEBSITE}" target="_blank" rel="noreferrer">${BANK_PUBLIC_WEBSITE}</a>
      </p>
    </section>
  `
}

function buildEmailBody(bodyHtml: string, language: EmailLanguage) {
  return `${stripEmailSignature(bodyHtml)}${createEmailSignature(language)}`
}

function getTemplateBody(templateId: string | undefined, language: EmailLanguage) {
  const template = emailTemplates.find((item) => item.id === templateId)

  if (!template) {
    return ''
  }

  return template.localizedBodyHtml?.[language] ?? template.bodyHtml
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

  if (email.cwu) {
    return <StatusBadge label="Ticket saved" size="small" status="selected" />
  }

  return null
}

function createComposeDraft(
  mode: EmailComposeDraft['mode'],
  source?: EmailMessage,
): EmailComposeDraft {
  const replySubject = source?.subject.replace(/^(RE|FW):\s*/i, '') ?? ''

  if (mode === 'draft' && source) {
    const forwardSourceMessageId = source.forwardSourceMessageId
    const language = source.language ?? DEFAULT_EMAIL_LANGUAGE

    return {
      bodyHtml: source.bodyHtml,
      draftMessageId: source.id,
      emailStatus: source.emailStatus,
      language,
      mode: forwardSourceMessageId ? 'forward' : mode,
      receiver: source.receiver,
      sender: source.sender,
      sourceMessageId: forwardSourceMessageId ?? source.id,
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
      sender: BANK_EMAIL_ACCOUNT,
      sourceMessageId: source.id,
      subject: `RE: ${replySubject}`,
      threadId: source.threadId,
    }
  }

  if (mode === 'forward' && source) {
    return {
      bodyHtml: `${createEmailSignature(DEFAULT_EMAIL_LANGUAGE)}<blockquote><strong>Forwarded message</strong><br>${sanitizeEmailHtml(source.bodyHtml)}</blockquote>`,
      emailStatus: 'pending',
      language: DEFAULT_EMAIL_LANGUAGE,
      mode,
      receiver: TEAM_LEADER_EMAIL,
      sender: BANK_EMAIL_ACCOUNT,
      sourceMessageId: source.id,
      subject: `FW: ${replySubject}`,
      threadId: source.threadId,
    }
  }

  return {
    bodyHtml: createEmailSignature(DEFAULT_EMAIL_LANGUAGE),
    language: DEFAULT_EMAIL_LANGUAGE,
    mode: 'new',
    receiver: source?.customer.profile.email ?? '',
    sender: BANK_EMAIL_ACCOUNT,
    subject: '',
    threadId: `email-thread-new-${Date.now()}`,
  }
}

interface EmailComposePanelContentProps {
  draft: EmailComposeDraft
  onAutoSave: (draft: EmailComposeDraft) => EmailComposeDraft
  onCancel: () => void
  onChange: (draft: EmailComposeDraft) => void
  onSave: (draft: EmailComposeDraft) => void
  onSend: (draft: EmailComposeDraft) => void
  onSendSurvey: (draft: EmailComposeDraft) => void
}

function EmailComposePanelContent({
  draft,
  onAutoSave,
  onCancel,
  onChange,
  onSave,
  onSend,
  onSendSurvey,
}: EmailComposePanelContentProps) {
  const [fields, setFields] = useState<EmailComposeDraft>(() => ({ ...draft }))
  const [error, setError] = useState('')
  const [templateAttachmentError, setTemplateAttachmentError] = useState('')
  const [templateConfigOpen, setTemplateConfigOpen] = useState(false)
  const [autoSaveLabel, setAutoSaveLabel] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const autoSaveTimerRef = useRef<number | null>(null)
  const lastAutoSavedSignatureRef = useRef('')

  const readEditorHtml = useCallback(
    () => sanitizeEmailHtml(editorRef.current?.innerHTML ?? fields.bodyHtml),
    [fields.bodyHtml],
  )

  const updateFields = (patch: Partial<EmailComposeDraft>) => {
    setFields((current) => {
      const next = { ...current, ...patch }
      onChange(next)
      return next
    })
  }

  const normalizedDraft = useCallback(
    () => ({
      ...fields,
      bodyHtml: readEditorHtml(),
      receiver: fields.receiver.trim(),
      subject: fields.subject.trim(),
    }),
    [fields, readEditorHtml],
  )

  useEffect(
    () => () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const nextDraft = normalizedDraft()
    const signature = JSON.stringify({
      attachmentName: nextDraft.attachmentName,
      bodyHtml: nextDraft.bodyHtml,
      emailStatus: nextDraft.emailStatus,
      language: nextDraft.language,
      receiver: nextDraft.receiver,
      subject: nextDraft.subject,
      templateId: nextDraft.templateId,
    })

    if (
      signature === lastAutoSavedSignatureRef.current ||
      (!nextDraft.receiver && !nextDraft.subject && !getEmailText(nextDraft.bodyHtml))
    ) {
      return
    }

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      const savedDraft = onAutoSave(nextDraft)
      lastAutoSavedSignatureRef.current = JSON.stringify({
        attachmentName: savedDraft.attachmentName,
        bodyHtml: savedDraft.bodyHtml,
        emailStatus: savedDraft.emailStatus,
        language: savedDraft.language,
        receiver: savedDraft.receiver,
        subject: savedDraft.subject,
        templateId: savedDraft.templateId,
      })
      if (savedDraft.draftMessageId !== fields.draftMessageId) {
        setFields(savedDraft)
        onChange(savedDraft)
      }
      setAutoSaveLabel(`Autosaved ${formatMailboxTime(Date.now())}`)
    }, 1200)

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [
    fields.attachmentName,
    fields.bodyHtml,
    fields.emailStatus,
    fields.language,
    fields.receiver,
    fields.subject,
    fields.templateId,
    fields.draftMessageId,
    normalizedDraft,
    onAutoSave,
    onChange,
  ])

  const submit = (action: 'save' | 'send') => {
    const nextDraft = normalizedDraft()

    if (action === 'send' && !nextDraft.receiver) {
      setError('Receiver is required before sending.')
      return
    }

    if (action === 'send' && !nextDraft.subject) {
      setError('Subject is required before sending.')
      return
    }

    if (action === 'send' && !getEmailText(nextDraft.bodyHtml)) {
      setError('Email content is required before sending.')
      return
    }

    if (action === 'send' && !nextDraft.emailStatus) {
      setError('Select an email status before sending.')
      return
    }

    setError('')
    if (action === 'save') {
      onSave(nextDraft)
    } else {
      onSend(nextDraft)
    }
  }

  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find((item) => item.id === templateId)
    if (!template) {
      return
    }

    const nextHtml = buildEmailBody(
      template.localizedBodyHtml?.[fields.language] ?? template.bodyHtml,
      fields.language,
    )
    updateFields({
      attachmentName: template.attachmentName,
      bodyHtml: nextHtml,
      templateId,
    })
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml
    }
  }

  const changeLanguage = (language: EmailLanguage) => {
    const templateBody = getTemplateBody(fields.templateId, language)
    const nextHtml = buildEmailBody(templateBody || fields.bodyHtml, language)

    updateFields({
      bodyHtml: nextHtml,
      language,
    })
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml
    }
  }

  const chooseTemplateAttachment = (fileList: FileList | null) => {
    const file = fileList?.[0]

    if (!file) {
      return
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setTemplateAttachmentError('Only PDF attachments can be selected.')
      return
    }

    setTemplateAttachmentError('')
    updateFields({ attachmentName: file.name })
  }

  const runEditorCommand = (command: string) => {
    editorRef.current?.focus()
    document.execCommand(command)
    updateFields({ bodyHtml: readEditorHtml() })
  }

  const title =
    fields.mode === 'reply'
      ? 'Reply Email'
      : fields.mode === 'forward'
        ? 'Forward Email'
        : fields.mode === 'draft'
          ? 'Edit Draft'
          : 'New Email'
  const canSendSurvey = fields.emailStatus === 'closed'

  return (
    <section className="email-compose-inline" aria-label={title}>
      <header className="email-compose-inline__header">
        <div>
          <MailOutlined />
          <strong>{title}</strong>
          {autoSaveLabel && <span>{autoSaveLabel}</span>}
        </div>
        <BaseButton icon={<CloseOutlined />} size="small" onClick={onCancel}>
          Close
        </BaseButton>
      </header>

      <div className="email-compose">
        <div className="email-compose__fields">
          <label>
            <span>Receiver</span>
            <Input
              disabled={fields.mode === 'forward'}
              placeholder="customer@example.com"
              value={fields.receiver}
              onChange={(event) =>
                updateFields({ receiver: event.target.value })
              }
            />
          </label>
          <label>
            <span>Subject</span>
            <Input
              value={fields.subject}
              onChange={(event) =>
                updateFields({ subject: event.target.value })
              }
            />
          </label>
          <label>
            <span>Sender</span>
            <Input
              disabled
              value={fields.sender}
            />
          </label>
          <label>
            <span>Email Status</span>
            <Select
              allowClear
              options={emailStatusOptions}
              placeholder="Select status before sending"
              value={fields.emailStatus}
              onChange={(emailStatus) =>
                updateFields({ emailStatus: emailStatus as EmailStatus | undefined })
              }
            />
          </label>
          <label>
            <span>Template</span>
            <Select
              allowClear
              options={emailTemplates.map((template) => ({
                label: template.name,
                value: template.id,
              }))}
              placeholder="Select a response template"
              value={fields.templateId}
              onChange={(templateId) => {
                if (templateId) {
                  applyTemplate(templateId)
                } else {
                  updateFields({ templateId: undefined })
                }
              }}
            />
          </label>
          <label>
            <span>Language</span>
            <div className="email-compose__language-switch">
              {emailLanguageOptions.map((option) => (
                <button
                  aria-pressed={fields.language === option.value}
                  className={
                    fields.language === option.value
                      ? 'email-compose__language-switch-item--active'
                      : ''
                  }
                  key={option.value}
                  type="button"
                  onClick={() => changeLanguage(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="email-compose__editor-shell">
          <div className="email-compose__toolbar" aria-label="Email formatting toolbar">
            {[
              ['bold', 'B', 'Bold'],
              ['italic', 'I', 'Italic'],
              ['underline', 'U', 'Underline'],
              ['insertUnorderedList', '\u2022', 'Bulleted list'],
              ['justifyLeft', '\u2261', 'Align left'],
            ].map(([command, label, titleText]) => (
              <button
                aria-label={titleText}
                key={command}
                title={titleText}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  runEditorCommand(command)
                }}
              >
                {label}
              </button>
            ))}
            <span className="email-compose__toolbar-divider" />
            <button
              aria-label="Template config"
              title="Template config"
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                setTemplateConfigOpen((open) => !open)
              }}
            >
              <FilePdfOutlined />
            </button>
          </div>
          {templateConfigOpen && (
            <div className="email-compose__template-config">
              <div>
                <strong>Template Config</strong>
                <span>EN / ID template content and PDF attachment only.</span>
              </div>
              <label>
                <span>Template language</span>
                <Select
                  options={emailLanguageOptions}
                  value={fields.language}
                  onChange={(language) => changeLanguage(language)}
                />
              </label>
              <label>
                <span>Attachment</span>
                <input
                  accept="application/pdf,.pdf"
                  type="file"
                  onChange={(event) => chooseTemplateAttachment(event.target.files)}
                />
              </label>
              {fields.attachmentName && (
                <em>
                  <FilePdfOutlined />
                  {fields.attachmentName}
                </em>
              )}
              {templateAttachmentError && (
                <small>{templateAttachmentError}</small>
              )}
            </div>
          )}
          <div
            aria-label="Email content"
            className="email-compose__editor"
            contentEditable
            dangerouslySetInnerHTML={{ __html: fields.bodyHtml }}
            ref={editorRef}
            role="textbox"
            suppressContentEditableWarning
            onInput={() => {
              setError('')
              updateFields({ bodyHtml: readEditorHtml() })
            }}
          />
        </div>

        {error && <div className="email-compose__error">{error}</div>}

        <footer className="email-compose__footer">
          {fields.mode === 'forward' && (
            <span className="email-compose__forward-note">
              Forwarding is limited to your TL: {TEAM_LEADER_EMAIL}
            </span>
          )}
          <BaseButton
            disabled={!canSendSurvey}
            variant="secondary"
            onClick={() => onSendSurvey(normalizedDraft())}
          >
            Send Survey
          </BaseButton>
          <BaseButton variant="secondary" onClick={onCancel}>
            Cancel
          </BaseButton>
          <BaseButton variant="secondary" onClick={() => submit('save')}>
            Save Draft
          </BaseButton>
          <BaseButton
            disabled={!fields.emailStatus}
            icon={<SendOutlined />}
            variant="primary"
            onClick={() => submit('send')}
          >
            Send
          </BaseButton>
        </footer>
      </div>
    </section>
  )
}

interface EmailComposePanelProps
  extends Omit<EmailComposePanelContentProps, 'draft'> {
  draft: EmailComposeDraft | null
}

function EmailComposePanel({ draft, ...props }: EmailComposePanelProps) {
  if (!draft) {
    return null
  }

  const composeKey = [
    draft.mode,
    draft.draftMessageId,
    draft.sourceMessageId,
    draft.threadId,
  ].join(':')

  return <EmailComposePanelContent draft={draft} key={composeKey} {...props} />
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
          onClick={() => onCollapsedChange(!collapsed)}
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
            onClick={() => onFolderChange(folder.key)}
          >
            <Badge
              count={folder.key === 'inbox' ? folderCounts.inbox : 0}
              offset={[4, -2]}
              size="small"
            >
              <span className={`email-folder-button__icon email-folder-button__icon--${folder.key}`}>
                {folder.icon}
              </span>
            </Badge>
            <span>{folder.label}</span>
            {folder.key !== 'inbox' && folderCounts[folder.key] > 0 && (
              <small>{folderCounts[folder.key]}</small>
            )}
          </button>
        ))}
      </div>

      <div className="email-mailbox-panel__search">
        <Input
          allowClear
          aria-label="Search email"
          placeholder="Search email"
          prefix={<SearchOutlined />}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Tooltip title="Refresh mailbox">
          <button aria-label="Refresh mailbox" type="button" onClick={onRefresh}>
            <ReloadOutlined />
          </button>
        </Tooltip>
      </div>

      {activeFolder === 'sent' && (
        <div className="email-mailbox-panel__sent-filter">
          <FilterOutlined />
          <Select
            options={[
              { label: 'All Status', value: 'all' },
              ...emailStatusOptions,
            ]}
            value={sentStatusFilter}
            onChange={(status) =>
              onSentStatusFilterChange(status as EmailStatus | 'all')
            }
          />
        </div>
      )}

      <div className="email-mailbox-panel__list">
        {visibleMessages.length > 0 ? (
          visibleMessages.map((email) => {
            const sla = getSlaState(email, now)
            const displayContact =
              email.direction === 'outbound'
                ? email.receiver
                : email.customer.profile.name

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
                    <span className="email-list-item__sla-track">
                      <span style={{ width: `${sla.progress}%` }} />
                    </span>
                    <time>{formatElapsed(sla.elapsedSeconds)}</time>
                  </span>
                )}
                {email.handlingStatus === 'ignored' && (
                  <span className="email-list-item__handled">
                    No reply: {email.ignoreReason}
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
          type="button"
          onClick={onCompose}
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
      quickActions={quickActions}
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

function EmailThreadPanel({
  activeMessageId,
  allMessages,
  searchValue,
  threadMessages,
  onSelect,
  onSearchChange,
}: EmailThreadPanelProps) {
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

  return (
    <aside className="email-thread-panel" aria-label="Email thread record">
      <header>
        <span className="email-thread-panel__link-label">
          <LinkOutlined />
          Link
        </span>
        <FileTextOutlined />
        <strong>Record</strong>
        <span>{visibleMessages.length}</span>
      </header>
      <div className="email-thread-panel__search">
        <Input
          allowClear
          aria-label="Search all email records"
          placeholder="Search all records"
          prefix={<SearchOutlined />}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="email-thread-panel__list">
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
    </aside>
  )
}

interface EmailDetailProps {
  email: EmailMessage | null
  now: number
  onEditDraft: () => void
  onForward: () => void
  onIgnore: (reason: EmailIgnoreReason) => void
  onRecover: () => void
  onReply: () => void
}

function EmailDetail({
  email,
  now,
  onEditDraft,
  onForward,
  onIgnore,
  onRecover,
  onReply,
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

  return (
    <article className="email-detail">
      <div className="email-detail__actions">
        {email.folder === 'inbox' && email.handlingStatus !== 'ignored' && (
          <>
            <BaseButton icon={<ForwardOutlined />} size="small" onClick={onForward}>
              Forward
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
          <BaseButton icon={<ForwardOutlined />} size="small" onClick={onForward}>
            Forward
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
  const [isCwuOpen, setIsCwuOpen] = useState(false)
  const [cwuBusinessTypes, setCwuBusinessTypes] = useState<string[]>([])
  const [cwuSummary, setCwuSummary] = useState('')
  const [cwuError, setCwuError] = useState('')
  const [notice, setNotice] = useState<{ text: string; tone: 'success' | 'info' } | null>(null)
  const noticeTimerRef = useRef<number | null>(null)
  const hasRunningSla = messages.some(
    (email) => email.slaStartedAt && !email.slaStoppedAt,
  )
  const now = useNow(hasRunningSla)

  useEffect(
    () => () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current)
      }
    },
    [],
  )

  const selectedEmail =
    messages.find((email) => email.id === selectedMessageId) ?? null
  const threadMessages = selectedEmail
    ? messages
        .filter((email) => email.threadId === selectedEmail.threadId)
        .sort((first, second) => second.sentAt - first.sentAt)
    : []

  const showNotice = (text: string, tone: 'success' | 'info' = 'success') => {
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current)
    }
    setNotice({ text, tone })
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2600)
  }

  const selectMessage = (messageId: string) => {
    setSelectedMessageId(messageId)
    setComposeDraft(null)
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
      forwardSourceMessageId:
        draft.mode === 'forward' ? draft.sourceMessageId : undefined,
      hasAttachment: Boolean(draft.attachmentName),
      handlingStatus: 'draft',
      isRead: true,
      language: draft.language,
      preview: getEmailText(bodyHtml).slice(0, 96) || 'Empty draft',
      receiver: draft.receiver,
      sender: draft.sender,
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
    setActiveFolder('drafts')
    setSelectedMessageId(draftMessage.id)
    setCrmWorkspace((current) => ({
      ...current,
      activeKey: CONVERSATION_TAB_KEY,
    }))
    showNotice('Draft saved in the Drafts folder.')
  }

  const autoSaveComposeDraft = (draft: EmailComposeDraft) => {
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

    setComposeDraft(savedDraft)
    return savedDraft
  }

  const sendSatisfactionSurvey = (draft: EmailComposeDraft) => {
    if (draft.emailStatus !== 'closed') {
      showNotice('Set Email Status to Closed before sending the survey.', 'info')
      return
    }

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
    setSelectedMessageId(sentMessage.id)
    setActiveFolder('sent')
    setCrmWorkspace((current) => ({
      ...current,
      activeKey: CONVERSATION_TAB_KEY,
    }))
    showNotice('Email sent and added to the conversation record.')
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
    setCwuBusinessTypes(selectedEmail?.cwu?.businessTypes ?? [])
    setCwuSummary(selectedEmail?.cwu?.summary ?? '')
    setCwuError('')
    setIsCwuOpen(true)
  }

  const generateCwuSummary = () => {
    if (!selectedEmail) {
      return
    }

    setCwuSummary(
      `Customer contacted BANK 1 by Email regarding "${selectedEmail.subject}". The request was reviewed and recorded for follow-up by the assigned service team.`,
    )
    setCwuError('')
  }

  const confirmCwu = () => {
    if (!selectedEmail) {
      return
    }

    if (cwuBusinessTypes.length === 0) {
      setCwuError('Select at least one Business Type.')
      return
    }

    if (!cwuSummary.trim()) {
      setCwuError('Summary is required.')
      return
    }

    setMessages((current) =>
      current.map((email) =>
        email.id === selectedEmail.id
          ? {
              ...email,
              cwu: {
                businessTypes: [...cwuBusinessTypes],
                registeredAt: Date.now(),
                summary: cwuSummary.trim(),
              },
            }
          : email,
      ),
    )
    setIsCwuOpen(false)
    showNotice('Ticket saved.')
  }

  const mailContent = (
    <div className="email-mail-workspace">
      {composeDraft ? (
        <EmailComposePanel
          draft={composeDraft}
          onAutoSave={autoSaveComposeDraft}
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
          onForward={() =>
            selectedEmail && setComposeDraft(createComposeDraft('forward', selectedEmail))
          }
          onIgnore={ignoreEmail}
          onRecover={recoverEmail}
          onReply={() =>
            selectedEmail && setComposeDraft(createComposeDraft('reply', selectedEmail))
          }
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
      {notice && (
        <div className={`email-page__notice email-page__notice--${notice.tone}`}>
          <CheckCircleFilled />
          <span>{notice.text}</span>
          <button aria-label="Dismiss notification" type="button" onClick={() => setNotice(null)}>
            <CloseOutlined />
          </button>
        </div>
      )}

      <MailboxPanel
        activeFolder={activeFolder}
        collapsed={isMailboxCollapsed}
        messages={messages}
        now={now}
        searchValue={searchValue}
        selectedMessageId={selectedMessageId}
        sentStatusFilter={sentStatusFilter}
        onCompose={() =>
          setComposeDraft(createComposeDraft('new', selectedEmail ?? undefined))
        }
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
        onCompose={() =>
          setComposeDraft(createComposeDraft('new', selectedEmail ?? undefined))
        }
        onOpenCrm={openCrm}
      />

      <CrmPanel
        activeKey={crmWorkspace.activeKey}
        conversationContent={mailContent}
        conversationIcon={<MailOutlined />}
        conversationKey={selectedMessageId ?? undefined}
        conversationLabel="Email"
        tabBarExtraContent={
          <BaseButton
            disabled={!selectedEmail}
            icon={<RobotOutlined />}
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

      <Drawer
        destroyOnHidden
        getContainer={false}
        open={isCwuOpen}
        rootClassName="email-cwu-drawer"
        size={380}
        title="Ticket"
        onClose={() => setIsCwuOpen(false)}
      >
        <div className="email-cwu-form">
          <section>
            <span>Business Type</span>
            <Checkbox.Group
              options={cwuBusinessTypeOptions}
              value={cwuBusinessTypes}
              onChange={(values) => setCwuBusinessTypes(values as string[])}
            />
          </section>
          <label>
            <span>Summary</span>
            <Input.TextArea
              placeholder="Enter the service summary"
              rows={9}
              value={cwuSummary}
              onChange={(event) => {
                setCwuSummary(event.target.value)
                setCwuError('')
              }}
            />
          </label>
          <button className="email-cwu-form__generate" type="button" onClick={generateCwuSummary}>
            <RobotOutlined /> One-Click Generation
          </button>
          {cwuError && <div className="email-cwu-form__error">{cwuError}</div>}
          <footer>
            <BaseButton onClick={() => setIsCwuOpen(false)}>Cancel</BaseButton>
            <BaseButton variant="primary" onClick={confirmCwu}>
              Confirm
            </BaseButton>
          </footer>
        </div>
      </Drawer>
    </section>
  )
}
