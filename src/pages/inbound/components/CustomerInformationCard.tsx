import { useState } from 'react'
import { BaseModal, CustomerInformationPanel } from '../../../components'
import type {
  CustomerInformation,
  VerificationQuestion,
  VerificationStatus,
} from '../../../types'
import { CallFlowDetailModal } from './CallFlowDetailModal'
import { ChannelTag } from './ChannelTag'
import {
  CustomerVerificationModal,
  type QuestionStepStatus,
} from './CustomerVerificationModal'
import { SendEmailModal } from './SendEmailModal'

interface CustomerInformationCardProps {
  customer: CustomerInformation
}

export function CustomerInformationCard({
  customer,
}: CustomerInformationCardProps) {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(customer.verificationStatus)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<string, QuestionStepStatus>
  >({})
  const [isCallFlowOpen, setIsCallFlowOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const { profile } = customer

  const openVerification = () => {
    setActiveQuestionIndex(0)
    setQuestionStatuses({})
    setIsModalOpen(true)
  }

  const handleQuestionAction = (
    question: VerificationQuestion,
    questionIndex: number,
    status: QuestionStepStatus,
  ) => {
    setQuestionStatuses((current) => ({
      ...current,
      [question.id]: status,
    }))
    setActiveQuestionIndex(Math.min(questionIndex + 1, 9))
  }

  const finishVerification = (status: VerificationStatus) => {
    setVerificationStatus(status)
    setIsModalOpen(false)
  }

  return (
    <>
      <CustomerInformationPanel
        accessChannelNode={<ChannelTag compact value={customer.accessChannel} />}
        className="inbound-section-card inbound-section-card--customer"
        customer={customer}
        verificationStatus={verificationStatus}
        onOpenCallFlow={() => setIsCallFlowOpen(true)}
        onSendEmail={() => setIsEmailModalOpen(true)}
        onVerify={openVerification}
      />

      <BaseModal
        className="inbound-verification-modal"
        kind="verification"
        open={isModalOpen}
        title="Customer Verification"
        width={760}
        onCancel={() => setIsModalOpen(false)}
      >
        <CustomerVerificationModal
          activeQuestionIndex={activeQuestionIndex}
          questionStatuses={questionStatuses}
          onFinish={finishVerification}
          onQuestionAction={handleQuestionAction}
        />
      </BaseModal>
      <CallFlowDetailModal
        open={isCallFlowOpen}
        onClose={() => setIsCallFlowOpen(false)}
      />
      <SendEmailModal
        customerEmail={profile.email}
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  )
}
