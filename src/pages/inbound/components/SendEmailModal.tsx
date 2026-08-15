import { useEffect, useMemo, useRef, useState } from 'react'
import { CloseOutlined, FilePdfOutlined, SendOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import { BaseButton } from '../../../components'
import { emailTemplates } from '../../../mock/email'
import type { EmailLanguage, EmailStatus } from '../../../types'

const BANK_EMAIL_ACCOUNT = 'contact@bank1.demo'
const BANK_PUBLIC_WEBSITE = 'https://www.bca.co.id'
const BANK_SIGNATURE_IMAGE = '/email-assets/bank-service-counter.jpg'
const AGENT_NAME = 'Budi Kartika'
const DEFAULT_EMAIL_LANGUAGE: EmailLanguage = 'ID'

const customerEmailStatusOptions: Array<{ label: string; value: EmailStatus }> = [
  { label: 'Monitoring', value: 'pending' },
  { label: 'On Progress', value: 'open' },
  { label: 'Close', value: 'closed' },
]

const customerEmailLanguageOptions: Array<{ label: string; value: EmailLanguage }> = [
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
    .replace(/<section class="email-signature"[\s\S]*?<\/section>/gi, '')
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
        <img src="${BANK_SIGNATURE_IMAGE}" alt="BANK 1 banking service" width="28" height="28" />
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

interface SendEmailModalProps {
  customerEmail: string
  open: boolean
  onClose: () => void
}

export function SendEmailModal({
  customerEmail,
  open,
  onClose,
}: SendEmailModalProps) {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | undefined>()
  const [templateId, setTemplateId] = useState<string | undefined>()
  const [language, setLanguage] = useState<EmailLanguage>(DEFAULT_EMAIL_LANGUAGE)
  const [subject, setSubject] = useState('')
  const [bodyHtml, setBodyHtml] = useState(() =>
    createEmailSignature(DEFAULT_EMAIL_LANGUAGE),
  )
  const [error, setError] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  const selectedTemplate = useMemo(
    () => emailTemplates.find((template) => template.id === templateId),
    [templateId],
  )
  const canEditMessage = Boolean(selectedTemplate && language)
  const selectPopupClassName = 'email-compose-select-dropdown'

  useEffect(() => {
    if (!open || !editorRef.current) {
      return
    }

    if (editorRef.current.innerHTML !== bodyHtml) {
      editorRef.current.innerHTML = bodyHtml
    }
  }, [bodyHtml, open])

  if (!open) {
    return null
  }

  const resetAndClose = () => {
    setEmailStatus(undefined)
    setTemplateId(undefined)
    setLanguage(DEFAULT_EMAIL_LANGUAGE)
    setSubject('')
    setBodyHtml(createEmailSignature(DEFAULT_EMAIL_LANGUAGE))
    setError('')
    onClose()
  }

  const applyTemplate = (nextTemplateId: string | undefined) => {
    const template = emailTemplates.find((item) => item.id === nextTemplateId)

    setTemplateId(nextTemplateId)
    setBodyHtml(
      template
        ? buildEmailBody(getTemplateBody(template.id, language), language)
        : createEmailSignature(language),
    )
    setError('')
  }

  const changeLanguage = (nextLanguage: EmailLanguage) => {
    setLanguage(nextLanguage)
    setBodyHtml(
      selectedTemplate
        ? buildEmailBody(
            getTemplateBody(selectedTemplate.id, nextLanguage),
            nextLanguage,
          )
        : createEmailSignature(nextLanguage),
    )
    setError('')
  }

  const runEditorCommand = (command: string) => {
    editorRef.current?.focus()
    document.execCommand(command)
    setBodyHtml(sanitizeEmailHtml(editorRef.current?.innerHTML ?? bodyHtml))
  }

  const handleSend = () => {
    if (!emailStatus) {
      setError('Select an email status before sending.')
      return
    }

    if (!selectedTemplate || !language) {
      setError('Select a template and language before composing.')
      return
    }

    if (!subject.trim()) {
      setError('Subject is required before sending.')
      return
    }

    if (!getEmailText(bodyHtml)) {
      setError('Email content is required before sending.')
      return
    }

    resetAndClose()
  }

  return (
    <div className="email-compose-modal-overlay" role="presentation">
      <section
        aria-label="Send Email"
        className="email-compose-modal-panel customer-email-compose-modal"
      >
        <header className="email-compose-modal-panel__toolbar">
          <div className="email-compose-modal-panel__actions">
            <BaseButton
              disabled={!emailStatus}
              icon={<SendOutlined />}
              size="small"
              variant="primary"
              onClick={handleSend}
            >
              Send
            </BaseButton>
            <BaseButton size="small" variant="secondary" onClick={resetAndClose}>
              Save
            </BaseButton>
          </div>
          <button aria-label="Close compose modal" type="button" onClick={resetAndClose}>
            <CloseOutlined />
          </button>
        </header>

        <div className="email-compose customer-email-compose">
          <div className="email-compose__fields">
            <label>
              <span>Receiver</span>
              <Input disabled value={customerEmail} />
            </label>
            <label>
              <span>Subject</span>
              <Input
                placeholder="Enter email subject"
                value={subject}
                onBlur={() => setSubject((value) => value.trim())}
                onChange={(event) => {
                  setSubject(event.target.value)
                  setError('')
                }}
              />
            </label>
            <label>
              <span>Sender</span>
              <Input disabled value={BANK_EMAIL_ACCOUNT} />
            </label>
            <label>
              <span>Email Status</span>
              <Select
                allowClear
                getPopupContainer={getEmailComposePopupContainer}
                options={customerEmailStatusOptions}
                popupClassName={selectPopupClassName}
                placeholder="Select status before sending"
                value={emailStatus}
                onChange={(value) => {
                  setEmailStatus(value)
                  setError('')
                }}
              />
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
                popupClassName={selectPopupClassName}
                placeholder="Select a response template"
                value={templateId}
                onChange={applyTemplate}
              />
            </label>
            <label>
              <span>Language</span>
              <div className="email-compose__language-switch">
                {customerEmailLanguageOptions.map((option) => (
                  <button
                    aria-pressed={language === option.value}
                    className={
                      language === option.value
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
                  disabled={!canEditMessage}
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
                disabled={!canEditMessage}
                title="Template config"
                type="button"
              >
                <FilePdfOutlined />
              </button>
            </div>
            <div
              aria-label="Email content"
              aria-disabled={!canEditMessage}
              className={`email-compose__editor customer-email-compose__textarea${
                canEditMessage ? '' : ' email-compose__editor--disabled'
              }`}
              contentEditable={canEditMessage}
              data-placeholder={
                canEditMessage
                  ? 'Type message to customer'
                  : 'Select a template and language before composing'
              }
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
              ref={editorRef}
              role="textbox"
              suppressContentEditableWarning
              onInput={() => {
                if (!canEditMessage) {
                  return
                }
                setBodyHtml(sanitizeEmailHtml(editorRef.current?.innerHTML ?? ''))
                setError('')
              }}
            />
          </div>

          {error ? <div className="email-compose__error">{error}</div> : null}
        </div>
      </section>
    </div>
  )
}
