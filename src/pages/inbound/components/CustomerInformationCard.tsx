import { useEffect, useMemo, useRef, useState } from 'react'
import {
  EditOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { Input, Popover } from 'antd'
import {
  BaseButton,
  CustomerInformationPanel,
  type CustomerOutboundRequestStatus,
} from '../../../components'
import { callFlowDetail } from '../../../mock/inbound'
import { useAppStore } from '../../../store'
import type {
  CustomerInformation,
  VerificationV2CustomerSegment,
  VerificationV2DemoConditions,
  VerificationStatus,
} from '../../../types'
import {
  getDefaultVerificationV2ChannelCode,
  getDefaultVerificationV2SkillQueueCode,
} from '../../../utils/verificationRuleV2'
import { CallFlowDetailModal } from './CallFlowDetailModal'
import { ChannelTag } from './ChannelTag'
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
  onOpenVerification: (config: CustomerVerificationPanelConfig) => void
  showIvrJourney?: boolean
  showTransferHistory?: boolean
}

export interface CustomerVerificationPanelConfig {
  customerKey: string
  initialConditions: VerificationV2DemoConditions
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

export function CustomerInformationCard({
  accessMenuLabel = 'Access Menu',
  accessMenuName,
  customer,
  identityRefreshPasteValue,
  onCustomerIdentityRefresh,
  onOpenVerification,
  showIvrJourney,
  showTransferHistory,
}: CustomerInformationCardProps) {
  const requestCustomerOutboundCall = useAppStore(
    (state) => state.requestCustomerOutboundCall,
  )
  const verificationV2QuestionBank = useAppStore(
    (state) => state.verificationV2QuestionBank,
  )
  const verificationV2Rules = useAppStore(
    (state) => state.verificationV2Rules,
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
  const initialVerificationV2Conditions = useMemo<VerificationV2DemoConditions>(
    () => ({
      channelCode: getDefaultVerificationV2ChannelCode(customer.accessChannel),
      customerSegment: getCustomerSegmentFromProfile(profile.customerType),
      organizationSegment: 'none',
      skillQueueCode: getDefaultVerificationV2SkillQueueCode(
        customer.accessChannel,
        accessMenuName ?? routeMenuName,
      ),
      scenarioId: 'default',
    }),
    [accessMenuName, customer.accessChannel, profile.customerType, routeMenuName],
  )

  useEffect(
    () => () => {
      Object.values(outboundApprovalTimerRefs.current).forEach((timerId) =>
        window.clearTimeout(timerId),
      )
    },
    [],
  )

  const openVerification = () => {
    onOpenVerification({
      customerKey,
      initialConditions: initialVerificationV2Conditions,
      questionBank: verificationV2QuestionBank,
      rules: verificationV2Rules,
      onFinish: finishVerification,
    })
  }

  const finishVerification = (status: VerificationStatus) => {
    setVerificationState({
      customerKey,
      status,
    })
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

      <CallFlowDetailModal
        accessMenuLabel={accessMenuLabel}
        accessMenuName={accessMenuName}
        open={isCallFlowOpen}
        showIvrJourney={shouldShowIvrJourney}
        showTransferHistory={showTransferHistory}
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
