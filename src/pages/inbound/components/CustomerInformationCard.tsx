import { useEffect, useRef, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import {
  BaseModal,
  CustomerInformationPanel,
  type CustomerOutboundRequestStatus,
} from '../../../components'
import { useAppStore } from '../../../store'
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
import { ContactManagementModal } from './ContactManagementModal'
import {
  CONTACT_TYPES,
  type ContactGroups,
  type ContactRecord,
  type ContactType,
} from './contactManagementData'
import { SendEmailModal } from './SendEmailModal'

interface CustomerInformationCardProps {
  customer: CustomerInformation
}

function createContactRecord(type: ContactType, value: string): ContactRecord {
  return {
    id: `${type.toLowerCase().replace(/\s+/g, '-')}-${value}`,
    value,
  }
}

function createInitialContacts(): ContactGroups {
  return CONTACT_TYPES.reduce((groups, type) => {
    groups[type] = []
    return groups
  }, {} as ContactGroups)
}

export function CustomerInformationCard({
  customer,
}: CustomerInformationCardProps) {
  const requestCustomerOutboundCall = useAppStore(
    (state) => state.requestCustomerOutboundCall,
  )
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(customer.verificationStatus)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<string, QuestionStepStatus>
  >({})
  const [isCallFlowOpen, setIsCallFlowOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [contacts, setContacts] = useState<ContactGroups>(() => {
    const initialContacts = createInitialContacts()

    initialContacts.Phone = [
      createContactRecord('Phone', customer.profile.phoneNumber),
      createContactRecord('Phone', '8110142208'),
    ]
    initialContacts.WhatsApp = [
      createContactRecord('WhatsApp', customer.profile.phoneNumber),
    ]
    initialContacts.Email = [
      createContactRecord('Email', customer.profile.email),
    ]

    return initialContacts
  })
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [outboundRequestStatus, setOutboundRequestStatus] =
    useState<CustomerOutboundRequestStatus>('idle')
  const outboundApprovalTimerRef = useRef<number | null>(null)
  const { profile } = customer

  useEffect(
    () => () => {
      if (outboundApprovalTimerRef.current) {
        window.clearTimeout(outboundApprovalTimerRef.current)
      }
    },
    [],
  )

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

  const requestOutboundApproval = () => {
    if (outboundRequestStatus !== 'idle') {
      return
    }

    setOutboundRequestStatus('requesting')
    outboundApprovalTimerRef.current = window.setTimeout(() => {
      setOutboundRequestStatus('approved')
      outboundApprovalTimerRef.current = null
    }, 3000)
  }

  const startApprovedOutboundCall = () => {
    if (outboundRequestStatus === 'approved') {
      requestCustomerOutboundCall()
    }
  }

  return (
    <>
      <CustomerInformationPanel
        accessChannelNode={<ChannelTag compact value={customer.accessChannel} />}
        className="inbound-section-card inbound-section-card--customer"
        customer={customer}
        headerExtra={
          <button
            aria-label="Edit contact"
            className="aicc-customer-info__edit-button"
            title="Edit Contact"
            type="button"
            onClick={() => setIsContactModalOpen(true)}
          >
            <EditOutlined />
          </button>
        }
        outboundRequestStatus={outboundRequestStatus}
        verificationStatus={verificationStatus}
        onOpenCallFlow={() => setIsCallFlowOpen(true)}
        onRequestOutbound={requestOutboundApproval}
        onSendEmail={() => setIsEmailModalOpen(true)}
        onStartOutbound={startApprovedOutboundCall}
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
      {isContactModalOpen && (
        <ContactManagementModal
          contacts={contacts}
          open={isContactModalOpen}
          onCancel={() => setIsContactModalOpen(false)}
          onSave={(nextContacts) => {
            setContacts(nextContacts)
            setIsContactModalOpen(false)
          }}
        />
      )}
    </>
  )
}
