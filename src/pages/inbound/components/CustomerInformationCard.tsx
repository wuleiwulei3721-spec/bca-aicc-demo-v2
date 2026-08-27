import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { EditOutlined, IdcardOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import {
  BaseButton,
  BaseModal,
  CustomerInformationPanel,
} from '../../../components'
import { isLocalContactEditingEnabled } from '../../../config/moduleVisibility'
import { useOutboundEligibility } from '../../../contexts/outboundEligibility'
import { callFlowDetail } from '../../../mock/inbound'
import { useAppStore } from '../../../store'
import type { CallTransferContext } from '../../../store'
import type {
  CustomerInformation,
  ExternalOutboundReason,
  VerificationV2CustomerSegment,
  VerificationV2DemoConditions,
  VerificationStatus,
} from '../../../types'
import { externalOutboundReasonOptions } from '../../../types'
import {
  getDefaultVerificationV2ChannelCode,
  getDefaultVerificationV2SkillQueueCode,
} from '../../../utils/verificationRuleV2'
import { CallFlowDetailModal } from './CallFlowDetailModal'
import { ChannelTag } from './ChannelTag'
import { ContactManagementModal } from './ContactManagementModal'
import { CustomerContactDetailsModal } from './CustomerContactDetailsModal'
import {
  CONTACT_TYPES,
  type ContactGroups,
  type ContactRecord,
  type ContactType,
} from './contactManagementData'
import { SendEmailModal } from './SendEmailModal'

interface CustomerInformationCardProps {
  accessChannelNode?: ReactNode
  accessMenuLabel?: string
  accessMenuName?: string
  customer: CustomerInformation
  hideVerificationStatus?: boolean
  onSendEmail?: () => void
  onOpenVerification: (config: CustomerVerificationPanelConfig) => void
  onVerificationFinish: (status: VerificationStatus) => void
  verificationConditions?: VerificationV2DemoConditions
  showIvrJourney?: boolean
  showTransferHistory?: boolean
  transferContext?: CallTransferContext
}

export interface CustomerVerificationPanelConfig {
  customerKey: string
  initialConditions: VerificationV2DemoConditions
  onConditionsChange?: (conditions: VerificationV2DemoConditions) => void
  questionBank: ReturnType<typeof useAppStore.getState>['verificationV2QuestionBank']
  rules: ReturnType<typeof useAppStore.getState>['verificationV2Rules']
  onFinish: (status: VerificationStatus) => void
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

function createContactsForCustomerProfile(
  email: string,
  phoneNumber: string,
): ContactGroups {
  const initialContacts = createInitialContacts()

  initialContacts.Phone = [
    createContactRecord('Phone', phoneNumber),
    createContactRecord('Phone', '8110142208'),
  ]
  initialContacts.WhatsApp = [
    createContactRecord('WhatsApp', phoneNumber),
  ]
  initialContacts.Email = [createContactRecord('Email', email)]

  return initialContacts
}

function hasCustomerContactValue(value: string) {
  const normalizedValue = value.trim()
  return normalizedValue.length > 0 && normalizedValue !== '-'
}

function getCustomerSegmentFromProfile(
  customerType: string,
): VerificationV2CustomerSegment {
  const normalizedCustomerType = customerType.trim().toLowerCase()

  if (
    normalizedCustomerType.includes('organisasi') ||
    normalizedCustomerType.includes('organization') ||
    normalizedCustomerType.includes('business') ||
    normalizedCustomerType.includes('bisnis') ||
    normalizedCustomerType.includes('corporate')
  ) {
    return 'organization-business'
  }

  if (normalizedCustomerType.includes('solitaire')) {
    return 'solitaire'
  }

  if (
    normalizedCustomerType.includes('priority') ||
    normalizedCustomerType.includes('prioritas')
  ) {
    return 'priority'
  }

  return 'regular'
}

function getVerificationAction(customer: CustomerInformation) {
  const channel = customer.accessChannel

  if (
    channel === 'Phone' ||
    channel.includes('Voice') ||
    channel === 'Video' ||
    channel.includes('Video')
  ) {
    return 'kbv'
  }

  if (
    channel === 'BankApp' &&
    customer.bankAppLoginStatus === 'registered'
  ) {
    return 'pin'
  }

  return 'none'
}

function shouldHideVerificationStatus(customer: CustomerInformation) {
  const channel = customer.accessChannel

  if (
    channel === 'WhatsApp' ||
    channel === 'Email' ||
    channel === 'Webchat'
  ) {
    return true
  }

  return channel === 'BankApp' && customer.bankAppLoginStatus !== 'registered'
}

function hasCrmCustomerIdentity(cisNumber: string) {
  return /^\d{6,}$/.test(cisNumber.trim())
}

interface CustomerOutboundReasonModalProps {
  canSubmit: boolean
  open: boolean
  reason: ExternalOutboundReason | null
  submitLabel: string
  submitting: boolean
  onCancel: () => void
  onReasonChange: (reason: ExternalOutboundReason) => void
  onSubmit: () => void
}

function CustomerOutboundReasonModal({
  open,
  reason,
  canSubmit,
  submitLabel,
  submitting,
  onCancel,
  onReasonChange,
  onSubmit,
}: CustomerOutboundReasonModalProps) {
  return (
    <BaseModal
      className="inbound-customer-outbound-reason-modal"
      footer={null}
      kind="outbound"
      open={open}
      title="Outbound Reason"
      width={360}
      onCancel={onCancel}
    >
      <div className="inbound-customer-outbound-reason-modal__content">
        <label htmlFor="customer-outbound-reason">Reason</label>
        <Select<ExternalOutboundReason>
          id="customer-outbound-reason"
          options={externalOutboundReasonOptions}
          placeholder="Select reason"
          value={reason}
          onChange={onReasonChange}
        />
        <div className="inbound-customer-outbound-reason-modal__actions">
          <BaseButton disabled={submitting} onClick={onCancel}>
            Cancel
          </BaseButton>
          <BaseButton
            disabled={!reason || submitting || !canSubmit}
            type="primary"
            onClick={onSubmit}
          >
            {submitLabel}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  )
}

interface ContactEditingDemoProps {
  customerKey: string
  email: string
  phoneNumber: string
}

function ContactEditingDemo({
  customerKey,
  email,
  phoneNumber,
}: ContactEditingDemoProps) {
  const defaultContacts = useMemo(
    () => createContactsForCustomerProfile(email, phoneNumber),
    [email, phoneNumber],
  )
  const [contactsState, setContactsState] = useState<{
    contacts: ContactGroups
    customerKey: string
  }>(() => ({
    contacts: defaultContacts,
    customerKey,
  }))
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const contacts =
    contactsState.customerKey === customerKey
      ? contactsState.contacts
      : defaultContacts

  return (
    <>
      <button
        aria-label="Edit contact"
        className="aicc-customer-info__edit-button"
        title="Edit Contact"
        type="button"
        onClick={() => setIsContactModalOpen(true)}
      >
        <EditOutlined />
      </button>
      {isContactModalOpen && (
        <ContactManagementModal
          contacts={contacts}
          open={isContactModalOpen}
          onCancel={() => setIsContactModalOpen(false)}
          onSave={(nextContacts) => {
            setContactsState({
              contacts: nextContacts,
              customerKey,
            })
            setIsContactModalOpen(false)
          }}
        />
      )}
    </>
  )
}

export function CustomerInformationCard({
  accessChannelNode,
  accessMenuLabel = 'Business Menu Selection Record',
  accessMenuName,
  customer,
  hideVerificationStatus: hideVerificationStatusProp,
  onSendEmail,
  onOpenVerification,
  onVerificationFinish,
  verificationConditions,
  showIvrJourney,
  showTransferHistory,
  transferContext,
}: CustomerInformationCardProps) {
  const requestCustomerOutboundCall = useAppStore(
    (state) => state.requestCustomerOutboundCall,
  )
  const requestBankAppPinVerification = useAppStore(
    (state) => state.requestBankAppPinVerification,
  )
  const bankAppPinVerificationAttempts = useAppStore(
    (state) => state.bankAppPinVerificationAttempts,
  )
  const bankAppPinVerificationStatus = useAppStore(
    (state) => state.bankAppPinVerificationStatus,
  )
  const verificationV2QuestionBank = useAppStore(
    (state) => state.verificationV2QuestionBank,
  )
  const verificationV2Rules = useAppStore(
    (state) => state.verificationV2Rules,
  )
  const { hasOutboundAccess } = useOutboundEligibility()
  const { profile } = customer
  const isCrmIdentified = hasCrmCustomerIdentity(profile.cisNumber)
  const isUnidentifiedCustomer =
    !isCrmIdentified && profile.name !== 'Outbound Customer'
  const hasEmail = hasCustomerContactValue(profile.email)
  const whatsAppPhoneNumber =
    customer.accessChannel === 'WhatsApp'
      ? profile.crmContacts?.WhatsApp?.find(hasCustomerContactValue)
      : undefined
  const displayPhoneNumber = whatsAppPhoneNumber ?? profile.phoneNumber
  const hasOutboundNumber =
    !isUnidentifiedCustomer && hasCustomerContactValue(displayPhoneNumber)
  const displayCustomer = {
    ...customer,
    profile: {
      ...profile,
      phoneNumber: displayPhoneNumber,
      ...(isUnidentifiedCustomer
        ? {
            name: 'Unidentified Customer',
            email: '-',
            phoneNumber: '-',
            cisNumber: '-',
            customerType: '',
          }
        : undefined),
    },
  }
  const customerKey = [
    customer.accessChannel,
    profile.cisNumber,
    profile.phoneNumber,
  ].join(':')
  const [isCallFlowOpen, setIsCallFlowOpen] = useState(false)
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isOutboundReasonModalOpen, setIsOutboundReasonModalOpen] =
    useState(false)
  const [outboundReason, setOutboundReason] =
    useState<ExternalOutboundReason | null>(null)
  const verificationStatus = customer.verificationStatus
  const verificationAction = getVerificationAction(customer)
  const hideVerificationStatus =
    hideVerificationStatusProp ?? shouldHideVerificationStatus(customer)
  const pinAttemptsRemaining = Math.max(0, 3 - bankAppPinVerificationAttempts)
  const pinButtonDisabled =
    bankAppPinVerificationStatus === 'sent' ||
    bankAppPinVerificationStatus === 'verified' ||
    bankAppPinVerificationStatus === 'locked' ||
    bankAppPinVerificationAttempts >= 3
  const pinVerificationStatus =
    bankAppPinVerificationStatus === 'sent'
      ? 'Verifying'
      : bankAppPinVerificationStatus === 'verified'
        ? 'Verified'
        : bankAppPinVerificationStatus === 'locked'
          ? 'Verification Failed'
          : bankAppPinVerificationStatus === 'failed'
            ? 'Verification Failed'
            : verificationStatus === 'Verifying'
              ? 'Unverified'
              : verificationStatus
  const effectiveVerificationStatus =
    verificationAction === 'pin' ? pinVerificationStatus : verificationStatus
  const pinVerificationFailureReason =
    verificationAction === 'pin' &&
    (bankAppPinVerificationStatus === 'failed' ||
      bankAppPinVerificationStatus === 'locked')
      ? 'PIN input is incorrect.'
      : undefined
  const [isSpecialHandlingOpen, setIsSpecialHandlingOpen] = useState(false)
  const shouldShowIvrJourney =
    showIvrJourney ??
    (customer.accessChannel === 'Phone' ||
      customer.accessChannel.includes('Voice'))
  const finalIvrStep = shouldShowIvrJourney
    ? callFlowDetail.ivrJourney[callFlowDetail.ivrJourney.length - 1]
    : undefined
  const routeMenuName = accessMenuName ?? finalIvrStep?.nodeName
  const initialVerificationV2Conditions = useMemo<VerificationV2DemoConditions>(
    () => ({
      channelCode: getDefaultVerificationV2ChannelCode(customer.accessChannel),
      customerSegment: getCustomerSegmentFromProfile(profile.customerType),
      haloAppLoginStatus:
        customer.accessChannel === 'BankApp Voice'
          ? customer.bankAppLoginStatus
          : undefined,
      organizationSegment: 'none',
      skillQueueCode: getDefaultVerificationV2SkillQueueCode(
        customer.accessChannel,
        accessMenuName ?? routeMenuName,
      ),
      scenarioId: 'default',
    }),
    [
      accessMenuName,
      customer.accessChannel,
      customer.bankAppLoginStatus,
      profile.customerType,
      routeMenuName,
    ],
  )
  const effectiveVerificationV2Conditions =
    verificationConditions ?? initialVerificationV2Conditions

  const openVerification = () => {
    if (verificationAction === 'pin') {
      requestBankAppPinVerification('bankapp')
      return
    }

    onOpenVerification({
      customerKey,
      initialConditions: effectiveVerificationV2Conditions,
      questionBank: verificationV2QuestionBank,
      rules: verificationV2Rules,
      onFinish: onVerificationFinish,
    })
  }

  const verifyButtonLabel =
    verificationAction === 'pin'
      ? 'PIN'
      : verificationAction === 'kbv'
        ? 'KBV'
        : undefined
  const verifyButtonTitle =
    verificationAction === 'pin'
      ? pinAttemptsRemaining > 0
        ? `Send PIN verification to customer app. ${pinAttemptsRemaining} attempt${pinAttemptsRemaining === 1 ? '' : 's'} remaining.`
        : 'PIN verification limit reached.'
      : verificationAction === 'kbv'
        ? 'Open knowledge-based verification'
        : undefined

  const openOutboundReasonModal = () => {
    if (!hasOutboundAccess) {
      return
    }

    setOutboundReason(null)
    setIsOutboundReasonModalOpen(true)
  }

  const cancelOutboundReasonModal = () => {
    setIsOutboundReasonModalOpen(false)
    setOutboundReason(null)
  }

  const startCustomerOutboundCall = () => {
    if (!outboundReason || !hasOutboundAccess) {
      return
    }

    setIsOutboundReasonModalOpen(false)
    requestCustomerOutboundCall(displayPhoneNumber)
    setOutboundReason(null)
  }

  return (
    <>
      <CustomerInformationPanel
        accessChannelNode={
          accessChannelNode ?? (
            <ChannelTag
              compact
              duration={customer.accessDuration}
              label={
                customer.accessChannel === 'Webchat' ? 'bca.co.id' : undefined
              }
              transferredFrom={
                transferContext
                  ? `${transferContext.sourceAgentName} (${transferContext.sourceAgentEmployeeId})`
                  : undefined
              }
              value={customer.accessChannel}
            />
          )
        }
        className="inbound-section-card inbound-section-card--customer"
        customer={displayCustomer}
        headerExtra={
          isCrmIdentified ? (
            <div className="aicc-customer-info__header-actions">
              <button
                aria-label="View all contact details"
                className="aicc-customer-info__edit-button"
                title="All Contact Details"
                type="button"
                onClick={() => setIsContactDetailsOpen(true)}
              >
                  <IdcardOutlined />
              </button>
              {isLocalContactEditingEnabled && (
                <ContactEditingDemo
                  customerKey={customerKey}
                  email={profile.email}
                  phoneNumber={profile.phoneNumber}
                />
              )}
            </div>
          ) : undefined
        }
        isDirectOutbound
        hideVerificationStatus={hideVerificationStatus}
        verificationStatus={effectiveVerificationStatus}
        verifyButtonDisabled={
          verificationAction === 'pin' ? pinButtonDisabled : false
        }
        verifyButtonLabel={verifyButtonLabel}
        verifyButtonTitle={verifyButtonTitle}
        verificationFailureReason={pinVerificationFailureReason}
        onOpenCallFlow={() => setIsCallFlowOpen(true)}
        onOpenSpecialHandling={
          isCrmIdentified
            ? () => setIsSpecialHandlingOpen(true)
            : undefined
        }
        onRequestOutbound={
          hasOutboundNumber && hasOutboundAccess
            ? openOutboundReasonModal
            : undefined
        }
        onSendEmail={
          isCrmIdentified && hasEmail
            ? onSendEmail ?? (() => setIsEmailModalOpen(true))
            : undefined
        }
        outboundDisabledTitle={
          hasOutboundNumber && !hasOutboundAccess
            ? 'Switch to outbound AUX'
            : undefined
        }
        onVerify={
          hideVerificationStatus || verificationAction === 'none'
            ? undefined
            : openVerification
        }
      />
      <CustomerOutboundReasonModal
        canSubmit={hasOutboundAccess}
        open={isOutboundReasonModalOpen}
        reason={outboundReason}
        submitting={false}
        submitLabel="Call"
        onCancel={cancelOutboundReasonModal}
        onReasonChange={setOutboundReason}
        onSubmit={startCustomerOutboundCall}
      />
      {isCrmIdentified && (
        <BaseModal
          centered
          className="inbound-special-handling-modal"
          kind="detail"
          open={isSpecialHandlingOpen}
          title="Special handling information"
          width={520}
          onCancel={() => setIsSpecialHandlingOpen(false)}
        >
        <div className="inbound-special-handling">
          <table className="inbound-special-handling__table">
            <thead>
              <tr>
                <th scope="col">Customer Profile</th>
                <th scope="col">Handling</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Orang Kaya</td>
                <td>Jangan ditanya dulunya</td>
              </tr>
            </tbody>
          </table>
          <div className="inbound-special-handling__footer">
            <BaseButton
              type="primary"
              onClick={() => setIsSpecialHandlingOpen(false)}
            >
              Close
            </BaseButton>
          </div>
        </div>
        </BaseModal>
      )}

      <CallFlowDetailModal
        accessMenuLabel={accessMenuLabel}
        accessMenuName={accessMenuName}
        open={isCallFlowOpen}
        showIvrJourney={shouldShowIvrJourney}
        showTransferHistory={showTransferHistory}
        onClose={() => setIsCallFlowOpen(false)}
      />
      {isCrmIdentified && (
        <>
          {!onSendEmail && (
            <SendEmailModal
              customerEmail={profile.email}
              open={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
            />
          )}
          <CustomerContactDetailsModal
            contacts={profile.crmContacts}
            open={isContactDetailsOpen}
            onClose={() => setIsContactDetailsOpen(false)}
          />
        </>
      )}
    </>
  )
}
