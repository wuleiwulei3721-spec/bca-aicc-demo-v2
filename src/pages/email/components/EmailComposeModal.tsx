import { CloseOutlined, FilePdfOutlined, MailOutlined, SendOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BaseButton } from '../../../components'
import { emailTemplates } from '../../../mock/email'
import type { EmailComposeDraft, EmailLanguage } from '../../../types'
import { TEAM_LEADER_EMAIL, createEmailSignature } from './emailComposeModel'

const emailLanguageOptions: Array<{ label: string; value: EmailLanguage }> = [
  { label: 'ID', value: 'ID' },
  { label: 'EN', value: 'EN' },
]

function getEmailComposePopupContainer(triggerNode: HTMLElement) {
  return (
    (triggerNode.closest('.email-compose-modal-panel') as HTMLElement | null) ??
    document.body
  )
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

  return new Intl.DateTimeFormat(
    'en-GB',
    isToday
      ? { hour: '2-digit', minute: '2-digit' }
      : { day: '2-digit', month: 'short' },
  ).format(date)
}

type EmailComposeSurface = 'inline' | 'modal'

interface EmailComposePanelContentProps {
  bodyReadonly?: boolean
  draft: EmailComposeDraft
  onAutoSave: (draft: EmailComposeDraft) => EmailComposeDraft
  onCancel: () => void
  onChange: (draft: EmailComposeDraft) => void
  onSave: (draft: EmailComposeDraft) => void
  onSend: (draft: EmailComposeDraft) => void
  onSendSurvey: (draft: EmailComposeDraft) => void
  surface?: EmailComposeSurface
}

function EmailComposePanelContent({
  bodyReadonly = false,
  draft,
  onAutoSave,
  onCancel,
  onChange,
  onSave,
  onSend,
  onSendSurvey,
  surface = 'inline',
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

    if (action === 'send' && !nextDraft.templateId) {
      setError('Select a template and language before sending.')
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
      : fields.mode === 'transfer'
        ? 'Transfer Email'
        : fields.mode === 'draft'
          ? 'Edit Draft'
          : 'New Email'
  const canSendSurvey = true
  const isModal = surface === 'modal'
  const canEditBody =
    !bodyReadonly && (Boolean(fields.templateId) || fields.mode === 'draft')
  const canSubmitSend = Boolean(fields.templateId)

  return (
    <section
      aria-label={title}
      className={isModal ? 'email-compose-modal-panel' : 'email-compose-inline'}
    >
      {isModal ? (
        <header className="email-compose-modal-panel__toolbar">
          <div className="email-compose-modal-panel__actions">
            <BaseButton
              disabled={!canSubmitSend}
              size="small"
              variant="primary"
              onClick={() => submit('send')}
            >
              Send
            </BaseButton>
            <BaseButton size="small" variant="secondary" onClick={() => submit('save')}>
              Save
            </BaseButton>
            {autoSaveLabel && <span>{autoSaveLabel}</span>}
          </div>
          <button aria-label="Close compose modal" type="button" onClick={onCancel}>
            <CloseOutlined />
          </button>
        </header>
      ) : (
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
      )}

      <div className="email-compose">
        <div className="email-compose__fields">
          <label>
            <span>Receiver</span>
            <Input
              disabled={fields.mode === 'transfer' || fields.receiverLocked}
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
              placeholder="Enter email subject"
              value={fields.subject}
              onChange={(event) =>
                updateFields({ subject: event.target.value })
              }
            />
          </label>
          <label>
            <span>Sender</span>
            <Input disabled value={fields.sender} />
          </label>
          <label>
            <span>Template</span>
            <Select
              allowClear
              getPopupContainer={getEmailComposePopupContainer}
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
                disabled={!canEditBody}
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
              disabled={!canEditBody}
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
                  getPopupContainer={getEmailComposePopupContainer}
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
            aria-disabled={!canEditBody}
            aria-label="Email content"
            className={`email-compose__editor${
              canEditBody ? '' : ' email-compose__editor--disabled'
            }`}
            contentEditable={canEditBody}
            dangerouslySetInnerHTML={{ __html: fields.bodyHtml }}
            ref={editorRef}
            role="textbox"
            suppressContentEditableWarning
            onInput={() => {
              if (!canEditBody) {
                return
              }
              setError('')
              updateFields({ bodyHtml: readEditorHtml() })
            }}
          />
        </div>

        {error && <div className="email-compose__error">{error}</div>}

        {!isModal && (
          <footer className="email-compose__footer">
            {fields.mode === 'transfer' && (
              <span className="email-compose__transfer-note">
                Transfer is limited to your TL: {TEAM_LEADER_EMAIL}
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
              disabled={!canSubmitSend}
              icon={<SendOutlined />}
              variant="primary"
              onClick={() => submit('send')}
            >
              Send
            </BaseButton>
          </footer>
        )}
      </div>
    </section>
  )
}

export interface EmailComposePanelProps
  extends Omit<EmailComposePanelContentProps, 'draft'> {
  draft: EmailComposeDraft | null
}

export function EmailComposePanel({ draft, ...props }: EmailComposePanelProps) {
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

export function EmailComposeModal({ draft, ...props }: EmailComposePanelProps) {
  if (!draft) {
    return null
  }

  return (
    <div className="email-page email-compose-modal-overlay" role="presentation">
      <EmailComposePanel draft={draft} surface="modal" {...props} />
    </div>
  )
}
