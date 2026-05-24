import { useMemo, useState } from 'react'
import {
  AudioOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  IdcardOutlined,
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
  whatsAppScreenshotSources,
} from '../../mock/bankapp'
import { useAppStore, type BankAppVideoShareState } from '../../store'
import type {
  BankAppBusinessOption,
  BankAppBusinessType,
  BankAppContactMethod,
  BankAppCustomerType,
  BankAppDemoStep,
  BankAppLanguage,
} from '../../types'

const BANKAPP_LIVE_CHAT_SESSION_ID = 'live-chat-002'
const WHATSAPP_LIVE_CHAT_SESSION_ID = 'live-chat-001'

type CustomerAppDemoVariant = 'bankapp' | 'whatsapp'

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
}

const stepLabels: Record<BankAppDemoStep, string> = {
  'agent-workspace': 'Agent Workspace',
  business: 'Select Business',
  calling: 'Calling Agent',
  channel: 'Choose Channel',
  chat: 'Chat Page',
  closed: 'Service Closed',
  confirm: 'Confirm Business',
  connected: 'Connected',
  'personal-info': 'Personal Information',
  'phone-number': 'Input Phone Number',
  'screen-sharing': 'View Agent Screen Sharing',
  'share-select': 'Select Sharing Program',
}

const whatsAppStepLabels: Partial<Record<BankAppDemoStep, string>> = {
  'agent-workspace': 'View Agent Workspace',
  business: 'Business Selection',
  channel: 'Request Human Agent',
  chat: 'Queue & Agent Chat',
  closed: 'Satisfaction Rating',
}

const bankOwnedSteps = new Set<BankAppDemoStep>([
  'channel',
  'closed',
  'personal-info',
  'phone-number',
])

const whatsAppStepSequence: BankAppDemoStep[] = [
  'channel',
  'business',
  'chat',
  'agent-workspace',
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

  const phoneStep: BankAppDemoStep[] =
    customerType === 'guest' ? ['phone-number'] : []

  if (contactMethod === 'livechat') {
    const personalInfoStep: BankAppDemoStep[] =
      customerType === 'guest' ? ['personal-info'] : []

    return [
      'channel',
      ...personalInfoStep,
      'business',
      'confirm',
      'calling',
      'chat',
      'agent-workspace',
      'closed',
    ]
  }

  const desktopShareSteps: BankAppDemoStep[] =
    contactMethod === 'video' ? ['share-select', 'screen-sharing'] : []

  return [
    'channel',
    ...phoneStep,
    'business',
    'confirm',
    'calling',
    'connected',
    'agent-workspace',
    ...desktopShareSteps,
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

function getStepLabel(step: BankAppDemoStep, variant: CustomerAppDemoVariant) {
  if (variant === 'whatsapp') {
    return whatsAppStepLabels[step] ?? stepLabels[step]
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

  return bankOwnedSteps.has(step) ? 'BANK1' : 'Netinfo'
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

  const descriptions: Record<BankAppDemoStep, string> = {
    'agent-workspace': 'Agent reviews the customer conversation in the workspace.',
    business: 'AICC displays skills from customer identity, language, and channel.',
    calling: 'AICC queues the request and starts agent routing.',
    channel: `Customer chooses a ${channelLabel} contact method.`,
    chat: `Customer and agent are connected in ${channelLabel} chat.`,
    closed: 'Customer receives reference number and rating prompt.',
    confirm: 'AICC confirms intent, language, and target skill.',
    connected: 'Customer sees the connected call timer before agent desktop opens.',
    'personal-info': `${channelLabel} passes customer profile context to AICC.`,
    'phone-number': 'Guest customer provides a callback phone number.',
    'screen-sharing': 'Customer views the agent desktop share inside the BankApp video call.',
    'share-select': 'Agent selects the desktop source from the OpenEye sharing dialog.',
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

  if (bankAppVideoShareState === 'selecting-program') {
    return 'share-select'
  }

  if (bankAppVideoShareState === 'sharing') {
    return 'screen-sharing'
  }

  if (demoStep === 'share-select' || demoStep === 'screen-sharing') {
    return 'agent-workspace'
  }

  return demoStep
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
  const bankAppVideoShareState = useAppStore(
    (state) => state.bankAppVideoShareState,
  )
  const resetBankAppVideoDesktopShare = useAppStore(
    (state) => state.resetBankAppVideoDesktopShare,
  )
  const [customerType, setCustomerType] =
    useState<BankAppCustomerType>('registered')
  const language: BankAppLanguage = 'en'
  const [contactMethod, setContactMethod] =
    useState<BankAppContactMethod>(config.defaultContactMethod)
  const [businessType, setBusinessType] =
    useState<BankAppBusinessType>('mobile-login')
  const [demoStep, setDemoStep] = useState<BankAppDemoStep>('channel')

  const selectedBusiness = useMemo(
    () =>
      bankAppBusinessOptions.find((option) => option.id === businessType) ??
      bankAppBusinessOptions[0],
    [businessType],
  )
  const currentSequence = useMemo(
    () => getStepSequence(contactMethod, customerType, variant),
    [contactMethod, customerType, variant],
  )
  const visibleDemoStep = getVisibleDemoStep({
    bankAppVideoShareState,
    contactMethod,
    demoStep,
    variant,
  })
  const currentStepIndex = Math.max(0, currentSequence.indexOf(visibleDemoStep))
  const isFlowComplete = currentStepIndex === currentSequence.length - 1
  const routedSkill = getRoutedSkill(
    selectedBusiness,
    customerType,
    language,
    contactMethod,
  )

  const triggerAgentWorkspace = (activateWorkspace = false) => {
    if (contactMethod === 'livechat') {
      requestLiveChatWorkspace(config.liveChatSessionId, activateWorkspace)
      return
    }

    if (contactMethod === 'voice') {
      requestBankAppVoiceCall(activateWorkspace)
      return
    }

    requestBankAppVideoCall(activateWorkspace)
  }

  const goToStep = (nextStep: BankAppDemoStep) => {
    setDemoStep(nextStep)
  }

  const handleNextStep = () => {
    const isAgentHandoffStep =
      (contactMethod === 'livechat' && visibleDemoStep === 'chat') ||
      (contactMethod !== 'livechat' && visibleDemoStep === 'connected')

    if (isAgentHandoffStep) {
      triggerAgentWorkspace(true)
      goToStep('agent-workspace')
      return
    }

    const nextStep =
      currentSequence[
        Math.min(currentStepIndex + 1, currentSequence.length - 1)
      ]

    goToStep(nextStep)
  }

  const handleCustomerTypeChange = (nextCustomerType: BankAppCustomerType) => {
    resetBankAppVideoDesktopShare()
    setCustomerType(nextCustomerType)
    setDemoStep('channel')
  }

  const handleMethodChange = (nextMethod: BankAppContactMethod) => {
    resetBankAppVideoDesktopShare()
    setContactMethod(nextMethod)
    setDemoStep('channel')
  }

  const handleReset = () => {
    setCustomerType('registered')
    setContactMethod(config.defaultContactMethod)
    setBusinessType('mobile-login')
    setDemoStep('channel')
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
      <img
        alt={`${config.channelLabel} service channel`}
        className="bankapp-phone-screen__reference"
        src={
          variant === 'whatsapp'
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
      ) : (
        <div
          className="bankapp-channel-hotspots"
          aria-label="Choose service channel"
        >
          {bankAppContactMethods
            .filter((method) => config.contactMethods.includes(method.id))
            .map((method) => (
              <button
                aria-label={method.label}
                className={`bankapp-channel-hotspot bankapp-channel-hotspot--${method.id}`}
                key={method.id}
                title={method.label}
                type="button"
                onClick={() => {
                  handleMethodChange(method.id)
                  goToStep(
                    method.id === 'livechat'
                      ? customerType === 'guest'
                        ? 'personal-info'
                        : 'business'
                      : customerType === 'guest'
                        ? 'phone-number'
                        : 'business',
                  )
                }}
              />
            ))}
        </div>
      )}
    </div>
  )

  const renderPhoneNumberScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--number">
      <img
        alt={`${config.channelLabel} guest phone number input`}
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.voicePhoneNumber}
      />
    </div>
  )

  const renderPersonalInfoScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--personal">
      <img
        alt={`${config.channelLabel} customer information input`}
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.textLogin}
      />
    </div>
  )

  const renderBusinessScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--business">
      <img
        alt={`${config.channelLabel} ${getMethodLabel(
          contactMethod,
        )} business selection`}
        className="bankapp-phone-screen__reference"
        src={
          variant === 'whatsapp'
            ? whatsAppScreenshotSources.businessSelection
            : bankAppScreenshotSources.businessSelection[contactMethod]
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
                goToStep('confirm')
              }}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderConfirmScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--confirm">
      <img
        alt={`${config.channelLabel} ${getMethodLabel(
          contactMethod,
        )} business confirmation`}
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.businessConfirm[contactMethod]}
      />
      <div className="bankapp-confirm-hotspots" aria-label="Confirm business">
        <button
          aria-label="Back to business selection"
          className="bankapp-confirm-hotspot bankapp-confirm-hotspot--back"
          title="Back"
          type="button"
          onClick={() => goToStep('business')}
        />
        <button
          aria-label="Confirm selected business"
          className="bankapp-confirm-hotspot bankapp-confirm-hotspot--confirm"
          title="Confirm"
          type="button"
          onClick={() => goToStep('calling')}
        />
      </div>
    </div>
  )

  const renderCallingScreen = () => {
    if (contactMethod === 'livechat') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--livechat-queue">
          <img
            alt={`${config.channelLabel} Live Chat queue`}
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.textQueue}
          />
        </div>
      )
    }

    if (contactMethod === 'voice') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--voice-calling">
          <img
            alt={`${config.channelLabel} Voice Call calling agent`}
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.voiceCalling}
          />
        </div>
      )
    }

    if (contactMethod === 'video') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--video-calling">
          <img
            alt={`${config.channelLabel} Video Call calling agent`}
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.voiceCalling}
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
        <CallControls mode={contactMethod} />
      </div>
    )
  }

  const renderConnectedScreen = () => {
    if (contactMethod === 'video') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--video-connected">
          <img
            alt={`${config.channelLabel} connected video call`}
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.videoConnected}
          />
        </div>
      )
    }

    if (contactMethod === 'voice') {
      return (
        <div className="bankapp-phone-screen bankapp-phone-screen--voice-connected">
          <img
            alt={`${config.channelLabel} Voice Call connected`}
            className="bankapp-phone-screen__reference"
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
      <img
        alt={`${config.channelLabel} agent screen sharing`}
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.videoScreenSharing}
      />
    </div>
  )

  const renderChatScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--livechat-chat">
      <img
        alt={`${config.channelLabel} Live Chat conversation`}
        className="bankapp-phone-screen__reference"
        src={
          variant === 'whatsapp'
            ? whatsAppScreenshotSources.agentChat
            : bankAppScreenshotSources.textChat
        }
      />
    </div>
  )

  const renderClosedScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--service-closed">
      <img
        alt={`${config.channelLabel} satisfaction evaluation`}
        className="bankapp-phone-screen__reference"
        src={
          variant === 'whatsapp'
            ? whatsAppScreenshotSources.satisfactionRating
            : bankAppScreenshotSources.serviceClosed
        }
      />
    </div>
  )

  const renderPhoneContent = () => {
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

    if (visibleDemoStep === 'chat') {
      return renderChatScreen()
    }

    if (visibleDemoStep === 'agent-workspace' && contactMethod === 'livechat') {
      return renderChatScreen()
    }

    if (visibleDemoStep === 'agent-workspace') {
      return renderConnectedScreen()
    }

    if (visibleDemoStep === 'share-select') {
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
    visibleDemoStep === 'phone-number' ||
    visibleDemoStep === 'personal-info' ||
    visibleDemoStep === 'screen-sharing' ||
    visibleDemoStep === 'share-select' ||
    visibleDemoStep === 'closed' ||
    variant === 'whatsapp' ||
    (visibleDemoStep === 'agent-workspace' && contactMethod !== 'voice') ||
    (contactMethod === 'livechat' &&
      (visibleDemoStep === 'calling' || visibleDemoStep === 'chat')) ||
    (contactMethod === 'voice' &&
      (visibleDemoStep === 'calling' ||
        visibleDemoStep === 'connected' ||
        visibleDemoStep === 'agent-workspace')) ||
    (contactMethod === 'video' && visibleDemoStep === 'calling') ||
    (contactMethod === 'video' && visibleDemoStep === 'connected')
  const visibleProcessSteps = currentSequence.slice(0, currentStepIndex + 1)

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
          <div className="bankapp-phone">
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
                  label="Channel"
                  options={[
                    ['voice', 'Voice'],
                    ['video', 'Video'],
                    ['livechat', 'Chat'],
                  ]}
                  value={contactMethod}
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
                  value={customerType}
                  onChange={(value) =>
                    handleCustomerTypeChange(value as BankAppCustomerType)
                  }
                />
              </>
            ) : (
              <div className="bankapp-process__readonly-control">
                <span>Channel</span>
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
          </div>

          <ol className="bankapp-process__rail">
            {visibleProcessSteps.map((step, stepIndex) => {
              const status = renderRailStatus(step)

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
                      {getStepLabel(step, variant)}
                      <span
                        className={`bankapp-step-owner bankapp-step-owner--${getStepOwner(
                          step,
                          variant,
                        ).toLowerCase()}`}
                      >
                        {getStepOwner(step, variant)}
                      </span>
                    </strong>
                    <p>
                      {getProcessDescription(
                        step,
                        config.channelLabel,
                        variant,
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
