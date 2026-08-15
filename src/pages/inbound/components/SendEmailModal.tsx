import { useMemo, useState } from 'react'
import { CloseOutlined, SendOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import { BaseButton } from '../../../components'
import type { EmailLanguage, EmailStatus } from '../../../types'

const BANK_EMAIL_ACCOUNT = 'contact@bank1.demo'

const customerEmailStatusOptions: Array<{ label: string; value: EmailStatus }> = [
  { label: 'Monitoring', value: 'pending' },
  { label: 'On Progress', value: 'open' },
  { label: 'Close', value: 'closed' },
]

const customerEmailLanguageOptions: Array<{ label: string; value: EmailLanguage }> = [
  { label: 'ID', value: 'ID' },
  { label: 'EN', value: 'EN' },
]

const customerEmailTemplates = [
  {
    id: 'card-replacement',
    label: 'Card Replacement',
    subject: 'Card replacement follow-up',
    body: {
      EN: 'Dear Customer, we have received your card replacement request. Please review the required documents and visit the nearest branch for completion.',
      ID: 'Halo Bapak/Ibu, kami telah menerima permintaan penggantian kartu Anda. Mohon meninjau dokumen yang diperlukan dan datang ke cabang terdekat untuk penyelesaian.',
    },
  },
  {
    id: 'credit-card-activation',
    label: 'Credit Card Activation',
    subject: 'Credit card activation support',
    body: {
      EN: 'Dear Customer, your credit card activation request has been recorded. Please follow the secure activation steps shared by BANK 1.',
      ID: 'Halo Bapak/Ibu, permintaan aktivasi kartu kredit Anda telah kami catat. Mohon mengikuti langkah aktivasi aman yang dibagikan BANK 1.',
    },
  },
  {
    id: 'application-follow-up',
    label: 'Application Follow-up',
    subject: 'Application follow-up',
    body: {
      EN: 'Dear Customer, we are following up on your application status. Our team will update you once the review process is completed.',
      ID: 'Halo Bapak/Ibu, kami sedang menindaklanjuti status pengajuan Anda. Tim kami akan memberikan pembaruan setelah proses peninjauan selesai.',
    },
  },
  {
    id: 'lost-card-assistance',
    label: 'Lost Card Assistance',
    subject: 'Lost card assistance',
    body: {
      EN: 'Dear Customer, we have noted your lost card report. For your security, the card will remain blocked while the replacement process is arranged.',
      ID: 'Halo Bapak/Ibu, laporan kartu hilang Anda telah kami catat. Demi keamanan, kartu akan tetap diblokir selama proses penggantian disiapkan.',
    },
  },
]

function getEmailComposePopupContainer(triggerNode: HTMLElement) {
  return (
    (triggerNode.closest('.email-compose-modal-panel') as HTMLElement | null) ??
    document.body
  )
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
  const [language, setLanguage] = useState<EmailLanguage | undefined>()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedTemplate = useMemo(
    () => customerEmailTemplates.find((template) => template.id === templateId),
    [templateId],
  )
  const canEditMessage = Boolean(selectedTemplate && language)

  if (!open) {
    return null
  }

  const resetAndClose = () => {
    setEmailStatus(undefined)
    setTemplateId(undefined)
    setLanguage(undefined)
    setSubject('')
    setMessage('')
    setError('')
    onClose()
  }

  const applyTemplate = (nextTemplateId: string | undefined) => {
    const template = customerEmailTemplates.find(
      (item) => item.id === nextTemplateId,
    )

    setTemplateId(nextTemplateId)
    setSubject(template?.subject ?? '')
    setMessage(template && language ? template.body[language] : '')
    setError('')
  }

  const changeLanguage = (nextLanguage: EmailLanguage) => {
    setLanguage(nextLanguage)
    setMessage(selectedTemplate ? selectedTemplate.body[nextLanguage] : '')
    setError('')
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

    if (!message.trim()) {
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
                onChange={(event) => setSubject(event.target.value)}
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
                options={customerEmailTemplates.map((template) => ({
                  label: template.label,
                  value: template.id,
                }))}
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
              {['B', 'I', 'U', '\u2022', '\u2261'].map((item) => (
                <button disabled={!canEditMessage} key={item} type="button">
                  {item}
                </button>
              ))}
            </div>
            <textarea
              aria-label="Email content"
              className={`email-compose__editor customer-email-compose__textarea${
                canEditMessage ? '' : ' email-compose__editor--disabled'
              }`}
              disabled={!canEditMessage}
              placeholder={
                canEditMessage
                  ? 'Type message to customer'
                  : 'Select a template and language before composing'
              }
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
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
