import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  BranchesOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PoweroffOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Badge, Layout, Modal } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { featureFlags } from '../config/featureFlags'
import { headerAgentProfile } from '../mock/agent'
import { useAppStore, useAuthStore } from '../store'
import type {
  DigitalHandoffReadiness,
  InboundPopupSource,
  VideoCallPopupSource,
  VoiceVideoHandoffReadiness,
} from '../store'
import type { AgentServiceMode, AgentStatus, CallStatus } from '../types'
import {
  createAuxStatus,
  createPreAuxStatus,
  getAuxReason,
  isAuxLikeStatus,
  isAuxStatus,
  isPreAuxStatus,
} from '../utils/agentStatus'
import {
  AgentProfileArea,
  type AgentPresence,
} from './components/AgentProfileArea'
import { AgentToolbar } from './components/AgentToolbar'
import { InternalChatModal } from './components/InternalChatModal'

const { Header, Sider, Content } = Layout

interface SideMenuChildItem {
  key: string
  label: string
}

interface SideMenuItem {
  key: string
  icon: ReactNode
  label: string
  children?: SideMenuChildItem[]
}

interface CallTiming {
  talkingStartedAt: number | null
  holdStartedAt: number | null
  muteStartedAt: number | null
  accumulatedHoldSeconds: number
  accumulatedMuteSeconds: number
}

type ActiveCallChannel = 'voice' | 'video' | null
type CallHandoffNoticeReason = Exclude<
  VoiceVideoHandoffReadiness,
  'available'
>

interface AgentStatusUpdateOptions {
  seedDefaultLiveChat?: boolean
}

const initialCallTiming: CallTiming = {
  talkingStartedAt: null,
  holdStartedAt: null,
  muteStartedAt: null,
  accumulatedHoldSeconds: 0,
  accumulatedMuteSeconds: 0,
}

function canHandleDigital(mode: AgentServiceMode | null) {
  return mode === 'digital' || mode === 'voice-digital'
}

function canHandleVoiceVideo(mode: AgentServiceMode | null) {
  return mode === 'voice' || mode === 'voice-digital'
}

const routingConfigRoutesByMenuKey: Record<string, string> = {
  'routing-vdn': '/routing-config/vdn',
  'routing-sites': '/routing-config/sites',
  'routing-channels': '/routing-config/channels',
  'routing-business-types': '/routing-config/business-types',
  'routing-skill-queues': '/routing-config/skill-queues',
  'routing-site-access-volume': '/routing-config/site-access-volume',
  'routing-skill-routing-rules': '/routing-config/skill-routing-rules',
  'routing-working-time-plans': '/routing-config/working-time-plans',
}

const routingConfigMenuKeyByRoute = Object.fromEntries(
  Object.entries(routingConfigRoutesByMenuKey).map(([menuKey, path]) => [
    path,
    menuKey,
  ]),
) as Record<string, string>

const routingConfigMenuKeys = new Set(['routing-config'])

const allSideMenuItems: SideMenuItem[] = [
  {
    key: 'test-menu',
    icon: <AppstoreOutlined />,
    label: 'Channel Simulation',
    children: [
      {
        key: 'test-pstn-voice',
        label: 'PSTN',
      },
      {
        key: 'customer-bankapp',
        label: 'BankApp',
      },
      {
        key: 'customer-whatsapp',
        label: 'WhatsApp',
      },
    ],
  },
  {
    key: 'call-management',
    icon: <CustomerServiceOutlined />,
    label: 'Call Management',
    children: [
      {
        key: 'call-management-verification-rules',
        label: 'Verification Rules',
      },
      {
        key: 'call-management-global-control-configuration',
        label: 'Global Control Configuration',
      },
      {
        key: 'call-management-blacklist',
        label: 'Blacklist Management',
      },
      {
        key: 'call-management-priority-list',
        label: 'Priority List Management',
      },
      {
        key: 'call-management-busy-reasons',
        label: 'Busy Reason Management',
      },
    ],
  },
  {
    key: 'routing-config',
    icon: <BranchesOutlined />,
    label: 'Routing Config',
    children: [
      {
        key: 'routing-vdn',
        label: 'VDN',
      },
      {
        key: 'routing-sites',
        label: 'Access Sites',
      },
      {
        key: 'routing-channels',
        label: 'Channels',
      },
      {
        key: 'routing-business-types',
        label: 'Business Types',
      },
      {
        key: 'routing-skill-queues',
        label: 'Skill Queues',
      },
      {
        key: 'routing-site-access-volume',
        label: 'Site Access Volume',
      },
      {
        key: 'routing-skill-routing-rules',
        label: 'Skill Routing Rules',
      },
      {
        key: 'routing-working-time-plans',
        label: 'Working Time Plans',
      },
    ],
  },
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Agent Center',
    children: [
      {
        key: 'profile-info',
        label: 'Agent Profile',
      },
      {
        key: 'profile-service-records',
        label: 'Service History',
      },
    ],
  },
  {
    key: 'operations',
    icon: <SettingOutlined />,
    label: 'Operations',
    children: [
      {
        key: 'operations-warning-metrics',
        label: 'Alert KPI Management',
      },
      {
        key: 'operations-site-management',
        label: 'Floor Management',
      },
    ],
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
]

const sideMenuItems = allSideMenuItems.filter(
  (item) =>
    featureFlags.enableRoutingConfigMenus ||
    !routingConfigMenuKeys.has(item.key),
)

export function BasicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const authSession = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const collapsed = useAppStore((state) => state.collapsed)
  const agentServiceMode = useAppStore((state) => state.agentServiceMode)
  const activeLiveChatSessionIds = useAppStore(
    (state) => state.activeLiveChatSessionIds,
  )
  const activeLiveChat2SessionIds = useAppStore(
    (state) => state.activeLiveChat2SessionIds,
  )
  const clearLiveChat2Sessions = useAppStore(
    (state) => state.clearLiveChat2Sessions,
  )
  const clearLiveChatSessions = useAppStore(
    (state) => state.clearLiveChatSessions,
  )
  const callInteractions = useAppStore((state) => state.callInteractions)
  const closeAllCallInteractionTabs = useAppStore(
    (state) => state.closeAllCallInteractionTabs,
  )
  const clearAgentServiceMode = useAppStore(
    (state) => state.clearAgentServiceMode,
  )
  const createCallInteraction = useAppStore(
    (state) => state.createCallInteraction,
  )
  const currentCallInteractionId = useAppStore(
    (state) => state.currentCallInteractionId,
  )
  const markCallInteractionActive = useAppStore(
    (state) => state.markCallInteractionActive,
  )
  const markCallInteractionEnded = useAppStore(
    (state) => state.markCallInteractionEnded,
  )
  const bankAppVideoCallActivateWorkspace = useAppStore(
    (state) => state.bankAppVideoCallActivateWorkspace,
  )
  const bankAppVideoCallRequestId = useAppStore(
    (state) => state.bankAppVideoCallRequestId,
  )
  const bankAppVoiceCallActivateWorkspace = useAppStore(
    (state) => state.bankAppVoiceCallActivateWorkspace,
  )
  const bankAppVoiceCallRequestId = useAppStore(
    (state) => state.bankAppVoiceCallRequestId,
  )
  const setCollapsed = useAppStore((state) => state.setCollapsed)
  const setAgentServiceMode = useAppStore(
    (state) => state.setAgentServiceMode,
  )
  const setDigitalHandoffReadiness = useAppStore(
    (state) => state.setDigitalHandoffReadiness,
  )
  const requestBankAppDemoWorkspace = useAppStore(
    (state) => state.requestBankAppDemoWorkspace,
  )
  const requestWhatsAppDemoWorkspace = useAppStore(
    (state) => state.requestWhatsAppDemoWorkspace,
  )
  const setLiveChatTabOpen = useAppStore(
    (state) => state.setLiveChatTabOpen,
  )
  const setOpenEyeVideoWindowVisible = useAppStore(
    (state) => state.setOpenEyeVideoWindowVisible,
  )
  const resetBankAppVideoDesktopShare = useAppStore(
    (state) => state.resetBankAppVideoDesktopShare,
  )
  const customerOutboundCallRequestId = useAppStore(
    (state) => state.customerOutboundCallRequestId,
  )
  const setVoiceVideoHandoffReadiness = useAppStore(
    (state) => state.setVoiceVideoHandoffReadiness,
  )
  const [agentStatus, setAgentStatus] = useState<AgentStatus>(
    headerAgentProfile.status,
  )
  const [statusStartedAt, setStatusStartedAt] = useState(() => Date.now())
  const [callStatus, setCallStatus] = useState<CallStatus>('Idle')
  const [callStatusStartedAt, setCallStatusStartedAt] = useState(() =>
    Date.now(),
  )
  const [callTiming, setCallTiming] =
    useState<CallTiming>(initialCallTiming)
  const [activeCallChannel, setActiveCallChannel] =
    useState<ActiveCallChannel>(null)
  const [autoAnswerSeconds] = useState(3)
  const [toolbarDisplayMode, setToolbarDisplayMode] = useState<
    'icon' | 'text'
  >('text')
  const [isInternalChatOpen, setIsInternalChatOpen] = useState(false)
  const [isAfterCallWork, setIsAfterCallWork] = useState(false)
  const [callHandoffNotice, setCallHandoffNotice] = useState<{
    id: number
    reason: CallHandoffNoticeReason | null
  }>({
    id: 0,
    reason: null,
  })
  const [closedFlyoutKey, setClosedFlyoutKey] = useState<string | null>(null)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([])
  const [selectedMenuKey, setSelectedMenuKey] = useState('test-pstn-voice')
  const handledBankAppVideoCallRequestIdRef = useRef(0)
  const handledBankAppVoiceCallRequestIdRef = useRef(0)
  const handledOutboundCallRequestIdRef = useRef(0)
  const currentCallInteraction = currentCallInteractionId
    ? callInteractions[currentCallInteractionId]
    : null
  const hasUnfinishedCurrentCall =
    callStatus !== 'Idle' &&
    currentCallInteraction !== null &&
    currentCallInteraction.phase !== 'ended'
  const voiceVideoHandoffReadiness: VoiceVideoHandoffReadiness =
    hasUnfinishedCurrentCall
      ? 'active-call'
      : agentStatus !== 'Ready' || callStatus !== 'Idle'
        ? 'not-ready'
        : canHandleVoiceVideo(agentServiceMode)
          ? 'available'
          : 'voice-skill-unavailable'
  const digitalHandoffReadiness: DigitalHandoffReadiness =
    agentStatus !== 'Ready'
      ? 'not-ready'
      : canHandleDigital(agentServiceMode)
        ? 'available'
        : 'digital-skill-unavailable'
  const callHandoffNoticeMessage =
    callHandoffNotice.reason === 'active-call'
      ? 'Active call in progress. Please hang up and wait until the agent is Ready before accepting another voice or video interaction.'
      : callHandoffNotice.reason === 'voice-skill-unavailable'
        ? 'Current sign-in mode is Digital only. Please sign out and sign in with Voice or Voice + Digital before accepting a voice or video interaction.'
      : 'Agent is not Ready. Please switch to Ready before accepting another voice or video interaction.'

  const showCallHandoffNotice = useCallback(
    (reason: CallHandoffNoticeReason) => {
      setCallHandoffNotice((current) => ({
        id: current.id + 1,
        reason,
      }))
    },
    [],
  )

  const hideCallHandoffNotice = useCallback(() => {
    setCallHandoffNotice((current) =>
      current.reason
        ? {
            ...current,
            reason: null,
          }
        : current,
    )
  }, [])

  const updateAgentStatus = useCallback((
    status: AgentStatus,
    nextServiceMode: AgentServiceMode | null = agentServiceMode,
    options: AgentStatusUpdateOptions = {},
  ) => {
    const hasActiveWork =
      callStatus !== 'Idle' ||
      activeLiveChatSessionIds.length > 0 ||
      activeLiveChat2SessionIds.length > 0
    const nextStatus =
      isAuxStatus(status) && hasActiveWork
        ? createPreAuxStatus(getAuxReason(status))
        : status

    setAgentStatus(nextStatus)
    setStatusStartedAt(Date.now())
    setLiveChatTabOpen(
      nextStatus !== 'Unsigned' && canHandleDigital(nextServiceMode),
      {
        seedDefaultCurrentSessions: options.seedDefaultLiveChat === true,
      },
    )

    if (nextStatus === 'Unsigned') {
      clearAgentServiceMode()
      setCallStatus('Idle')
      setCallStatusStartedAt(Date.now())
      setCallTiming(initialCallTiming)
      setActiveCallChannel(null)
      setIsAfterCallWork(false)
      closeAllCallInteractionTabs()
      clearLiveChat2Sessions()
      clearLiveChatSessions()
      setOpenEyeVideoWindowVisible(false)
      resetBankAppVideoDesktopShare()
      hideCallHandoffNotice()
      return
    }

    if (nextStatus === 'Ready') {
      setIsAfterCallWork(false)
      hideCallHandoffNotice()
      return
    }

    if (isPreAuxStatus(nextStatus)) {
      setIsAfterCallWork(false)
      hideCallHandoffNotice()
      return
    }

    if (isAuxStatus(nextStatus)) {
      if (callStatus !== 'Idle' && currentCallInteractionId) {
        markCallInteractionEnded(currentCallInteractionId)
      }

      setCallStatus('Idle')
      setCallStatusStartedAt(Date.now())
      setCallTiming(initialCallTiming)
      setActiveCallChannel(null)
      setIsAfterCallWork(false)
      clearLiveChat2Sessions()
      clearLiveChatSessions()
      setOpenEyeVideoWindowVisible(false)
      resetBankAppVideoDesktopShare()
      hideCallHandoffNotice()
    }
  }, [
    activeLiveChat2SessionIds,
    activeLiveChatSessionIds,
    agentServiceMode,
    callStatus,
    clearAgentServiceMode,
    closeAllCallInteractionTabs,
    currentCallInteractionId,
    clearLiveChat2Sessions,
    clearLiveChatSessions,
    hideCallHandoffNotice,
    markCallInteractionEnded,
    resetBankAppVideoDesktopShare,
    setLiveChatTabOpen,
    setOpenEyeVideoWindowVisible,
  ])

  const updateCallStatus = useCallback((status: CallStatus) => {
    setCallStatus(status)
    setCallStatusStartedAt(Date.now())
  }, [])

  const handleServiceSignIn = useCallback(
    (mode: AgentServiceMode) => {
      setAgentServiceMode(mode)
      updateAgentStatus('Ready', mode, { seedDefaultLiveChat: true })
    },
    [setAgentServiceMode, updateAgentStatus],
  )

  const isSignedIn = agentStatus !== 'Unsigned'
  const isConnectedCall =
    callStatus === 'Talking' || callStatus === 'Hold' || callStatus === 'Mute'
  const hasActiveCallInteraction = callStatus !== 'Idle'
  const hasActiveTextInteraction =
    activeLiveChatSessionIds.length > 0 ||
    activeLiveChat2SessionIds.length > 0
  const hasActiveCustomerInteraction =
    isSignedIn && (hasActiveCallInteraction || hasActiveTextInteraction)

  const showActiveServiceExitWarning = useCallback(
    (action: 'logging out' | 'signing out') => {
      Modal.warning({
        centered: true,
        content: `Please finish or close all current customer services before ${action}.`,
        okText: 'OK',
        title: 'Active Service in Progress',
      })
    },
    [],
  )

  const handleBlockedSignOut = useCallback(() => {
    showActiveServiceExitWarning('signing out')
  }, [showActiveServiceExitWarning])

  const handleLogout = useCallback(() => {
    if (hasActiveCustomerInteraction) {
      showActiveServiceExitWarning('logging out')
      return
    }

    Modal.confirm({
      cancelText: 'Cancel',
      centered: true,
      content:
        'This will end the system session, sign out media status, and return to the login page.',
      okButtonProps: {
        className: 'aicc-logout-confirm__ok',
      },
      okText: 'Log Out',
      okType: 'danger',
      title: 'Confirm Log Out',
      onOk: () => {
        updateAgentStatus('Unsigned', null)
        logout()
        navigate('/login', { replace: true })
      },
    })
  }, [
    hasActiveCustomerInteraction,
    logout,
    navigate,
    showActiveServiceExitWarning,
    updateAgentStatus,
  ])

  const effectiveAgentPresence: AgentPresence = !isSignedIn
    ? 'offline'
    : hasActiveCustomerInteraction
      ? 'busy'
      : agentStatus === 'Ready'
        ? 'ready'
        : 'away'

  useEffect(() => {
    if (!isPreAuxStatus(agentStatus) || hasActiveCustomerInteraction) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      updateAgentStatus(createAuxStatus(getAuxReason(agentStatus)))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [agentStatus, hasActiveCustomerInteraction, updateAgentStatus])

  useEffect(() => {
    setVoiceVideoHandoffReadiness(voiceVideoHandoffReadiness)
  }, [setVoiceVideoHandoffReadiness, voiceVideoHandoffReadiness])

  useEffect(() => {
    setDigitalHandoffReadiness(digitalHandoffReadiness)
  }, [digitalHandoffReadiness, setDigitalHandoffReadiness])

  useEffect(() => {
    if (!callHandoffNotice.reason) {
      return undefined
    }

    const noticeId = callHandoffNotice.id
    const timer = window.setTimeout(() => {
      setCallHandoffNotice((current) =>
        current.id === noticeId
          ? {
              ...current,
              reason: null,
            }
          : current,
      )
    }, 4500)

    return () => window.clearTimeout(timer)
  }, [callHandoffNotice.id, callHandoffNotice.reason])

  useEffect(() => {
    setOpenEyeVideoWindowVisible(
      activeCallChannel === 'video' &&
        isConnectedCall &&
        currentCallInteraction?.kind === 'video' &&
        currentCallInteraction.phase !== 'ended',
    )
  }, [
    activeCallChannel,
    currentCallInteraction,
    isConnectedCall,
    setOpenEyeVideoWindowVisible,
  ])

  useEffect(() => {
    if (!isAfterCallWork || agentStatus !== 'Not Ready') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      updateAgentStatus('Ready')
      setIsAfterCallWork(false)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [agentStatus, isAfterCallWork, updateAgentStatus])

  const handleReadyToggle = useCallback(() => {
    updateAgentStatus(agentStatus === 'Ready' ? 'Not Ready' : 'Ready')
  }, [agentStatus, updateAgentStatus])

  const triggerVoiceInboundCall = useCallback(
    (source?: InboundPopupSource, activateWorkspace = true) => {
      if (voiceVideoHandoffReadiness !== 'available') {
        showCallHandoffNotice(voiceVideoHandoffReadiness)
        return
      }

      hideCallHandoffNotice()
      setCallTiming(initialCallTiming)
      setActiveCallChannel('voice')
      setIsAfterCallWork(false)
      setOpenEyeVideoWindowVisible(false)
      resetBankAppVideoDesktopShare()
      createCallInteraction('voice', source ?? 'pstn', activateWorkspace)
      updateCallStatus('Incoming')
    },
    [
      createCallInteraction,
      hideCallHandoffNotice,
      resetBankAppVideoDesktopShare,
      setOpenEyeVideoWindowVisible,
      showCallHandoffNotice,
      updateCallStatus,
      voiceVideoHandoffReadiness,
    ],
  )

  const triggerVideoInboundCall = useCallback(
    (source?: VideoCallPopupSource, activateWorkspace = true) => {
      if (voiceVideoHandoffReadiness !== 'available') {
        showCallHandoffNotice(voiceVideoHandoffReadiness)
        return
      }

      hideCallHandoffNotice()
      setCallTiming(initialCallTiming)
      setActiveCallChannel('video')
      setIsAfterCallWork(false)
      setOpenEyeVideoWindowVisible(false)
      if (source !== 'bankapp-video') {
        resetBankAppVideoDesktopShare()
      }
      createCallInteraction('video', source ?? 'standard', activateWorkspace)
      updateCallStatus('Incoming')
    },
    [
      createCallInteraction,
      hideCallHandoffNotice,
      resetBankAppVideoDesktopShare,
      setOpenEyeVideoWindowVisible,
      showCallHandoffNotice,
      updateCallStatus,
      voiceVideoHandoffReadiness,
    ],
  )

  const startTalkingCall = useCallback(() => {
    const now = Date.now()
    setCallTiming({
      ...initialCallTiming,
      talkingStartedAt: now,
    })
    setIsAfterCallWork(false)
    if (currentCallInteractionId) {
      markCallInteractionActive(currentCallInteractionId)
    }
    setOpenEyeVideoWindowVisible(activeCallChannel === 'video')
    updateCallStatus('Talking')
  }, [
    activeCallChannel,
    currentCallInteractionId,
    markCallInteractionActive,
    setOpenEyeVideoWindowVisible,
    updateCallStatus,
  ])

  const handleAnswer = useCallback(() => {
    if (callStatus === 'Incoming') {
      startTalkingCall()
    }
  }, [callStatus, startTalkingCall])

  useEffect(() => {
    if (callStatus !== 'Incoming') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      startTalkingCall()
    }, autoAnswerSeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [autoAnswerSeconds, callStatus, startTalkingCall])

  useEffect(() => {
    if (
      customerOutboundCallRequestId === 0 ||
      handledOutboundCallRequestIdRef.current === customerOutboundCallRequestId
    ) {
      return
    }

    handledOutboundCallRequestIdRef.current = customerOutboundCallRequestId

    if (agentStatus === 'Unsigned') {
      return
    }

    const timer = window.setTimeout(startTalkingCall, 0)

    return () => window.clearTimeout(timer)
  }, [agentStatus, customerOutboundCallRequestId, startTalkingCall])

  useEffect(() => {
    if (
      bankAppVoiceCallRequestId === 0 ||
      handledBankAppVoiceCallRequestIdRef.current === bankAppVoiceCallRequestId
    ) {
      return
    }

    handledBankAppVoiceCallRequestIdRef.current = bankAppVoiceCallRequestId
    triggerVoiceInboundCall(
      'bankapp-voice',
      bankAppVoiceCallActivateWorkspace,
    )
  }, [
    bankAppVoiceCallActivateWorkspace,
    bankAppVoiceCallRequestId,
    triggerVoiceInboundCall,
  ])

  useEffect(() => {
    if (
      bankAppVideoCallRequestId === 0 ||
      handledBankAppVideoCallRequestIdRef.current === bankAppVideoCallRequestId
    ) {
      return
    }

    handledBankAppVideoCallRequestIdRef.current = bankAppVideoCallRequestId
    triggerVideoInboundCall(
      'bankapp-video',
      bankAppVideoCallActivateWorkspace,
    )
  }, [
    bankAppVideoCallActivateWorkspace,
    bankAppVideoCallRequestId,
    triggerVideoInboundCall,
  ])

  const handleHoldToggle = useCallback(() => {
    const now = Date.now()

    if (callStatus === 'Hold') {
      setCallTiming((current) => ({
        ...current,
        accumulatedHoldSeconds:
          current.accumulatedHoldSeconds +
          (current.holdStartedAt
            ? Math.floor((now - current.holdStartedAt) / 1000)
            : 0),
        holdStartedAt: null,
      }))
      updateCallStatus('Talking')
      return
    }

    setCallTiming((current) => ({
      ...current,
      holdStartedAt: now,
      muteStartedAt: null,
      accumulatedMuteSeconds:
        current.accumulatedMuteSeconds +
        (current.muteStartedAt
          ? Math.floor((now - current.muteStartedAt) / 1000)
          : 0),
    }))
    updateCallStatus('Hold')
  }, [callStatus, updateCallStatus])

  const handleMuteToggle = useCallback(() => {
    const now = Date.now()

    if (callStatus === 'Mute') {
      setCallTiming((current) => ({
        ...current,
        accumulatedMuteSeconds:
          current.accumulatedMuteSeconds +
          (current.muteStartedAt
            ? Math.floor((now - current.muteStartedAt) / 1000)
            : 0),
        muteStartedAt: null,
      }))
      updateCallStatus('Talking')
      return
    }

    setCallTiming((current) => ({
      ...current,
      muteStartedAt: now,
      holdStartedAt: null,
      accumulatedHoldSeconds:
        current.accumulatedHoldSeconds +
        (current.holdStartedAt
          ? Math.floor((now - current.holdStartedAt) / 1000)
          : 0),
    }))
    updateCallStatus('Mute')
  }, [callStatus, updateCallStatus])

  const handleHangUp = useCallback(() => {
    const shouldKeepPreAux = isPreAuxStatus(agentStatus)

    if (currentCallInteractionId) {
      markCallInteractionEnded(currentCallInteractionId)
    }

    updateCallStatus('Idle')
    setCallTiming(initialCallTiming)
    setActiveCallChannel(null)
    setIsAfterCallWork(!shouldKeepPreAux)
    hideCallHandoffNotice()
    setOpenEyeVideoWindowVisible(false)
    resetBankAppVideoDesktopShare()
    if (!shouldKeepPreAux) {
      updateAgentStatus('Not Ready')
    }
  }, [
    agentStatus,
    currentCallInteractionId,
    hideCallHandoffNotice,
    markCallInteractionEnded,
    resetBankAppVideoDesktopShare,
    setOpenEyeVideoWindowVisible,
    updateAgentStatus,
    updateCallStatus,
  ])

  const handlePrimaryMenuClick = useCallback(
    (item: SideMenuItem) => {
      if (collapsed) {
        setClosedFlyoutKey(item.key)

        if (!item.children?.length) {
          setSelectedMenuKey(item.key)
        }

        return
      }

      if (item.children?.length) {
        setOpenMenuKeys((current) =>
          current.includes(item.key)
            ? current.filter((menuKey) => menuKey !== item.key)
            : [...current, item.key],
        )
        return
      }

      setSelectedMenuKey(item.key)
    },
    [collapsed],
  )

  const handleChildMenuClick = useCallback(
    (childKey: string, parentKey?: string) => {
      setSelectedMenuKey(childKey)
      setClosedFlyoutKey(parentKey ?? null)

      if (childKey === 'test-pstn-voice') {
        navigate('/')
        triggerVoiceInboundCall()
      }

      if (childKey === 'customer-bankapp') {
        navigate('/')
        requestBankAppDemoWorkspace()
      }

      if (childKey === 'customer-whatsapp') {
        navigate('/')
        requestWhatsAppDemoWorkspace()
      }

      if (childKey === 'call-management-verification-rules') {
        navigate('/call-management/verification-rules')
      }

      if (childKey === 'call-management-global-control-configuration') {
        navigate('/call-management/global-control-configuration')
      }

      if (childKey === 'call-management-blacklist') {
        navigate('/call-management/blacklist')
      }

      if (childKey === 'call-management-priority-list') {
        navigate('/call-management/priority-list')
      }

      if (childKey === 'call-management-busy-reasons') {
        navigate('/call-management/busy-reasons')
      }

      const routingConfigPath = routingConfigRoutesByMenuKey[childKey]

      if (routingConfigPath) {
        navigate(routingConfigPath)
      }
    },
    [
      navigate,
      requestBankAppDemoWorkspace,
      requestWhatsAppDemoWorkspace,
      triggerVoiceInboundCall,
    ],
  )

  const handleSiderToggle = useCallback(() => {
    const nextCollapsed = !collapsed
    setCollapsed(nextCollapsed)

    if (nextCollapsed) {
      setClosedFlyoutKey(null)
      setMenuSearchQuery('')
    }
  }, [collapsed, setCollapsed])

  const visibleSideMenuItems = useMemo(() => {
    if (collapsed) {
      return sideMenuItems
    }

    const query = menuSearchQuery.trim().toLowerCase()

    if (!query) {
      return sideMenuItems
    }

    return sideMenuItems
      .map((item) => {
        const parentMatches = item.label.toLowerCase().includes(query)
        const childMatches = item.children?.filter((childItem) =>
          childItem.label.toLowerCase().includes(query),
        )

        if (parentMatches) {
          return item
        }

        if (childMatches?.length) {
          return {
            ...item,
            children: childMatches,
          }
        }

        return null
      })
      .filter((item): item is SideMenuItem => Boolean(item))
  }, [collapsed, menuSearchQuery])

  const timerState = useMemo(() => {
    if (callStatus === 'Talking') {
      return {
        label: callStatus,
        startedAt: callTiming.talkingStartedAt ?? callStatusStartedAt,
        elapsedSeconds: null,
      }
    }

    if (callStatus === 'Hold') {
      return {
        label: callStatus,
        startedAt: callTiming.holdStartedAt ?? callStatusStartedAt,
        elapsedSeconds: callTiming.accumulatedHoldSeconds,
      }
    }

    if (callStatus === 'Mute') {
      return {
        label: callStatus,
        startedAt: callTiming.muteStartedAt ?? callStatusStartedAt,
        elapsedSeconds: callTiming.accumulatedMuteSeconds,
      }
    }

    if (isAuxLikeStatus(agentStatus)) {
      return {
        label: agentStatus,
        startedAt: statusStartedAt,
        elapsedSeconds: null,
      }
    }

    return {
      label: agentStatus,
      startedAt: statusStartedAt,
      elapsedSeconds: null,
    }
  }, [
    agentStatus,
    callStatus,
    callStatusStartedAt,
    callTiming,
    statusStartedAt,
  ])
  const callIdentification = useMemo(() => {
    if (callStatus === 'Idle' || !currentCallInteraction) {
      return null
    }

    if (currentCallInteraction.kind === 'voice') {
      return currentCallInteraction.source === 'bankapp-voice'
        ? { label: 'BankID', value: '00012345' }
        : { label: 'IVR', value: '08123456789' }
    }

    if (
      currentCallInteraction.kind === 'video' &&
      currentCallInteraction.source === 'bankapp-video'
    ) {
      return { label: 'BankID', value: '00012345' }
    }

    return null
  }, [callStatus, currentCallInteraction])
  const routeMenuKey = useMemo(() => {
    if (location.pathname.startsWith('/call-management/verification-rules')) {
      return 'call-management-verification-rules'
    }

    if (
      location.pathname.startsWith(
        '/call-management/global-control-configuration',
      )
    ) {
      return 'call-management-global-control-configuration'
    }

    if (location.pathname.startsWith('/call-management/busy-reasons')) {
      return 'call-management-busy-reasons'
    }

    if (location.pathname.startsWith('/call-management/blacklist')) {
      return 'call-management-blacklist'
    }

    if (location.pathname.startsWith('/call-management/priority-list')) {
      return 'call-management-priority-list'
    }

    return routingConfigMenuKeyByRoute[location.pathname] ?? null
  }, [location.pathname])
  const effectiveSelectedMenuKey = routeMenuKey ?? selectedMenuKey
  const effectiveOpenMenuKeys = useMemo(() => {
    if (
      !collapsed &&
      routeMenuKey?.startsWith('routing-') &&
      !openMenuKeys.includes('routing-config')
    ) {
      return [...openMenuKeys, 'routing-config']
    }

    if (
      !collapsed &&
      routeMenuKey?.startsWith('call-management') &&
      !openMenuKeys.includes('call-management')
    ) {
      return [...openMenuKeys, 'call-management']
    }

    return openMenuKeys
  }, [collapsed, openMenuKeys, routeMenuKey])

  return (
    <Layout className="aicc-app-shell">
      <Header className="aicc-header">
        <div className="aicc-header__brand">
          <span className="aicc-header__logo">BANK 1</span>
        </div>
        {isSignedIn && (
          <AgentToolbar
            agentStatus={agentStatus}
            callStatus={callStatus}
            callIdentification={callIdentification}
            baseElapsedSeconds={timerState.elapsedSeconds}
            timerLabel={timerState.label}
            timerStartedAt={timerState.startedAt}
            toolbarDisplayMode={toolbarDisplayMode}
            onAnswer={handleAnswer}
            onHangUp={handleHangUp}
            onHoldToggle={handleHoldToggle}
            onMuteToggle={handleMuteToggle}
            onReadyToggle={handleReadyToggle}
            onToolbarDisplayModeChange={setToolbarDisplayMode}
          />
        )}
        <div className="aicc-header__actions">
          <button
            aria-label="Notifications"
            className="aicc-header__icon-button aicc-header__icon-button--plain"
            type="button"
          >
            <BellOutlined />
          </button>
          <button
            aria-label="Internal Chat"
            className="aicc-header__icon-button aicc-header__icon-button--plain"
            type="button"
            onClick={() => setIsInternalChatOpen(true)}
          >
            <Badge count={4} size="small">
              <MessageOutlined />
            </Badge>
          </button>
          <span className="aicc-header__divider" />
          <AgentProfileArea
            agentName={authSession?.displayName}
            presence={effectiveAgentPresence}
            roleName={authSession?.roleName}
            serviceMode={agentServiceMode}
            status={agentStatus}
            teamName={authSession?.team}
            hasActiveCustomerInteraction={hasActiveCustomerInteraction}
            onBlockedSignOut={handleBlockedSignOut}
            onServiceSignIn={handleServiceSignIn}
            onStatusChange={updateAgentStatus}
          />
          <button
            aria-label="Log Out"
            className="aicc-header__logout-button"
            title="Log Out"
            type="button"
            onClick={handleLogout}
          >
            <PoweroffOutlined />
          </button>
        </div>
      </Header>
      {callHandoffNotice.reason && (
        <div
          aria-live="polite"
          className="aicc-call-handoff-warning"
          role="status"
        >
          <ExclamationCircleOutlined />
          <span>{callHandoffNoticeMessage}</span>
        </div>
      )}
      <InternalChatModal
        open={isInternalChatOpen}
        onClose={() => setIsInternalChatOpen(false)}
      />
      <Layout className="aicc-body">
        <Sider
          className={`aicc-sider ${
            collapsed ? 'aicc-sider--collapsed' : 'aicc-sider--expanded'
          }`}
          collapsed={collapsed}
          collapsedWidth={48}
          collapsible
          theme="light"
          trigger={null}
          width="var(--aicc-layout-sider-width)"
        >
          <div className="aicc-sider__toggle">
            <button
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              className="aicc-sider__toggle-button"
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              type="button"
              onClick={handleSiderToggle}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            {!collapsed && (
              <label className="aicc-sider__search">
                <SearchOutlined />
                <input
                  aria-label="Search navigation menu"
                  placeholder="Search menu"
                  type="search"
                  value={menuSearchQuery}
                  onChange={(event) => setMenuSearchQuery(event.target.value)}
                />
              </label>
            )}
          </div>
          <nav className="aicc-sider__menu" aria-label="System navigation">
            {visibleSideMenuItems.map((item) => {
              const hasChildren = Boolean(item.children?.length)
              const isOpen =
                effectiveOpenMenuKeys.includes(item.key) ||
                Boolean(menuSearchQuery.trim())
              const isSelected =
                effectiveSelectedMenuKey === item.key ||
                Boolean(
                  item.children?.some(
                    (childItem) => childItem.key === effectiveSelectedMenuKey,
                  ),
                )

              return (
                <div
                  className={`aicc-sider__menu-group ${
                    isSelected ? 'aicc-sider__menu-group--selected' : ''
                  } ${
                    collapsed && closedFlyoutKey === item.key
                      ? 'aicc-sider__menu-group--flyout-closed'
                      : ''
                  }`}
                  key={item.key}
                  onMouseEnter={() => {
                    if (closedFlyoutKey === item.key) {
                      setClosedFlyoutKey(null)
                    }
                  }}
                  onMouseLeave={() => {
                    if (closedFlyoutKey === item.key) {
                      setClosedFlyoutKey(null)
                    }
                  }}
                >
                  <button
                    aria-expanded={hasChildren ? isOpen : undefined}
                    aria-haspopup={hasChildren ? 'menu' : undefined}
                    className="aicc-sider__menu-button aicc-sider__menu-button--primary"
                    title={collapsed ? item.label : undefined}
                    type="button"
                    onClick={() => handlePrimaryMenuClick(item)}
                  >
                    <span className="aicc-sider__menu-icon">{item.icon}</span>
                    <span className="aicc-sider__menu-label">
                      {item.label}
                    </span>
                  </button>

                  {hasChildren && !collapsed && isOpen && (
                    <div
                      aria-label={`${item.label} submenu`}
                      className="aicc-sider__submenu"
                      role="menu"
                    >
                      {item.children?.map((childItem) => (
                        <button
                          className={`aicc-sider__menu-button aicc-sider__menu-button--child ${
                            effectiveSelectedMenuKey === childItem.key
                              ? 'aicc-sider__menu-button--selected'
                              : ''
                          }`}
                          key={childItem.key}
                          role="menuitem"
                          type="button"
                          onClick={() => handleChildMenuClick(childItem.key)}
                        >
                          {childItem.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {hasChildren && collapsed && (
                    <div
                      aria-label={`${item.label} flyout submenu`}
                      className="aicc-sider__flyout"
                      role="menu"
                    >
                      {item.children?.map((childItem) => (
                        <button
                          className={`aicc-sider__flyout-item ${
                            effectiveSelectedMenuKey === childItem.key
                              ? 'aicc-sider__flyout-item--selected'
                              : ''
                          }`}
                          key={childItem.key}
                          role="menuitem"
                          type="button"
                          onClick={() =>
                            handleChildMenuClick(childItem.key, item.key)
                          }
                        >
                          {childItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {visibleSideMenuItems.length === 0 && (
              <div className="aicc-sider__empty">No menu results</div>
            )}
          </nav>
        </Sider>
        <Content className="aicc-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
