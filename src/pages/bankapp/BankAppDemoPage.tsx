import { useMemo, useState } from 'react'
import {
  AudioOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
} from '../../mock/bankapp'
import { useAppStore } from '../../store'
import type {
  BankAppBusinessOption,
  BankAppBusinessType,
  BankAppContactMethod,
  BankAppCustomerType,
  BankAppDemoStep,
  BankAppLanguage,
} from '../../types'

const BANKAPP_LIVE_CHAT_SESSION_ID = 'live-chat-002'

const stepLabels: Record<BankAppDemoStep, string> = {
  business: 'Select Business',
  calling: 'Calling Agent',
  channel: 'Choose Channel',
  chat: 'Chat Page',
  closed: 'Service Closed',
  confirm: 'Confirm Business',
  connected: 'Connected',
  'personal-info': 'Personal Information',
  'phone-number': 'Input Phone Number',
}

const bankOwnedSteps = new Set<BankAppDemoStep>([
  'channel',
  'closed',
  'personal-info',
  'phone-number',
])

const businessHotspots: BankAppBusinessType[] = [
  'mobile-login',
  'card-issue',
  'account-info',
  'transaction-dispute',
]

function getStepSequence(
  contactMethod: BankAppContactMethod,
  customerType: BankAppCustomerType,
): BankAppDemoStep[] {
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
      'closed',
    ]
  }

  return [
    'channel',
    ...phoneStep,
    'business',
    'confirm',
    'calling',
    'connected',
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

function getStepOwner(step: BankAppDemoStep) {
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

function getProcessDescription(step: BankAppDemoStep) {
  const descriptions: Record<BankAppDemoStep, string> = {
    business: 'AICC displays skills from customer identity, language, and channel.',
    calling: 'AICC queues the request and starts agent routing.',
    channel: 'Customer chooses a BankApp contact method.',
    chat: 'Customer and agent are connected in BankApp chat.',
    closed: 'Customer receives reference number and rating prompt.',
    confirm: 'AICC confirms intent, language, and target skill.',
    connected: 'Customer sees the connected call timer before agent desktop opens.',
    'personal-info': 'BankApp passes customer profile context to AICC.',
    'phone-number': 'Guest customer provides a callback phone number.',
  }

  return descriptions[step]
}

export function BankAppDemoPage() {
  const requestBankAppVideoCall = useAppStore(
    (state) => state.requestBankAppVideoCall,
  )
  const requestBankAppVoiceCall = useAppStore(
    (state) => state.requestBankAppVoiceCall,
  )
  const requestLiveChatWorkspace = useAppStore(
    (state) => state.requestLiveChatWorkspace,
  )
  const [customerType, setCustomerType] =
    useState<BankAppCustomerType>('registered')
  const language: BankAppLanguage = 'en'
  const [contactMethod, setContactMethod] =
    useState<BankAppContactMethod>('voice')
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
    () => getStepSequence(contactMethod, customerType),
    [contactMethod, customerType],
  )
  const currentStepIndex = Math.max(0, currentSequence.indexOf(demoStep))
  const routedSkill = getRoutedSkill(
    selectedBusiness,
    customerType,
    language,
    contactMethod,
  )

  const triggerAgentWorkspace = () => {
    if (contactMethod === 'livechat') {
      requestLiveChatWorkspace(BANKAPP_LIVE_CHAT_SESSION_ID, false)
      return
    }

    if (contactMethod === 'voice') {
      requestBankAppVoiceCall()
      return
    }

    requestBankAppVideoCall()
  }

  const goToStep = (nextStep: BankAppDemoStep) => {
    setDemoStep(nextStep)
  }

  const handleNextStep = () => {
    const isAgentHandoffStep =
      (contactMethod === 'livechat' && demoStep === 'chat') ||
      (contactMethod !== 'livechat' && demoStep === 'connected')

    if (isAgentHandoffStep) {
      triggerAgentWorkspace()
      goToStep('closed')
      return
    }

    const nextStep =
      currentSequence[
        Math.min(currentStepIndex + 1, currentSequence.length - 1)
      ]

    goToStep(nextStep)
  }

  const handleCustomerTypeChange = (nextCustomerType: BankAppCustomerType) => {
    setCustomerType(nextCustomerType)
    setDemoStep('channel')
  }

  const handleMethodChange = (nextMethod: BankAppContactMethod) => {
    setContactMethod(nextMethod)
    setDemoStep('channel')
  }

  const handleReset = () => {
    setCustomerType('registered')
    setContactMethod('voice')
    setBusinessType('mobile-login')
    setDemoStep('channel')
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
        alt="BankApp service channel"
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.channel}
      />
      <div className="bankapp-channel-hotspots" aria-label="Choose service channel">
        {bankAppContactMethods.map((method) => (
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
    </div>
  )

  const renderPhoneNumberScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--number">
      <img
        alt="BankApp guest phone number input"
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.voicePhoneNumber}
      />
    </div>
  )

  const renderPersonalInfoScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--personal">
      <img
        alt="BankApp customer information input"
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.textLogin}
      />
    </div>
  )

  const renderBusinessScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--business">
      <img
        alt={`BankApp ${getMethodLabel(contactMethod)} business selection`}
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.businessSelection[contactMethod]}
      />
      <div className="bankapp-business-hotspots" aria-label="Choose business">
        {businessHotspots.map((optionId) => (
          <button
            aria-label={getBusinessLabel(
              bankAppBusinessOptions.find((option) => option.id === optionId) ??
                selectedBusiness,
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
    </div>
  )

  const renderConfirmScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--confirm">
      <img
        alt={`BankApp ${getMethodLabel(contactMethod)} business confirmation`}
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
            alt="BankApp Live Chat queue"
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.textQueue}
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
            alt="BankApp connected video call"
            className="bankapp-phone-screen__reference"
            src={bankAppScreenshotSources.videoConnected}
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

  const renderChatScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--livechat-chat">
      <img
        alt="BankApp Live Chat conversation"
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.textChat}
      />
    </div>
  )

  const renderClosedScreen = () => (
    <div className="bankapp-phone-screen bankapp-phone-screen--service-closed">
      <img
        alt="BankApp satisfaction evaluation"
        className="bankapp-phone-screen__reference"
        src={bankAppScreenshotSources.serviceClosed}
      />
    </div>
  )

  const renderPhoneContent = () => {
    if (demoStep === 'channel') {
      return renderChannelScreen()
    }

    if (demoStep === 'phone-number') {
      return renderPhoneNumberScreen()
    }

    if (demoStep === 'personal-info') {
      return renderPersonalInfoScreen()
    }

    if (demoStep === 'business') {
      return renderBusinessScreen()
    }

    if (demoStep === 'confirm') {
      return renderConfirmScreen()
    }

    if (demoStep === 'calling') {
      return renderCallingScreen()
    }

    if (demoStep === 'connected') {
      return renderConnectedScreen()
    }

    if (demoStep === 'chat') {
      return renderChatScreen()
    }

    return renderClosedScreen()
  }

  const renderRailStatus = (step: BankAppDemoStep) => {
    const stepIndex = currentSequence.indexOf(step)

    if (stepIndex < currentStepIndex) {
      return 'complete'
    }

    if (stepIndex === currentStepIndex) {
      return 'active'
    }

    return 'pending'
  }
  const isScreenshotStep =
    demoStep === 'channel' ||
    demoStep === 'phone-number' ||
    demoStep === 'personal-info' ||
    demoStep === 'closed' ||
    (contactMethod === 'livechat' &&
      (demoStep === 'calling' || demoStep === 'chat')) ||
    (contactMethod === 'video' && demoStep === 'connected')

  return (
    <section className="bankapp-demo" aria-label="BankApp customer demo">
      <div className="bankapp-demo__stage">
        <section className="bankapp-demo__phone-panel">
          <div className="bankapp-demo__panel-heading">
            <MobileOutlined />
            <strong>Customer BankApp</strong>
            <span className="bankapp-step-title">
              {stepLabels[demoStep]}
              <span
                className={`bankapp-step-owner bankapp-step-owner--${getStepOwner(
                  demoStep,
                ).toLowerCase()}`}
              >
                {getStepOwner(demoStep)}
              </span>
            </span>
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

          <div className="bankapp-process__controls">
            <SegmentedControl
              label="Customer Type"
              options={[
                ['registered', 'Registered Customer'],
                ['guest', 'Guest'],
              ]}
              value={customerType}
              onChange={(value) =>
                handleCustomerTypeChange(value as BankAppCustomerType)
              }
            />
            <div className="bankapp-process__actions">
              <BaseButton
                icon={<PlayCircleOutlined />}
                size="small"
                type="primary"
                variant="primary"
                onClick={handleNextStep}
              >
                Next Step
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

          <div className="bankapp-process__summary">
            <InfoRow label="Channel" value={`BankApp / ${getMethodLabel(contactMethod)}`} />
          </div>

          <ol className="bankapp-process__rail">
            {currentSequence.map((step) => {
              const status = renderRailStatus(step)

              return (
                <li
                  className={`bankapp-process__step bankapp-process__step--${status}`}
                  key={step}
                >
                  <span className="bankapp-process__marker">
                    {status === 'complete' ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )}
                  </span>
                  <div>
                    <strong className="bankapp-process__step-title">
                      {stepLabels[step]}
                      <span
                        className={`bankapp-step-owner bankapp-step-owner--${getStepOwner(
                          step,
                        ).toLowerCase()}`}
                      >
                        {getStepOwner(step)}
                      </span>
                    </strong>
                    <p>{getProcessDescription(step)}</p>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bankapp-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
    <label className="bankapp-segmented">
      <span>{label}</span>
      <div>
        {options.map(([optionValue, optionLabel]) => (
          <button
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
    </label>
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
