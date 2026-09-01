import { useMemo } from 'react'
import type { EmailComposeDraft } from '../../../types'
import { EmailComposeModal } from '../../email/components/EmailComposeModal'
import {
  BANK_EMAIL_ACCOUNT,
  DEFAULT_EMAIL_LANGUAGE,
  createEmailSignature,
} from '../../email/components/emailComposeModel'

interface SendEmailModalProps {
  customerEmail: string
  open: boolean
  onClose: () => void
}

function createCustomerEmailDraft(customerEmail: string): EmailComposeDraft {
  return {
    bodyHtml: createEmailSignature(DEFAULT_EMAIL_LANGUAGE),
    language: DEFAULT_EMAIL_LANGUAGE,
    mode: 'reply',
    receiver: customerEmail,
    receiverLocked: true,
    sender: BANK_EMAIL_ACCOUNT,
    subject: '',
    threadId: `customer-email-${customerEmail}`,
  }
}

export function SendEmailModal({
  customerEmail,
  open,
  onClose,
}: SendEmailModalProps) {
  const draft = useMemo(
    () => (open ? createCustomerEmailDraft(customerEmail) : null),
    [customerEmail, open],
  )

  if (!open) {
    return null
  }

  const closeModal = () => {
    onClose()
  }

  const persistDraft = (nextDraft: EmailComposeDraft) => {
    return { ...nextDraft, autoSavedAt: Date.now() }
  }

  return (
    <EmailComposeModal
      bodyReadonly
      draft={draft}
      hideEditorToolbar
      hideModalSave
      onAutoSave={persistDraft}
      onCancel={closeModal}
      onChange={() => undefined}
      onSave={closeModal}
      onSend={closeModal}
      onSendSurvey={() => undefined}
    />
  )
}
