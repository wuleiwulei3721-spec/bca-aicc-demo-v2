import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BaseButton,
  OperationNotice,
  TicketRegistrationDrawer,
} from '../../components'
import type { TicketRegistrationDraft } from '../../components'
import {
  customerJourney,
  lookupCustomerByCis,
  nextBestActions,
  quickActions,
  ticketingHistory,
} from '../../mock/inbound'
import type {
  CrmWorkspaceTab,
  CustomerInformation,
  CustomerJourneyItem,
  TicketHistoryItem,
  VerificationStatus,
} from '../../types'
import type { CallTransferContext } from '../../store'
import { AssistantPanel } from './components/AssistantPanel'
import type { AssistantPanelExtraTab } from './components/AssistantPanel'
import { CONVERSATION_TAB_KEY, CrmPanel } from './components/CrmPanel'
import type { ConversationWorkspaceConfig } from './components/ConversationWorkspace'
import type { CustomerVerificationPanelConfig } from './components/CustomerInformationCard'
import { CustomerVerificationV2Panel } from './components/CustomerVerificationV2Modal'
import { LeftColumn } from './components/LeftColumn'
import {
  createCrmCisRequest,
  isCrmCisResponseMessage,
} from '../../utils/crmCustomerIdentity'

const CRM_TAB_KEY = 'crm'
const VERIFICATION_TAB_KEY = 'verification'
const CRM_CIS_REQUEST_TIMEOUT_MS = 1200

interface InteractionWorkspaceProps {
  accessMenuLabel?: string
  accessMenuName?: string
  ariaLabel: string
  assistantActiveKey?: string
  assistantExtraTabs?: AssistantPanelExtraTab[]
  className?: string
  conversation?: ConversationWorkspaceConfig
  conversationContent?: ReactNode
  conversationKey?: string
  customer: CustomerInformation
  initialJourney?: CustomerJourneyItem[]
  initialTickets?: TicketHistoryItem[]
  leadPanel?: ReactNode
  onAssistantActiveKeyChange?: (activeKey: string) => void
  onAssistantCloseExtraTab?: (targetKey: string) => void
  overlay?: ReactNode
  showIvrJourney?: boolean
  showTransferHistory?: boolean
  transferContext?: CallTransferContext
}

export function InteractionWorkspace({
  accessMenuLabel,
  accessMenuName,
  ariaLabel,
  assistantActiveKey,
  assistantExtraTabs,
  className,
  conversation,
  conversationContent,
  conversationKey,
  customer,
  initialJourney,
  initialTickets,
  leadPanel,
  onAssistantActiveKeyChange,
  onAssistantCloseExtraTab,
  overlay,
  showIvrJourney,
  showTransferHistory,
  transferContext,
}: InteractionWorkspaceProps) {
  const [internalAssistantActiveKey, setInternalAssistantActiveKey] =
    useState('assistant')
  const [verificationPanelConfig, setVerificationPanelConfig] =
    useState<CustomerVerificationPanelConfig | null>(null)
  const [verificationConditions, setVerificationConditions] = useState<{
    sourceKey: string
    values: CustomerVerificationPanelConfig['initialConditions']
  } | null>(null)
  const [crmRefreshError, setCrmRefreshError] = useState<{
    id: number
    message: string | null
  }>({
    id: 0,
    message: null,
  })
  const [isTicketOpen, setIsTicketOpen] = useState(false)
  const [ticketSaveNotice, setTicketSaveNotice] = useState<{
    id: number
    message: string | null
  }>({
    id: 0,
    message: null,
  })
  const pendingCrmCisRequestRef = useRef<{
    correlationId: string
    sourceKey: string
    timeoutId: number
  } | null>(null)
  const [crmWorkspace, setCrmWorkspace] = useState<{
    activeKey: string
    tabs: CrmWorkspaceTab[]
  }>({
    activeKey:
      conversation || conversationContent ? CONVERSATION_TAB_KEY : CRM_TAB_KEY,
    tabs: [],
  })
  const initialJourneyItems = initialJourney ?? customerJourney
  const initialTicketItems = initialTickets ?? ticketingHistory
  const sourceCustomerKey = [
    customer.accessChannel,
    customer.profile.cisNumber,
    customer.profile.phoneNumber,
    customer.profile.email,
    customer.profile.name,
  ].join(':')
  const sourceCustomer = useMemo<CustomerInformation>(
    () => ({
      accessChannel: customer.accessChannel,
      accessDuration: '',
      bankAppLoginStatus: customer.bankAppLoginStatus,
      profile: {
        avatarInitials: customer.profile.avatarInitials,
        avatarUrl: customer.profile.avatarUrl,
        cisNumber: customer.profile.cisNumber,
        crmContacts: customer.profile.crmContacts,
        customerType: customer.profile.customerType,
        email: customer.profile.email,
        name: customer.profile.name,
        phoneNumber: customer.profile.phoneNumber,
      },
      verificationStatus: customer.verificationStatus,
    }),
    [
      customer.accessChannel,
      customer.bankAppLoginStatus,
      customer.profile.avatarInitials,
      customer.profile.avatarUrl,
      customer.profile.cisNumber,
      customer.profile.crmContacts,
      customer.profile.customerType,
      customer.profile.email,
      customer.profile.name,
      customer.profile.phoneNumber,
      customer.verificationStatus,
    ],
  )
  const sourceIdentityData = useMemo<{
    customer: CustomerInformation
    journey: CustomerJourneyItem[]
    tickets: TicketHistoryItem[]
  }>(
    () => ({
      customer: sourceCustomer,
      journey: initialJourneyItems,
      tickets: initialTicketItems,
    }),
    [initialJourneyItems, initialTicketItems, sourceCustomer],
  )
  const [identityOverride, setIdentityOverride] = useState<{
    data: {
      customer: CustomerInformation
      journey: CustomerJourneyItem[]
      tickets: TicketHistoryItem[]
    }
    sourceKey: string
  } | null>(null)
  const [verificationStatusOverride, setVerificationStatusOverride] = useState<{
    sourceKey: string
    status: VerificationStatus
  } | null>(null)
  const identityData =
    identityOverride?.sourceKey === sourceCustomerKey
      ? identityOverride.data
      : sourceIdentityData

  const displayCustomer = useMemo(
    () => ({
      ...identityData.customer,
      accessChannel: customer.accessChannel,
      accessDuration: customer.accessDuration,
      bankAppLoginStatus: customer.bankAppLoginStatus,
      verificationStatus:
        verificationStatusOverride?.sourceKey === sourceCustomerKey
          ? verificationStatusOverride.status
          : identityData.customer.verificationStatus,
    }),
    [
      customer.accessChannel,
      customer.accessDuration,
      customer.bankAppLoginStatus,
      identityData.customer,
      sourceCustomerKey,
      verificationStatusOverride,
    ],
  )
  const displayCustomerKey = [
    displayCustomer.accessChannel,
    displayCustomer.profile.cisNumber,
    displayCustomer.profile.phoneNumber,
  ].join(':')
  const currentVerificationConditions =
    verificationConditions?.sourceKey === sourceCustomerKey
      ? verificationConditions.values
      : undefined

  const openCrmWorkspaceTab = useCallback((tab: CrmWorkspaceTab) => {
    setCrmWorkspace((current) => ({
      activeKey: tab.key,
      tabs: current.tabs.some((item) => item.key === tab.key)
        ? current.tabs
        : [...current.tabs, tab],
    }))
  }, [])

  const closeCrmWorkspaceTab = useCallback((targetKey: string) => {
    setCrmWorkspace((current) => {
      const removedIndex = current.tabs.findIndex(
        (tab) => tab.key === targetKey,
      )
      const tabs = current.tabs.filter((tab) => tab.key !== targetKey)
      const nextActiveTab =
        tabs[Math.max(0, removedIndex - 1)] ?? tabs[0]

      return {
        activeKey:
          current.activeKey === targetKey
            ? nextActiveTab?.key ?? CRM_TAB_KEY
            : current.activeKey,
        tabs,
      }
    })
  }, [])

  const clearPendingCrmCisRequest = useCallback(() => {
    const pendingRequest = pendingCrmCisRequestRef.current

    if (pendingRequest) {
      window.clearTimeout(pendingRequest.timeoutId)
      pendingCrmCisRequestRef.current = null
    }
  }, [])

  const saveTicket = useCallback(
    (draft: TicketRegistrationDraft) => {
      const ticketNumber = `CRM${String(Date.now()).slice(-6)}`
      const createdTicket: TicketHistoryItem = {
        createdDate: new Date().toISOString().slice(0, 10),
        caseCategory: draft.caseCategory,
        id: `ticket-${ticketNumber}`,
        product: draft.product,
        ticketNumber,
      }

      setIdentityOverride((current) => {
        const currentData =
          current?.sourceKey === sourceCustomerKey
            ? current.data
            : sourceIdentityData

        return {
          data: {
            ...currentData,
            tickets: [createdTicket, ...currentData.tickets],
          },
          sourceKey: sourceCustomerKey,
        }
      })
      setTicketSaveNotice({
        id: Date.now(),
        message: 'Ticket saved to CRM.',
      })
    },
    [sourceCustomerKey, sourceIdentityData],
  )

  const showCrmRefreshError = useCallback(() => {
    setCrmRefreshError((current) => ({
      id: current.id + 1,
      message: 'CRM customer information could not be refreshed.',
    }))
  }, [])

  const requestCrmCis = useCallback(() => {
    if (pendingCrmCisRequestRef.current) {
      return
    }

    const correlationId = crypto.randomUUID()
    const timeoutId = window.setTimeout(() => {
      if (
        pendingCrmCisRequestRef.current?.correlationId !== correlationId
      ) {
        return
      }

      pendingCrmCisRequestRef.current = null
      showCrmRefreshError()
    }, CRM_CIS_REQUEST_TIMEOUT_MS)

    pendingCrmCisRequestRef.current = {
      correlationId,
      sourceKey: sourceCustomerKey,
      timeoutId,
    }
    window.postMessage(createCrmCisRequest(correlationId), window.location.origin)
  }, [showCrmRefreshError, sourceCustomerKey])

  useEffect(() => {
    const handleCrmCisResponse = (event: MessageEvent<unknown>) => {
      const pendingRequest = pendingCrmCisRequestRef.current

      if (
        event.origin !== window.location.origin ||
        !pendingRequest ||
        !isCrmCisResponseMessage(event.data) ||
        event.data.correlationId !== pendingRequest.correlationId
      ) {
        return
      }

      const refreshResult = lookupCustomerByCis(event.data.cisNumber)
      clearPendingCrmCisRequest()

      if (!refreshResult) {
        showCrmRefreshError()
        return
      }

      setIdentityOverride({
        data: {
          customer: {
            ...refreshResult.customer,
            accessChannel: customer.accessChannel,
            accessDuration: customer.accessDuration,
            bankAppLoginStatus: customer.bankAppLoginStatus,
            verificationStatus: 'Verified',
          },
          journey: refreshResult.journey,
          tickets: refreshResult.tickets,
        },
        sourceKey: pendingRequest.sourceKey,
      })
      setVerificationStatusOverride({
        sourceKey: pendingRequest.sourceKey,
        status: 'Verified',
      })
    }

    window.addEventListener('message', handleCrmCisResponse)

    return () => window.removeEventListener('message', handleCrmCisResponse)
  }, [clearPendingCrmCisRequest, customer.accessChannel, customer.accessDuration, customer.bankAppLoginStatus, showCrmRefreshError])

  useEffect(() => {
    return () => clearPendingCrmCisRequest()
  }, [clearPendingCrmCisRequest, sourceCustomerKey])

  useEffect(() => {
    if (!crmRefreshError.message) {
      return undefined
    }

    const noticeId = crmRefreshError.id
    const timer = window.setTimeout(() => {
      setCrmRefreshError((current) =>
        current.id === noticeId ? { ...current, message: null } : current,
      )
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [crmRefreshError.id, crmRefreshError.message])

  useEffect(() => {
    if (!ticketSaveNotice.message) {
      return undefined
    }

    const noticeId = ticketSaveNotice.id
    const timer = window.setTimeout(() => {
      setTicketSaveNotice((current) =>
        current.id === noticeId ? { ...current, message: null } : current,
      )
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [ticketSaveNotice.id, ticketSaveNotice.message])

  const handleVerificationFinish = useCallback(
    (status: VerificationStatus) => {
      setVerificationStatusOverride({ sourceKey: sourceCustomerKey, status })

      if (status === 'Verified') {
        requestCrmCis()
      }
    },
    [requestCrmCis, sourceCustomerKey],
  )
  const handleAssistantActiveKeyChange = useCallback(
    (activeKey: string) => {
      setInternalAssistantActiveKey(activeKey)
      onAssistantActiveKeyChange?.(activeKey)
    },
    [onAssistantActiveKeyChange],
  )
  const openVerificationPanel = useCallback(
    (config: CustomerVerificationPanelConfig) => {
      setVerificationConditions({
        sourceKey: sourceCustomerKey,
        values: config.initialConditions,
      })
      setVerificationPanelConfig({
        ...config,
        onConditionsChange: (conditions) =>
          setVerificationConditions({
            sourceKey: sourceCustomerKey,
            values: conditions,
          }),
      })
      handleAssistantActiveKeyChange(VERIFICATION_TAB_KEY)
    },
    [handleAssistantActiveKeyChange, sourceCustomerKey],
  )
  const closeVerificationPanel = useCallback(() => {
    setVerificationPanelConfig(null)
    handleAssistantActiveKeyChange('assistant')
  }, [handleAssistantActiveKeyChange])
  const currentVerificationPanelConfig =
    verificationPanelConfig?.customerKey === displayCustomerKey
      ? verificationPanelConfig
      : null
  const requestedAssistantActiveKey =
    assistantActiveKey ?? internalAssistantActiveKey
  const currentAssistantActiveKey =
    requestedAssistantActiveKey === VERIFICATION_TAB_KEY &&
    !currentVerificationPanelConfig
      ? 'assistant'
      : requestedAssistantActiveKey

  return (
    <>
      <section
        className={['inbound-page', className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      >
        {leadPanel}
        <LeftColumn
          accessMenuLabel={accessMenuLabel}
          accessMenuName={accessMenuName}
          customer={displayCustomer}
          journey={identityData.journey}
          nextBestActions={nextBestActions}
          quickActions={quickActions}
          tickets={identityData.tickets}
          showIvrJourney={showIvrJourney}
          showTransferHistory={showTransferHistory}
          transferContext={transferContext}
          onOpenCrm={openCrmWorkspaceTab}
          onOpenVerification={openVerificationPanel}
          onVerificationFinish={handleVerificationFinish}
          verificationConditions={currentVerificationConditions}
        />
        <CrmPanel
          activeKey={crmWorkspace.activeKey}
          conversation={conversation}
          conversationContent={conversationContent}
          conversationKey={conversationKey}
          tabBarExtraContent={
            <BaseButton
              size="small"
              variant="primary"
              onClick={() => setIsTicketOpen(true)}
            >
              Ticket
            </BaseButton>
          }
          workspaceTabs={crmWorkspace.tabs}
          onActiveKeyChange={(activeKey) =>
            setCrmWorkspace((current) => ({ ...current, activeKey }))
          }
          onCloseTab={closeCrmWorkspaceTab}
        />
        <AssistantPanel
          activeKey={currentAssistantActiveKey}
          extraTabs={assistantExtraTabs}
          verificationTab={
            currentVerificationPanelConfig ? (
              <CustomerVerificationV2Panel
                initialConditions={
                  currentVerificationPanelConfig.initialConditions
                }
                questionBank={currentVerificationPanelConfig.questionBank}
                rules={currentVerificationPanelConfig.rules}
                variant="compact"
                onFinish={currentVerificationPanelConfig.onFinish}
              />
            ) : undefined
          }
          onCloseVerificationTab={closeVerificationPanel}
          onActiveKeyChange={handleAssistantActiveKeyChange}
          onCloseExtraTab={onAssistantCloseExtraTab}
        />
      </section>
      <OperationNotice message={crmRefreshError.message} tone="error" />
      <OperationNotice message={ticketSaveNotice.message} tone="success" />
      <TicketRegistrationDrawer
        contextLabel={conversation?.session.intent ?? accessMenuName}
        open={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onConfirm={saveTicket}
      />
      {overlay}
    </>
  )
}
