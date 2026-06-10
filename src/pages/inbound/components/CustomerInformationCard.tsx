import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ApartmentOutlined,
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { Input, Popover } from 'antd'
import {
  BaseButton,
  BaseModal,
  CustomerInformationPanel,
  type CustomerOutboundRequestStatus,
} from '../../../components'
import {
  callFlowDetail,
  verificationBusinessTypes,
} from '../../../mock/inbound'
import { useAppStore } from '../../../store'
import type { BankAppPinVerificationStatus } from '../../../store'
import type {
  CustomerInformation,
  VerificationBusinessType,
  VerificationChannelType,
  VerificationQuestion,
  VerificationRule,
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
  accessMenuLabel?: string
  accessMenuName?: string
  customer: CustomerInformation
  identityRefreshPasteValue: string
  onCustomerIdentityRefresh: (customerId: string) => boolean
  showIvrJourney?: boolean
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

function getDefaultVerificationBusinessType(
  customer: CustomerInformation,
): VerificationBusinessType {
  if (customer.accessChannel === 'Webchat') {
    return 'paylater'
  }

  return 'perbankan'
}

function getVerificationChannelType(
  customer: CustomerInformation,
  pinStatus: BankAppPinVerificationStatus,
): VerificationChannelType {
  if (customer.accessChannel === 'Phone') {
    return 'phone'
  }

  if (customer.accessChannel === 'Video') {
    return 'video'
  }

  if (customer.accessChannel === 'WhatsApp') {
    return 'whatsapp'
  }

  if (customer.accessChannel === 'Webchat') {
    return 'webchat'
  }

  if (customer.accessChannel === 'Haloapps') {
    return 'haloapp-registered'
  }

  if (
    customer.accessChannel === 'BankApp' ||
    customer.accessChannel === 'Haloapps Voice' ||
    customer.accessChannel === 'Haloapps Video'
  ) {
    return pinStatus === 'verified'
      ? 'haloapp-registered'
      : 'haloapp-unregistered'
  }

  return 'phone'
}

function findVerificationRule(
  verificationRules: VerificationRule[],
  channelType: VerificationChannelType,
  businessType: VerificationBusinessType,
): VerificationRule | null {
  if (channelType === 'haloapp-unregistered') {
    return null
  }

  const exactRule = verificationRules.find(
    (rule) =>
      rule.channelType === channelType && rule.businessType === businessType,
  )

  if (exactRule?.status === 'enabled') {
    return exactRule
  }

  return (
    verificationRules.find(
      (rule) =>
        rule.channelType === 'phone' &&
        rule.businessType === businessType &&
        rule.status === 'enabled',
    ) ?? null
  )
}

export function CustomerInformationCard({
  accessMenuLabel = 'Access Menu',
  accessMenuName,
  customer,
  identityRefreshPasteValue,
  onCustomerIdentityRefresh,
  showIvrJourney,
}: CustomerInformationCardProps) {
  const requestCustomerOutboundCall = useAppStore(
    (state) => state.requestCustomerOutboundCall,
  )
  const bankAppPinVerificationStatus = useAppStore(
    (state) => state.bankAppPinVerificationStatus,
  )
  const configuredVerificationRules = useAppStore(
    (state) => state.verificationRules,
  )
  const requestBankAppPinVerification = useAppStore(
    (state) => state.requestBankAppPinVerification,
  )
  const { profile } = customer
  const customerKey = [
    customer.accessChannel,
    profile.cisNumber,
    profile.phoneNumber,
  ].join(':')
  const [verificationState, setVerificationState] = useState<{
    customerKey: string
    status: VerificationStatus
  }>(() => ({
    customerKey,
    status: customer.verificationStatus,
  }))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const defaultVerificationBusinessType =
    getDefaultVerificationBusinessType(customer)
  const [selectedBusinessState, setSelectedBusinessState] = useState<{
    businessType: VerificationBusinessType
    customerKey: string
  }>(() => ({
    businessType: defaultVerificationBusinessType,
    customerKey,
  }))
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<string, QuestionStepStatus>
  >({})
  const [isCallFlowOpen, setIsCallFlowOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const defaultContacts = useMemo(
    () => createContactsForCustomerProfile(profile.email, profile.phoneNumber),
    [profile.email, profile.phoneNumber],
  )
  const [contactsState, setContactsState] = useState<{
    contacts: ContactGroups
    customerKey: string
  }>(() => ({
    contacts: defaultContacts,
    customerKey,
  }))
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isIdentityRefreshOpen, setIsIdentityRefreshOpen] = useState(false)
  const [identityCustomerId, setIdentityCustomerId] = useState('')
  const [identityRefreshError, setIdentityRefreshError] = useState<
    string | null
  >(null)
  const verificationStatus =
    verificationState.customerKey === customerKey
      ? verificationState.status
      : customer.verificationStatus
  const selectedBusinessType =
    selectedBusinessState.customerKey === customerKey
      ? selectedBusinessState.businessType
      : defaultVerificationBusinessType
  const contacts =
    contactsState.customerKey === customerKey
      ? contactsState.contacts
      : defaultContacts
  const [outboundRequestStatuses, setOutboundRequestStatuses] = useState<
    Record<string, CustomerOutboundRequestStatus>
  >({})
  const outboundApprovalTimerRefs = useRef<Record<string, number>>({})
  const outboundRequestStatus =
    outboundRequestStatuses[customerKey] ?? 'idle'
  const shouldShowIvrJourney =
    showIvrJourney ??
    (customer.accessChannel === 'Phone' ||
      customer.accessChannel.includes('Voice'))
  const finalIvrStep = shouldShowIvrJourney
    ? callFlowDetail.ivrJourney[callFlowDetail.ivrJourney.length - 1]
    : undefined
  const routeMenuName = accessMenuName ?? finalIvrStep?.nodeName
  const routeMenuAriaLabel = accessMenuName
    ? `${accessMenuLabel}: ${accessMenuName}`
    : routeMenuName
      ? `Last IVR menu: ${routeMenuName}`
      : ''
  const verificationChannelType = getVerificationChannelType(
    customer,
    bankAppPinVerificationStatus,
  )
  const verificationRule = useMemo(
    () =>
      findVerificationRule(
        configuredVerificationRules,
        verificationChannelType,
        selectedBusinessType,
      ),
    [configuredVerificationRules, selectedBusinessType, verificationChannelType],
  )

  useEffect(
    () => () => {
      Object.values(outboundApprovalTimerRefs.current).forEach((timerId) =>
        window.clearTimeout(timerId),
      )
    },
    [],
  )

  const resetVerificationProgress = () => {
    setActiveQuestionIndex(0)
    setQuestionStatuses({})
  }

  const openVerification = () => {
    resetVerificationProgress()
    setIsModalOpen(true)
  }

  const handleBusinessTypeChange = (
    nextBusinessType: VerificationBusinessType,
  ) => {
    setSelectedBusinessState({
      businessType: nextBusinessType,
      customerKey,
    })
    resetVerificationProgress()
  }

  const handleQuestionAction = (
    question: VerificationQuestion,
    questionIndex: number,
    status: QuestionStepStatus,
  ) => {
    const questions = verificationRule?.questions ?? []
    const nextQuestionStatuses = {
      ...questionStatuses,
      [question.id]: status,
    }
    const nextQuestionIndex = questions.findIndex(
      (item, index) => index > questionIndex && !nextQuestionStatuses[item.id],
    )
    const firstOpenQuestionIndex = questions.findIndex(
      (item) => !nextQuestionStatuses[item.id],
    )

    setQuestionStatuses(nextQuestionStatuses)
    setActiveQuestionIndex(
      nextQuestionIndex >= 0
        ? nextQuestionIndex
        : firstOpenQuestionIndex >= 0
          ? firstOpenQuestionIndex
          : Math.min(questionIndex, Math.max(questions.length - 1, 0)),
    )
  }

  const finishVerification = (status: VerificationStatus) => {
    setVerificationState({
      customerKey,
      status,
    })
    setIsModalOpen(false)
  }

  const handleIdentityRefreshOpenChange = (open: boolean) => {
    setIsIdentityRefreshOpen(open)

    if (!open) {
      setIdentityRefreshError(null)
      return
    }

    setIdentityRefreshError(null)
  }

  const pasteIdentityCustomerId = () => {
    setIdentityCustomerId(identityRefreshPasteValue)
    setIdentityRefreshError(null)
  }

  const confirmIdentityRefresh = () => {
    const normalizedCustomerId = identityCustomerId.trim()

    if (!normalizedCustomerId) {
      setIdentityRefreshError('Customer ID is required.')
      return
    }

    if (!onCustomerIdentityRefresh(normalizedCustomerId)) {
      setIdentityRefreshError('No customer found for this ID.')
      return
    }

    setIdentityRefreshError(null)
    setIsIdentityRefreshOpen(false)
  }

  const requestOutboundApproval = () => {
    if (outboundRequestStatus !== 'idle') {
      return
    }

    setOutboundRequestStatuses((current) => ({
      ...current,
      [customerKey]: 'requesting',
    }))
    outboundApprovalTimerRefs.current[customerKey] = window.setTimeout(() => {
      setOutboundRequestStatuses((current) => ({
        ...current,
        [customerKey]: 'approved',
      }))
      delete outboundApprovalTimerRefs.current[customerKey]
    }, 3000)
  }

  const startApprovedOutboundCall = () => {
    if (outboundRequestStatus === 'approved') {
      requestCustomerOutboundCall()
    }
  }

  const identityRefreshContent = (
    <div className="aicc-identity-refresh-popover">
      <label
        className="aicc-identity-refresh-popover__label"
        htmlFor="customer-identity-refresh-input"
      >
        Customer ID
      </label>
      <Input
        allowClear
        id="customer-identity-refresh-input"
        placeholder="Paste or enter customer ID"
        size="small"
        status={identityRefreshError ? 'error' : undefined}
        value={identityCustomerId}
        onChange={(event) => {
          setIdentityCustomerId(event.target.value)
          setIdentityRefreshError(null)
        }}
        onPressEnter={confirmIdentityRefresh}
      />
      {identityRefreshError && (
        <div
          className="aicc-identity-refresh-popover__error"
          role="alert"
        >
          {identityRefreshError}
        </div>
      )}
      <div className="aicc-identity-refresh-popover__actions">
        <BaseButton size="small" onClick={pasteIdentityCustomerId}>
          Paste
        </BaseButton>
        <BaseButton
          size="small"
          type="primary"
          onClick={confirmIdentityRefresh}
        >
          Confirm
        </BaseButton>
      </div>
    </div>
  )

  return (
    <>
      <CustomerInformationPanel
        accessChannelNode={
          <ChannelTag
            compact
            duration={customer.accessDuration}
            value={customer.accessChannel}
          />
        }
        accessRouteHintNode={
          routeMenuName ? (
            <>
              <ApartmentOutlined />
              <span className="aicc-customer-info__route-label">
                Menu
              </span>
              <span
                aria-label={routeMenuAriaLabel}
                className="aicc-customer-info__route-value"
                title={routeMenuAriaLabel}
              >
                {routeMenuName}
              </span>
            </>
          ) : undefined
        }
        className="inbound-section-card inbound-section-card--customer"
        customer={customer}
        headerExtra={
          <div className="aicc-customer-info__header-actions">
            <Popover
              content={identityRefreshContent}
              open={isIdentityRefreshOpen}
              placement="bottom"
              trigger="click"
              onOpenChange={handleIdentityRefreshOpenChange}
            >
              <button
                aria-label="Refresh customer identity"
                className="aicc-customer-info__edit-button"
                title="Refresh Customer Identity"
                type="button"
              >
                <SyncOutlined />
              </button>
            </Popover>
            <button
              aria-label="Edit contact"
              className="aicc-customer-info__edit-button"
              title="Edit Contact"
              type="button"
              onClick={() => setIsContactModalOpen(true)}
            >
              <EditOutlined />
            </button>
          </div>
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
          businessTypes={verificationBusinessTypes}
          channelType={verificationChannelType}
          pinStatus={bankAppPinVerificationStatus}
          questionStatuses={questionStatuses}
          rule={verificationRule}
          selectedBusinessType={selectedBusinessType}
          onBusinessTypeChange={handleBusinessTypeChange}
          onFinish={finishVerification}
          onQuestionAction={handleQuestionAction}
          onReset={resetVerificationProgress}
          onSendPinVerification={requestBankAppPinVerification}
        />
      </BaseModal>
      <CallFlowDetailModal
        accessMenuLabel={accessMenuLabel}
        accessMenuName={accessMenuName}
        open={isCallFlowOpen}
        showIvrJourney={shouldShowIvrJourney}
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
