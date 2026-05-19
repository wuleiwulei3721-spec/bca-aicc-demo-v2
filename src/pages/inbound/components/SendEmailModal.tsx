import { useState } from 'react'
import { Input } from 'antd'
import { AppButton, BaseModal } from '../../../components'

const { TextArea } = Input

const emailTemplates = [
  {
    label: 'Card Replacement',
    message:
      'Dear Customer, we have received your card replacement request. Please review the required documents and visit the nearest branch for completion.',
  },
  {
    label: 'Credit Card Activation',
    message:
      'Dear Customer, your credit card activation request has been recorded. Please follow the secure activation steps shared by BCA.',
  },
  {
    label: 'Application Follow-up',
    message:
      'Dear Customer, we are following up on your application status. Our team will update you once the review process is completed.',
  },
  {
    label: 'Lost Card Assistance',
    message:
      'Dear Customer, we have noted your lost card report. For your security, the card will remain blocked while the replacement process is arranged.',
  },
]

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
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleClose = () => {
    onClose()
  }

  const handleSend = () => {
    onClose()
  }

  return (
    <BaseModal
      className="inbound-send-email-modal"
      kind="email"
      open={open}
      title="Send Email"
      width={680}
      onCancel={handleClose}
    >
      <div className="inbound-send-email">
        <label>
          <span>To</span>
          <Input readOnly value={customerEmail} />
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
          <span>Message</span>
          <TextArea
            autoSize={{ minRows: 6, maxRows: 10 }}
            placeholder="Type message to customer"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>

        <section className="inbound-send-email__templates">
          <span>Quick Templates</span>
          <div>
            {emailTemplates.map((template) => (
              <button
                key={template.label}
                type="button"
                onClick={() => {
                  setSubject(template.label)
                  setMessage(template.message)
                }}
              >
                {template.label}
              </button>
            ))}
          </div>
        </section>

        <footer className="inbound-send-email__footer">
          <AppButton onClick={handleClose}>Cancel</AppButton>
          <AppButton type="primary" onClick={handleSend}>
            Send Email
          </AppButton>
        </footer>
      </div>
    </BaseModal>
  )
}
