import { useState } from 'react'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { Avatar, Modal, Tag } from 'antd'
import { AppButton } from '../../../components'
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
import { SectionCard } from './SectionCard'

interface CustomerInformationCardProps {
  customer: CustomerInformation
}

const statusClassName: Record<VerificationStatus, string> = {
  Verified: 'inbound-status-tag inbound-status-tag--success',
  Unverified: 'inbound-status-tag inbound-status-tag--warning',
  'Verification Failed': 'inbound-status-tag inbound-status-tag--danger',
}

function renderStatusIcon(status: VerificationStatus) {
  if (status === 'Verified') {
    return <CheckCircleOutlined />
  }

  if (status === 'Verification Failed') {
    return <CloseCircleOutlined />
  }

  return <CloseCircleOutlined />
}

function renderStatusLabel(status: VerificationStatus) {
  if (status === 'Unverified') {
    return 'Unverified'
  }

  if (status === 'Verification Failed') {
    return 'Failed'
  }

  return status
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
      <SectionCard
        className="inbound-section-card--customer"
        title="Customer Information"
      >
        <div className="inbound-customer-card">
          <div className="inbound-customer-card__identity">
            <div className="inbound-customer-card__avatar-wrap">
              <Avatar
                className="inbound-profile__avatar"
                size={58}
                src={profile.avatarUrl}
              >
                {profile.avatarInitials}
              </Avatar>
              <Tag className="inbound-priority-tag">Priority</Tag>
            </div>

            <div className="inbound-customer-card__main">
              <div className="inbound-profile__name">{profile.name}</div>
              <div className="inbound-customer-facts">
                <span>
                  <PhoneOutlined />
                  {profile.phoneNumber}
                </span>
                <span>
                  <MailOutlined />
                  {profile.email}
                </span>
                <span>
                  <IdcardOutlined />
                  {profile.cisNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="inbound-access-strip">
            <button
              className="inbound-channel-action"
              title="View call flow detail"
              type="button"
              onClick={() => setIsCallFlowOpen(true)}
            >
              <ChannelTag compact value={customer.accessChannel} />
            </button>
            <span>
              <ClockCircleOutlined />
              {customer.accessDuration}
            </span>
            <Tag
              className={`inbound-avatar-status ${statusClassName[verificationStatus]}`}
              icon={renderStatusIcon(verificationStatus)}
            >
              {renderStatusLabel(verificationStatus)}
            </Tag>
            <AppButton size="small" type="primary" onClick={openVerification}>
              Verify
            </AppButton>
          </div>
        </div>
      </SectionCard>

      <Modal
        className="inbound-verification-modal"
        footer={null}
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
      </Modal>
      <CallFlowDetailModal
        open={isCallFlowOpen}
        onClose={() => setIsCallFlowOpen(false)}
      />
    </>
  )
}
