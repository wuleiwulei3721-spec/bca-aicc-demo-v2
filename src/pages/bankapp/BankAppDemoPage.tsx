import { useEffect, useMemo, useState } from 'react'
import {
  AudioOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  LockOutlined,
  MobileOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  VideoCameraOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import { BaseButton } from '../../components'
import {
  bankAppBusinessOptions,
  bankAppContactMethods,
  bankAppScreenshotSources,
  webchatScreenshotSources,
  whatsAppScreenshotSources,
} from '../../mock/bankapp'
import {
  useAppStore,
  type BankAppVideoShareState,
} from '../../store'
import type {
  BankAppBusinessOption,
  BankAppBusinessType,
  BankAppContactMethod,
  BankAppCustomerType,
  BankAppDemoStep,
  BankAppLanguage,
} from '../../types'

const BANKAPP_LIVE_CHAT_SESSION_ID = 'live-chat-002'
const WEBCHAT_LIVE_CHAT_SESSION_ID = 'live-chat-003'
const WHATSAPP_LIVE_CHAT_SESSION_ID = 'live-chat-001'
type HandoffWarningReason = 'active-call' | 'not-ready'

type CustomerAppDemoVariant = 'bankapp' | 'webchat' | 'whatsapp'

interface CustomerAppDemoConfig {
  ariaLabel: string
  channelLabel: string
  contactMethods: BankAppContactMethod[]
  defaultContactMethod: BankAppContactMethod
  liveChatSessionId: string
  phoneTitle: string
}

const demoConfigs: Record<CustomerAppDemoVariant, CustomerAppDemoConfig> = {
  bankapp: {
    ariaLabel: 'BankApp customer demo',
    channelLabel: 'BankApp',
    contactMethods: ['voice', 'video', 'livechat'],
    defaultContactMethod: 'voice',
    liveChatSessionId: BANKAPP_LIVE_CHAT_SESSION_ID,
    phoneTitle: 'Customer BankApp',
  },
  whatsapp: {
    ariaLabel: 'WhatsApp customer demo',
    channelLabel: 'WhatsApp',
    contactMethods: ['livechat'],
    defaultContactMethod: 'livechat',
    liveChatSessionId: WHATSAPP_LIVE_CHAT_SESSION_ID,
    phoneTitle: 'Customer WhatsApp',
  },
  webchat: {
    ariaLabel: 'Webchat customer demo',
    channelLabel: 'Webchat',
    contactMethods: ['livechat'],
    defaultContactMethod: 'livechat',
    liveChatSessionId: WEBCHAT_LIVE_CHAT_SESSION_ID,
    phoneTitle: 'Customer Webchat',
  },
}

const stepLabels: Record<BankAppDemoStep, string> = {
  'agent-workspace': 'Agent Workspace',
  business: 'Select Inquiry Topic',
  calling: 'Queue Routing',
  channel: 'Choose Contact Method',
  chat: 'Text Chat',
  closed: 'Service Closed',
  confirm: 'Confirm Request',
  connected: 'Connected Call',
  'personal-info': 'Personal Information',
  'phone-number': 'Guest Information',
  'pin-input': 'Customer PIN Result',
  'pin-request': 'PIN Verification',
  'question-verification': 'Question Verification',
  'screen-sharing': 'Screen Sharing',
  'share-view': 'View Shared Screen',
}

const whatsAppStepLabels: Partial<Record<BankAppDemoStep, string>> = {
  'agent-workspace': 'Agent Workspace',
  business: 'Business Selection',
  channel: 'Request Human Agent',
  chat: 'Queue & Agent Chat',
  closed: 'Satisfaction Rating',
}

const webchatStepLabels: Partial<Record<BankAppDemoStep, string>> = {
  calling: 'Queue Routing',
  channel: 'Guest Information',
  chat: 'Text Chat',
  closed: 'Satisfaction Rating',
}

const bankOwnedSteps = new Set<BankAppDemoStep>([
  'business',
  'channel',
  'closed',
  'confirm',
  'personal-info',
  'pin-input',
  'phone-number',
  'question-verification',
  'screen-sharing',
])

const whatsAppStepSequence: BankAppDemoStep[] = [
  'channel',
  'business',
  'chat',
  'agent-workspace',
  'closed',
]

const webchatRegisteredStepSequence: BankAppDemoStep[] = [
  'calling',
  'agent-workspace',
  'chat',
  'closed',
]

const webchatGuestStepSequence: BankAppDemoStep[] = [
  'channel',
  'calling',
  'agent-workspace',
  'chat',
  'closed',
]

const businessHotspots: BankAppBusinessType[] = [
  'mobile-login',
  'card-issue',
  'account-info',
  'transaction-dispute',
]

function getStepSequence(
  contactMethod: BankAppContactMethod,
  customerType: BankAppCustomerType,
  variant: CustomerAppDemoVariant,
): BankAppDemoStep[] {
  if (variant === 'whatsapp') {
    return whatsAppStepSequence
  }

  if (variant === 'webchat') {
    return customerType === 'registered'
      ? webchatRegisteredStepSequence
      : webchatGuestStepSequence
  }

  const phoneStep: BankAppDemoStep[] =
    customerType === 'guest' ? ['phone-number'] : []

  if (contactMethod === 'livechat') {
    const personalInfoStep: BankAppDemoStep[] =
      customerType === 'guest' ? ['personal-info'] : []
    const pinSteps: BankAppDemoStep[] =
      customerType === 'registered' ? ['pin-request', 'pin-input'] : []

    return [
      'channel',
      ...personalInfoStep,
      'confirm',
      'calling',
      'agent-workspace',
      'chat',
      ...pinSteps,
      'closed',
    ]
  }

  if (contactMethod === 'voice') {
    return [
      'channel',
      ...phoneStep,
      'business',
      'calling',
      'agent-workspace',
      'connected',
      'question-verification',
      'closed',
    ]
  }

  return [
    'channel',
    ...phoneStep,
    'business',
    'calling',
    'agent-workspace',
    'connected',
    'share-view',
    'closed',
  ]
}

function getBusinessLabel(
  option: BankAppBusinessOption,
  language: BankAppLanguage,
) {
  return language === 'id' ? option.labelId : option.label
}

function getMethodLabel(method: BankAppContactMethod) {
  return (
    bankAppContactMethods.find((item) => item.id === method)?.label ??
    'Voice Call'
  )
}

function getStepLabel(
  step: BankAppDemoStep,
  variant: CustomerAppDemoVariant,
  contactMethod?: BankAppContactMethod,
) {
  if (variant === 'whatsapp') {
    return whatsAppStepLabels[step] ?? stepLabels[step]
  }

  if (variant === 'webchat') {
    return webchatStepLabels[step] ?? stepLabels[step]
  }

  if (
    variant === 'bankapp' &&
    contactMethod === 'livechat' &&
    step === 'confirm'
  ) {
    return 'Confirm Contact CS'
  }

  if (
    variant === 'bankapp' &&
    contactMethod === 'video' &&
    step === 'connected'
  ) {
    return 'Video Call & Start Screen Share'
  }

  return stepLabels[step]
}

function getStepOwner(step: BankAppDemoStep, variant: CustomerAppDemoVariant) {
  if (variant === 'whatsapp') {
    if (step === 'agent-workspace') {
      return 'Netinfo'
    }

    return 'Bank1'
  }

  if (variant === 'webchat') {
    return step === 'agent-workspace' || step === 'pin-request'
      ? 'Netinfo'
      : 'BANK'
  }

  return bankOwnedSteps.has(step) ? 'BANK1' : 'Netinfo'
}

function getLiveChatStepOwner(step: BankAppDemoStep) {
  const owners: Partial<Record<BankAppDemoStep, string>> = {
    'agent-workspace': 'Netinfo',
    calling: 'BANK',
    channel: 'BANK',
    chat: 'BANK',
    closed: 'BANK',
    confirm: 'BANK',
    'personal-info': 'BANK',
    'pin-input': 'BANK',
    'pin-request': 'Netinfo',
  }

  return owners[step] ?? getStepOwner(step, 'bankapp')
}

function getDisplayStepOwner(
  step: BankAppDemoStep,
  variant: CustomerAppDemoVariant,
  contactMethod: BankAppContactMethod,
) {
  if (variant === 'bankapp' && contactMethod === 'livechat') {
    return getLiveChatStepOwner(step)
  }

  if (
    variant === 'bankapp' &&
    (contactMethod === 'voice' || contactMethod === 'video')
  ) {
    const netinfoSteps = new Set<BankAppDemoStep>([
      'agent-workspace',
      'calling',
      'connected',
      'question-verification',
      'screen-sharing',
      'share-view',
    ])

    return netinfoSteps.has(step) ? 'Netinfo' : 'BANK'
  }

  return getStepOwner(step, variant)
}

function getStepOwnerClassName(owner: string) {
  if (owner.includes('BANK') || owner.includes('Bank')) {
    return 'bank1'
  }

  return 'netinfo'
}

function getRoutedSkill(
  option: BankAppBusinessOption,
  customerType: BankAppCustomerType,
  language: BankAppLanguage,
  method: BankAppContactMethod,
) {
  const baseSkill =
    customerType === 'registered' ? option.registeredSkill : option.guestSkill
  const methodLabel =
    method === 'livechat'
      ? language === 'id'
        ? 'Chat'
        : 'Live Chat'
      : method === 'voice'
        ? language === 'id'
          ? 'Suara'
          : 'Voice'
        : language === 'id'
          ? 'Video'
          : 'Video'

  return `${baseSkill} / ${methodLabel}`
}

function getProcessDescription(
  step: BankAppDemoStep,
  channelLabel: string,
  variant: CustomerAppDemoVariant,
  contactMethod: BankAppContactMethod,
  customerType: BankAppCustomerType,
) {
  if (variant === 'whatsapp') {
    const descriptions: Partial<Record<BankAppDemoStep, string>> = {
      business: 'Customer chooses Chat CS Bank 1 from the WhatsApp business menu.',
      'agent-workspace': 'Agent reviews the inbound WhatsApp conversation in Live Chat.',
      channel: 'Customer opens WhatsApp chat and requests transfer to human service.',
      chat: 'Customer waits in queue and is connected with a Bank 1 agent.',
      closed: 'Customer receives the satisfaction rating menu after service ends.',
    }

    return descriptions[step] ?? ''
  }

  if (variant === 'webchat') {
    const descriptions: Partial<Record<BankAppDemoStep, string>> = {
      'agent-workspace':
        'Agent receives a new Webchat customer in the Live Chat workspace.',
      calling:
        customerType === 'registered'
          ? 'Logged-in Webchat customer is routed directly to the text queue without information input or menu selection.'
          : 'Guest Webchat customer submits contact information and the request is routed to the text queue.',
      channel:
        'Guest Webchat customer enters contact information and selects the request topic. Registered customers skip this step.',
      chat: 'Customer and agent exchange Webchat text messages.',
      closed: 'Customer receives the Webchat satisfaction rating page.',
    }

    return descriptions[step] ?? ''
  }

  if (contactMethod === 'livechat') {
    const descriptions: Record<BankAppDemoStep, string> = {
      'agent-workspace':
        'Agent is connected in the Live Chat workspace.',
      business:
        'Customer reaches the BCA-provided self-service page before choosing to contact customer service.',
      calling:
        'Customer identity and request context are sent to the skill queue; queue position is shown on the BANK page.',
      channel: `Customer opens ${channelLabel} and chooses Live Chat.`,
      chat: 'Customer and agent exchange text messages.',
      closed:
        'Service ends and the satisfaction rating is shown on the BANK page.',
      confirm: 'Customer confirms Contact CS on the BCA-provided text page.',
      connected:
        'Agent starts PIN verification from the Live Chat workspace.',
      'personal-info':
        customerType === 'guest'
          ? 'Guest customer enters name, phone number, and email.'
          : 'Registered BankApp customers skip guest information input because login context is already available.',
      'phone-number':
        'Text channel does not use the guest phone-number page in this demo.',
      'pin-input': 'Customer enters PIN and BANK returns the result.',
      'pin-request':
        'Agent starts PIN verification from the Live Chat workspace.',
      'screen-sharing': 'Customer enters PIN and BANK returns the result.',
    }

    return descriptions[step]
  }

  const descriptions: Record<BankAppDemoStep, string> = {
    'agent-workspace': 'Agent is connected and customer information is shown.',
    business: 'Customer selects the inquiry topic and confirms the request.',
    calling:
      contactMethod === 'video'
        ? 'AICC queues and routes the video call.'
        : 'AICC queues and routes the voice call.',
    channel: `Customer opens ${channelLabel} and chooses ${getMethodLabel(contactMethod)}.`,
    chat:
      'BANK provides the customer chat page; BANK Communication Backend and Netinfo exchange customer and agent messages.',
    closed: 'Service ends and the satisfaction rating is shown on the BANK page.',
    confirm: 'Customer confirms contacting Bank customer service.',
    connected:
      contactMethod === 'video'
        ? 'Video call is connected and the customer starts screen sharing.'
        : 'Voice call is connected.',
    'personal-info': `BANK collects guest contact details on the ${channelLabel} client page.`,
    'phone-number': 'Guest customer enters name, phone number, and email.',
    'pin-input': 'Customer enters PIN and BANK returns the result.',
    'pin-request': 'Agent starts PIN verification from the Live Chat workspace.',
    'question-verification':
      'Agent asks verification questions during the voice call.',
    'screen-sharing':
      'Customer starts desktop sharing from the video call page.',
    'share-view': 'Agent views the customer shared screen in OpenEye.',
  }

  return descriptions[step]
}

function getVisibleDemoStep({
  bankAppVideoShareState,
  contactMethod,
  demoStep,
  variant,
}: {
  bankAppVideoShareState: BankAppVideoShareState
  contactMethod: BankAppContactMethod
  demoStep: BankAppDemoStep
  variant: CustomerAppDemoVariant
}): BankAppDemoStep {
  if (variant !== 'bankapp' || contactMethod !== 'video') {
    return demoStep
  }

  if (demoStep === 'closed') {
    return demoStep
  }

  if (
    bankAppVideoShareState === 'sharing' &&
    (demoStep === 'agent-workspace' || demoStep === 'connected')
  ) {
    return 'connected'
  }

  return demoStep
}

function getInitialDemoStep(
  variant: CustomerAppDemoVariant,
  customerType: BankAppCustomerType,
) {
  return variant === 'webchat' && customerType === 'registered'
    ? 'calling'
    : 'channel'
}

export function BankAppDemoPage({
  variant = 'bankapp',
}: {
  variant?: CustomerAppDemoVariant
}) {
  const config = demoConfigs[variant]
  const requestBankAppVideoCall = useAppStore(
    (state) => state.requestBankAppVideoCall,
  )
  const requestBankAppVoiceCall = useAppStore(
    (state) => state.requestBankAppVoiceCall,
  )
  const requestLiveChatWorkspace = useAppStore(
    (state) => state.requestLiveChatWorkspace,
  )
  const activeLiveChat2SessionIds = useAppStore(
    (state) => state.activeLiveChat2SessionIds,
  )
  const liveChat2FocusSessionId = useAppStore(
    (state) => state.liveChat2FocusSessionId,
  )
  const setActiveWorkspaceTabKey = useAppStore(
    (state) => state.setActiveWorkspaceTabKey,
  )
  const currentCallInteractionId = useAppStore(
    (state) => state.currentCallInteractionId,
  )
  const setLiveChat2FocusedSession = useAppStore(
    (state) => state.setLiveChat2FocusedSession,
  )
  const voiceVideoHandoffReadiness = useAppStore(
    (state) => state.voiceVideoHandoffReadiness,
  )
  const digitalHandoffReadiness = useAppStore(
    (state) => state.digitalHandoffReadiness,
  )
  const bankAppVideoShareState = useAppStore(
    (state) => state.bankAppVideoShareState,
  )
  const bankAppPinVerificationStatus = useAppStore(
    (state) => state.bankAppPinVerificationStatus,
  )
  const bankAppPinVerificationAttempts = useAppStore(
    (state) => state.bankAppPinVerificationAttempts,
  )
  const completeBankAppPinVerification = useAppStore(
    (state) => state.completeBankAppPinVerification,
  )
  const resetBankAppVideoDesktopShare = useAppStore(
    (state) => state.resetBankAppVideoDesktopShare,
  )
  const startBankAppVideoScreenShare = useAppStore(
    (state) => state.startBankAppVideoScreenShare,
  )
  const resetBankAppPinVerification = useAppStore(
    (state) => state.resetBankAppPinVerification,
  )
  const [customerType, setCustomerType] =
    useState<BankAppCustomerType>('registered')
  const language: BankAppLanguage = 'en'
  const [contactMethod, setContactMethod] =
    useState<BankAppContactMethod>(config.defaultContactMethod)
  const [businessType, setBusinessType] =
    useState<BankAppBusinessType>('mobile-login')
  const [demoStep, setDemoStep] = useState<BankAppDemoStep>(() =>
    getInitialDemoStep(variant, 'registered'),
  )
  const [handoffWarningReason, setHandoffWarningReason] =
    useState<HandoffWarningReason | null>(null)
  const isPinVerificationOpen =
    (variant === 'bankapp' || variant === 'webchat') &&
    bankAppPinVerificationStatus !== 'idle' &&
    demoStep !== 'closed'
  const effectiveContactMethod = isPinVerificationOpen
    ? 'livechat'
    : contactMethod
  const effectiveCustomerType = isPinVerificationOpen
    ? 'registered'
    : customerType

  const selectedBusiness = useMemo(
    () =>
      bankAppBusinessOptions.find((option) => option.id === businessType) ??
      bankAppBusinessOptions[0],
    [businessType],
  )
  const currentSequence = useMemo(
    () => getStepSequence(effectiveContactMethod, effectiveCustomerType, variant),
    [effectiveContactMethod, effectiveCustomerType, variant],
  )

  const visibleDemoStep = getVisibleDemoStep({
    bankAppVideoShareState,
    contactMethod: effectiveContactMethod,
    demoStep: isPinVerificationOpen ? 'pin-input' : demoStep,
    variant,
  })
  const currentStepIndex = Math.max(0, currentSequence.indexOf(visibleDemoStep))
  const isFlowComplete = currentStepIndex === currentSequence.length - 1
  const routedSkill = getRoutedSkill(
    selectedBusiness,
    effectiveCustomerType,
    language,
    effectiveContactMethod,
  )

  useEffect(() => {
    const preloadSources =
      variant === 'webchat'
        ? Object.values(webchatScreenshotSources)
        : variant === 'whatsapp'
          ? Object.values(whatsAppScreenshotSources)
          : [
              bankAppScreenshotSources.channel,
              bankAppScreenshotSources.pinInput,
              bankAppScreenshotSources.serviceClosed,
              bankAppScreenshotSources.businessConfirm[effectiveContactMethod],
              bankAppScreenshotSources.businessSelection[
                effectiveContactMethod
              ],
              effectiveContactMethod === 'livechat'
                ? bankAppScreenshotSources.textLogin
                : bankAppScreenshotSources.voicePhoneNumber,
              effectiveContactMethod === 'livechat'
                ? bankAppScreenshotSources.textQueue
                : effectiveContactMethod === 'voice'
                  ? bankAppScreenshotSources.voiceCalling
                  : bankAppScreenshotSources.videoQueue,
              effectiveContactMethod === 'livechat'
                ? bankAppScreenshotSources.agentTextConnected
                : effectiveContactMethod === 'voice'
                  ? bankAppScreenshotSources.voiceConnected
                  : bankAppScreenshotSources.videoConnected,
              effectiveContactMethod === 'livechat'
                ? bankAppScreenshotSources.textAgentConnected
                : bankAppScreenshotSources.videoScreenSharing,
              effectiveContactMethod === 'livechat'
                ? bankAppScreenshotSources.textChat
                : bankAppScreenshotSources.videoScreenShareViewer,
            ]

    Array.from(new Set(preloadSources)).forEach((source) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = source
    })
  }, [effectiveContactMethod, variant])

  const handoffWarningMessage =
    handoffWarningReason === 'active-call'
      ? 'Please hang up the current call and wait until the agent is Ready before routing this interaction to Agent Workspace.'
      : 'Agent must be Ready before routing this interaction to Agent Workspace.'

  const triggerAgentWorkspace = (activateWorkspace = false) => {
    if (effectiveContactMethod === 'livechat') {
      if (digitalHandoffReadiness !== 'available') {
        setHandoffWarningReason(digitalHandoffReadiness)
        return false
      }

      setHandoffWarningReason(null)
      requestLiveChatWorkspace(
        config.liveChatSessionId,
        activateWorkspace,
        variant === 'bankapp' || variant === 'webchat'
          ? customerType
          : undefined,
      )
      return true
    }

    if (voiceVideoHandoffReadiness !== 'available') {
      setHandoffWarningReason(voiceVideoHandoffReadiness)
      return false
    }

    if (effectiveContactMethod === 'voice') {
      setHandoffWarningReason(null)
      requestBankAppVoiceCall(activateWorkspace, customerType)
      return true
    }

    setHandoffWarningReason(null)
    requestBankAppVideoCall(activateWorkspace, customerType)
    return true
  }

  const focusExistingLiveChatWorkspace = () => {
    if (digitalHandoffReadiness !== 'available') {
      setHandoffWarningReason(digitalHandoffReadiness)
      return false
    }

    setHandoffWarningReason(null)
    setActiveWorkspaceTabKey('live-chat')
    setLiveChat2FocusedSession(
      liveChat2FocusSessionId ??
        activeLiveChat2SessionIds[activeLiveChat2SessionIds.length - 1] ??
        null,
    )
    return true
  }

  const focusExistingCallWorkspace = () => {
    if (currentCallInteractionId) {
      setHandoffWarningReason(null)
      setActiveWorkspaceTabKey(currentCallInteractionId)
      return true
    }

    if (voiceVideoHandoffReadiness !== 'available') {
      setHandoffWarningReason(voiceVideoHandoffReadiness)
      return false
    }

    return triggerAgentWorkspace(true)
  }

  const goToStep = (nextStep: BankAppDemoStep) => {
    setDemoStep(nextStep)
  }

  const startVideoScreenShareFromCustomer = () => {
    startBankAppVideoScreenShare()
    focusExistingCallWorkspace()
    setDemoStep('connected')
  }

  const handleNextStep = () => {
    const isAgentHandoffStep =
      (effectiveContactMethod === 'livechat' &&
        visibleDemoStep === 'calling') ||
      (effectiveContactMethod !== 'livechat' && visibleDemoStep === 'calling')

    if (isAgentHandoffStep) {
      if (triggerAgentWorkspace(true)) {
        goToStep(
          effectiveContactMethod === 'livechat'
            ? 'agent-workspace'
            : 'connected',
        )
      }
      return
    }

    const nextStep =
      currentSequence[
        Math.min(currentStepIndex + 1, currentSequence.length - 1)
      ]

    if (nextStep === 'pin-request') {
      focusExistingLiveChatWorkspace()
    }

    if (variant === 'whatsapp' && nextStep === 'agent-workspace') {
      if (!triggerAgentWorkspace(true)) {
        return
      }
    }

    if (nextStep === 'question-verification') {
      focusExistingCallWorkspace()
    }

    if (nextStep === 'share-view') {
      if (effectiveContactMethod === 'video') {
        startBankAppVideoScreenShare()
      }
      focusExistingCallWorkspace()
    }

    goToStep(nextStep)
  }

  const handleCustomerTypeChange = (nextCustomerType: BankAppCustomerType) => {
    resetBankAppVideoDesktopShare()
    resetBankAppPinVerification()
    setHandoffWarningReason(null)
    setCustomerType(nextCustomerType)
    setDemoStep(getInitialDemoStep(variant, nextCustomerType))
  }

  const handleMethodChange = (nextMethod: BankAppContactMethod) => {
    resetBankAppVideoDesktopShare()
    resetBankAppPinVerification()
    setHandoffWarningReason(null)
    setContactMethod(nextMethod)
    setDemoStep(getInitialDemoStep(variant, customerType))
  }

  const handleReset = () => {
    setDemoStep(getInitialDemoStep(variant, customerType))
    setHandoffWarningReason(null)
    resetBankAppPinVerification()
    resetBankAppVideoDesktopShare()
  }

  const renderPhoneStatus = () => (
    <div className="bankapp-phone__status">
      <span>9:41</span>
      <span>
        <WifiOutlined />
        100%
      </span>
    </div>
  )

  const renderChannelScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--channel">
      <DemoScreenshot
        alt={`${config.channelLabel} service channel`}
        src={
          variant === 'webchat'
            ? webchatScreenshotSources.entry
            : variant === 'whatsapp'
            ? whatsAppScreenshotSources.chatRequest
            : bankAppScreenshotSources.channel
        }
      />
      {variant === 'whatsapp' ? (
        <div
          className="bankapp-whatsapp-hotspots"
          aria-label="Open WhatsApp business menu"
        >
          <button
            aria-label="Open Menu Awal"
            className="bankapp-whatsapp-hotspot bankapp-whatsapp-hotspot--menu"
            title="Menu Awal"
            type="button"
            onClick={() => goToStep('business')}
          />
        </div>
      ) : null}
    </div>
  )

  const renderPhoneNumberScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--number">
      <DemoScreenshot
        alt={`${config.channelLabel} guest phone number input`}
        src={bankAppScreenshotSources.voicePhoneNumber}
      />
    </div>
  )

  const renderPersonalInfoScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--personal">
      <DemoScreenshot
        alt={`${config.channelLabel} customer information input`}
        src={bankAppScreenshotSources.textLogin}
      />
    </div>
  )

  const renderBusinessScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--business">
      <DemoScreenshot
        alt={`${config.channelLabel} ${getMethodLabel(
          effectiveContactMethod,
        )} business selection`}
        src={
          variant === 'whatsapp'
            ? whatsAppScreenshotSources.businessSelection
            : bankAppScreenshotSources.businessSelection[effectiveContactMethod]
        }
      />
      {variant === 'whatsapp' ? (
        <div
          className="bankapp-whatsapp-hotspots"
          aria-label="Send WhatsApp business selection"
        >
          <button
            aria-label="Send selected WhatsApp business"
            className="bankapp-whatsapp-hotspot bankapp-whatsapp-hotspot--send"
            title="Send"
            type="button"
            onClick={() => goToStep('chat')}
          />
        </div>
      ) : (
        <div className="bankapp-business-hotspots" aria-label="Choose business">
          {businessHotspots.map((optionId) => (
            <button
              aria-label={getBusinessLabel(
                bankAppBusinessOptions.find(
                  (option) => option.id === optionId,
                ) ?? selectedBusiness,
                language,
              )}
              className={`bankapp-business-hotspot bankapp-business-hotspot--${optionId}`}
              key={optionId}
              title={optionId}
              type="button"
              onClick={() => {
                setBusinessType(optionId)
                goToStep(
                  effectiveContactMethod === 'livechat' ? 'confirm' : 'calling',
                )
              }}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderConfirmScreen = () => {
    const isTextContactConfirm = effectiveContactMethod === 'livechat'

    return (
    <div className="bankapp-phone-screen bankapp-phone-screen--confirm">
      <DemoScreenshot
        alt={
          isTextContactConfirm
            ? `${config.channelLabel} confirm contact customer service`
            : `${config.channelLabel} ${getMethodLabel(
                effectiveContactMethod,
              )} business confirmation`
        }
        src={bankAppScreenshotSources.businessConfirm[effectiveContactMethod]}
      />
      <div
        className="bankapp-confirm-hotspots"
        aria-label={
          isTextContactConfirm
            ? 'Confirm contact customer service'
            : 'Confirm business'
        }
      >
        <button
          aria-label={
            isTextContactConfirm
              ? 'Back to text self service'
              : 'Back to business selection'
          }
          className="bankapp-confirm-hotspot bankapp-confirm-hotspot--back"
          title="Back"
          type="button"
          onClick={() => goToStep('business')}
        />
        <button
          aria-label={
            isTextContactConfirm
              ? 'Confirm contact customer service'
              : 'Confirm selected business'
          }
          className="bankapp-confirm-hotspot bankapp-confirm-hotspot--confirm"
          title={isTextContactConfirm ? 'Contact CS' : 'Confirm'}
          type="button"
          onClick={() => goToStep('calling')}
        />
      </div>
    </div>
  )
  }

  const renderCallingScreen = () => {
    if (effectiveContactMethod === 'livechat') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--livechat-queue">
          <DemoScreenshot
            alt={`${config.channelLabel} Live Chat queue`}
            src={
              variant === 'webchat'
                ? webchatScreenshotSources.queue
                : bankAppScreenshotSources.textQueue
            }
          />
        </div>
      )
    }

    if (effectiveContactMethod === 'voice') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--voice-calling">
          <DemoScreenshot
            alt={`${config.channelLabel} Voice Call calling agent`}
            src={bankAppScreenshotSources.voiceCalling}
          />
        </div>
      )
    }

    if (effectiveContactMethod === 'video') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--video-calling">
          <DemoScreenshot
            alt={`${config.channelLabel} Video Call calling agent`}
            src={bankAppScreenshotSources.videoQueue}
          />
        </div>
      )
    }

    return (
      <div className="bankapp-call-screen">
        <div className="bankapp-call-screen__background" />
        <div className="bankapp-call-screen__content">
          <strong>CS BANK 1</strong>
          <div className="bankapp-call-screen__avatar">
            <span>Rp</span>
          </div>
          <h3>Calling...</h3>
          <p>
            {language === 'id'
              ? 'Anda sedang terhubung dengan layanan Perbankan'
              : 'You are being connected to banking service'}
          </p>
        </div>
        <CallControls mode={effectiveContactMethod} />
      </div>
    )
  }

  const renderConnectedScreen = () => {
    if (effectiveContactMethod === 'livechat') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--livechat-chat">
          <DemoScreenshot
            alt={`${config.channelLabel} Live Chat agent workspace`}
            src={
              variant === 'webchat'
                ? webchatScreenshotSources.agentChat
                : bankAppScreenshotSources.agentTextConnected
            }
          />
        </div>
      )
    }

    if (effectiveContactMethod === 'video') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--video-connected">
          <DemoScreenshot
            alt={`${config.channelLabel} connected video call`}
            src={bankAppScreenshotSources.videoConnected}
          />
          <button
            aria-label="Start desktop sharing from customer video call"
            className="bankapp-video-share-hotspot"
            title="Desktop Share"
            type="button"
            onClick={startVideoScreenShareFromCustomer}
          />
        </div>
      )
    }

    if (effectiveContactMethod === 'voice') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--voice-connected">
          <DemoScreenshot
            alt={`${config.channelLabel} Voice Call connected`}
            src={bankAppScreenshotSources.voiceConnected}
          />
        </div>
      )
    }

    return (
      <div className="bankapp-call-screen bankapp-call-screen--connected">
        <div className="bankapp-call-screen__background" />
        <div className="bankapp-call-screen__content">
          <strong>CS BANK 1</strong>
          <div className="bankapp-call-screen__avatar">
            <span>Rp</span>
          </div>
          <h3>00:12</h3>
          <p>{routedSkill}</p>
        </div>
        <CallControls mode="voice" />
      </div>
    )
  }

  const renderScreenSharingScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--video-screen-sharing">
      <DemoScreenshot
        alt={`${config.channelLabel} customer screen sharing`}
        src={bankAppScreenshotSources.videoScreenSharing}
      />
      <button
        aria-hidden="true"
        className="bankapp-video-share-hotspot bankapp-video-share-hotspot--stop"
        tabIndex={-1}
        type="button"
      />
    </div>
  )

  const renderPinVerificationScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--pin">
      <DemoScreenshot alt="Haloapp PIN verification page" src={bankAppScreenshotSources.pinInput} />
      <button
        aria-label="Simulate failed PIN result"
        className="bankapp-pin-hotspot bankapp-pin-hotspot--failed"
        title="Simulate Failed"
        type="button"
        onClick={() => completeBankAppPinVerification('failed')}
      />
      <button
        aria-label="Submit successful PIN result"
        className="bankapp-pin-hotspot bankapp-pin-hotspot--accept"
        title="Accept"
        type="button"
        onClick={() => completeBankAppPinVerification('verified')}
      />
    </div>
  )

  const renderChatScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--livechat-chat">
      <DemoScreenshot
        alt={`${config.channelLabel} Live Chat conversation`}
        src={
          variant === 'webchat'
            ? webchatScreenshotSources.customerMessage
            : variant === 'whatsapp'
            ? whatsAppScreenshotSources.agentChat
            : bankAppScreenshotSources.textChat
        }
      />
    </div>
  )

  const renderTextAgentConnectedScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--livechat-connected">
      <DemoScreenshot
        alt={`${config.channelLabel} Live Chat agent connected`}
        src={
          variant === 'webchat'
            ? webchatScreenshotSources.agentChat
            : bankAppScreenshotSources.textAgentConnected
        }
      />
    </div>
  )

  const renderClosedScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--service-closed">
      <DemoScreenshot
        alt={`${config.channelLabel} satisfaction evaluation`}
        src={
          variant === 'webchat'
            ? webchatScreenshotSources.satisfactionRating
            : variant === 'whatsapp'
            ? whatsAppScreenshotSources.satisfactionRating
            : bankAppScreenshotSources.serviceClosed
        }
      />
    </div>
  )

  const renderPhoneContent = () => {
    if (isPinVerificationOpen) {
      return renderPinVerificationScreen()
    }

    if (visibleDemoStep === 'channel') {
      return renderChannelScreen()
    }

    if (visibleDemoStep === 'phone-number') {
      return renderPhoneNumberScreen()
    }

    if (visibleDemoStep === 'personal-info') {
      return renderPersonalInfoScreen()
    }

    if (visibleDemoStep === 'business') {
      return renderBusinessScreen()
    }

    if (visibleDemoStep === 'confirm') {
      return renderConfirmScreen()
    }

    if (visibleDemoStep === 'calling') {
      return renderCallingScreen()
    }

    if (visibleDemoStep === 'connected') {
      return renderConnectedScreen()
    }

    if (visibleDemoStep === 'pin-request') {
      return renderChatScreen()
    }

    if (visibleDemoStep === 'pin-input') {
      return renderPinVerificationScreen()
    }

    if (visibleDemoStep === 'question-verification') {
      return renderConnectedScreen()
    }

    if (visibleDemoStep === 'share-view') {
      return renderScreenSharingScreen()
    }

    if (visibleDemoStep === 'chat') {
      return renderChatScreen()
    }

    if (
      visibleDemoStep === 'agent-workspace' &&
      effectiveContactMethod === 'livechat'
    ) {
      return renderTextAgentConnectedScreen()
    }

    if (visibleDemoStep === 'agent-workspace') {
      return renderConnectedScreen()
    }

    if (visibleDemoStep === 'screen-sharing') {
      return renderScreenSharingScreen()
    }

    return renderClosedScreen()
  }

  const renderRailStatus = (step: BankAppDemoStep) => {
    const stepIndex = currentSequence.indexOf(step)

    if (stepIndex < currentStepIndex || isFlowComplete) {
      return 'complete'
    }

    if (stepIndex === currentStepIndex) {
      return 'active'
    }

    return 'pending'
  }
  const isScreenshotStep =
    visibleDemoStep === 'channel' ||
    visibleDemoStep === 'business' ||
    visibleDemoStep === 'confirm' ||
    visibleDemoStep === 'phone-number' ||
    visibleDemoStep === 'personal-info' ||
    visibleDemoStep === 'pin-input' ||
    visibleDemoStep === 'pin-request' ||
    visibleDemoStep === 'question-verification' ||
    visibleDemoStep === 'screen-sharing' ||
    visibleDemoStep === 'share-view' ||
    visibleDemoStep === 'closed' ||
    variant === 'whatsapp' ||
    (visibleDemoStep === 'agent-workspace' && effectiveContactMethod !== 'voice') ||
    (effectiveContactMethod === 'livechat' &&
      (visibleDemoStep === 'calling' || visibleDemoStep === 'chat')) ||
    (effectiveContactMethod === 'voice' &&
      (visibleDemoStep === 'calling' ||
        visibleDemoStep === 'connected' ||
        visibleDemoStep === 'agent-workspace')) ||
    (effectiveContactMethod === 'video' && visibleDemoStep === 'calling') ||
    (effectiveContactMethod === 'video' && visibleDemoStep === 'connected')
  const visibleProcessSteps = currentSequence

  return (
    <section
      className={`bankapp-demo bankapp-demo--${variant}`}
      aria-label={config.ariaLabel}
    >
      <div className="bankapp-demo__stage">
        <section className="bankapp-demo__phone-panel">
          <div className="bankapp-demo__panel-heading">
            <MobileOutlined />
            <strong>{config.phoneTitle}</strong>
          </div>
          <div
            className={
              variant === 'webchat'
                ? 'bankapp-phone bankapp-webchat-browser'
                : 'bankapp-phone'
            }
          >
            {isScreenshotStep ? null : renderPhoneStatus()}
            {renderPhoneContent()}
          </div>
        </section>

        <aside className="bankapp-process" aria-label="AICC Process">
          <div className="bankapp-process__header">
            <FileDoneOutlined />
            <div>
              <strong>AICC Process</strong>
            </div>
          </div>

          <div
            className={[
              'bankapp-process__controls',
              variant === 'whatsapp'
                ? 'bankapp-process__controls--actions-only'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {variant === 'bankapp' ? (
              <>
                <SegmentedControl
                  label="Media"
                  options={[
                    ['voice', 'Voice'],
                    ['video', 'Video'],
                    ['livechat', 'Chat'],
                  ]}
                  value={effectiveContactMethod}
                  onChange={(value) =>
                    handleMethodChange(value as BankAppContactMethod)
                  }
                />
                <SegmentedControl
                  label="Customer Type"
                  options={[
                    ['registered', 'Registered'],
                    ['guest', 'Guest'],
                  ]}
                  value={effectiveCustomerType}
                  onChange={(value) =>
                    handleCustomerTypeChange(value as BankAppCustomerType)
                  }
                />
              </>
            ) : variant === 'webchat' ? (
              <>
                <div className="bankapp-process__readonly-control">
                  <span>Media</span>
                  <strong>chat</strong>
                </div>
                <SegmentedControl
                  label="Customer Type"
                  options={[
                    ['registered', 'Registered'],
                    ['guest', 'Guest'],
                  ]}
                  value={effectiveCustomerType}
                  onChange={(value) =>
                    handleCustomerTypeChange(value as BankAppCustomerType)
                  }
                />
              </>
            ) : (
              <div className="bankapp-process__readonly-control">
                <span>Media</span>
                <strong>chat</strong>
              </div>
            )}
            <div className="bankapp-process__actions">
              <BaseButton
                disabled={isFlowComplete}
                icon={
                  isFlowComplete ? (
                    <CheckCircleOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )
                }
                size="small"
                type={isFlowComplete ? undefined : 'primary'}
                variant={isFlowComplete ? 'secondary' : 'primary'}
                onClick={handleNextStep}
              >
                {isFlowComplete ? 'Completed' : 'Next Step'}
              </BaseButton>
              <BaseButton
                icon={<ReloadOutlined />}
                size="small"
                variant="secondary"
                onClick={handleReset}
              >
                Reset
              </BaseButton>
            </div>
            {handoffWarningReason && (
              <div
                aria-live="polite"
                className="bankapp-process__handoff-warning"
                role="status"
              >
                <ExclamationCircleOutlined />
                <span>{handoffWarningMessage}</span>
              </div>
            )}
            {(variant === 'bankapp' || variant === 'webchat') &&
              bankAppPinVerificationStatus !== 'idle' && (
                <div
                  aria-live="polite"
                  className={`bankapp-process__pin-status bankapp-process__pin-status--${bankAppPinVerificationStatus}`}
                  role="status"
                >
                  <LockOutlined />
                  <span>
                    {bankAppPinVerificationStatus === 'verified'
                      ? 'Customer PIN verified in Haloapp.'
                      : bankAppPinVerificationStatus === 'locked'
                        ? 'PIN verification failed after 3 attempts.'
                        : bankAppPinVerificationStatus === 'failed'
                          ? `PIN verification failed. Attempt ${bankAppPinVerificationAttempts}/3 used.`
                          : `Haloapp PIN page is open. Attempt ${bankAppPinVerificationAttempts}/3.`}
                  </span>
                </div>
              )}
          </div>

          <ol className="bankapp-process__rail">
            {visibleProcessSteps.map((step, stepIndex) => {
              const status = renderRailStatus(step)
              const stepOwner = getDisplayStepOwner(
                step,
                variant,
                effectiveContactMethod,
              )
              const stepOwnerClassName = getStepOwnerClassName(stepOwner)

              return (
                <li
                  className={`bankapp-process__step bankapp-process__step--${status}`}
                  key={step}
                >
                  <span
                    aria-label={`${status} step ${stepIndex + 1}`}
                    className="bankapp-process__marker"
                  >
                    {stepIndex + 1}
                  </span>
                  <div>
                    <strong className="bankapp-process__step-title">
                      {getStepLabel(step, variant, effectiveContactMethod)}
                      <span
                        className={`bankapp-step-owner bankapp-step-owner--${stepOwnerClassName}`}
                      >
                        {stepOwner}
                      </span>
                    </strong>
                    <p>
                      {getProcessDescription(
                        step,
                        config.channelLabel,
                        variant,
                        effectiveContactMethod,
                        effectiveCustomerType,
                      )}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </aside>
      </div>
    </section>
  )
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Array<[string, string]>
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div aria-label={label} className="bankapp-segmented" role="group">
      <span>{label}</span>
      <div>
        {options.map(([optionValue, optionLabel]) => (
          <button
            aria-pressed={optionValue === value}
            className={
              optionValue === value ? 'bankapp-segmented__option--active' : ''
            }
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  )
}

function DemoScreenshot({
  alt,
  src,
}: {
  alt: string
  src: string
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasError = failedSrc === src

  if (hasError) {
    return (
      <div
        aria-label={alt}
        className="bankapp-phone-screen__image-fallback"
        role="img"
      >
        <strong>Image loading failed</strong>
        <span>{alt}</span>
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className="bankapp-phone-screen__reference"
      decoding="async"
      loading="eager"
      src={src}
      onError={() => setFailedSrc(src)}
    />
  )
}

function CallControls({
  compact,
  mode,
}: {
  compact?: boolean
  mode: 'voice' | 'video'
}) {
  return (
    <div
      className={[
        'bankapp-call-controls',
        compact ? 'bankapp-call-controls--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>
        {mode === 'video' ? <VideoCameraOutlined /> : <AudioOutlined />}
        {mode === 'video' ? 'Camera' : 'Speaker'}
      </span>
      <span className="bankapp-call-controls__end">
        <PhoneOutlined />
        End
      </span>
      <span>
        <IdcardOutlined />
        {mode === 'video' ? 'Switch' : 'Keypad'}
      </span>
    </div>
  )
}
