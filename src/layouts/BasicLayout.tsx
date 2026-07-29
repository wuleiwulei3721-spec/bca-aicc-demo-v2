import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  BranchesOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PoweroffOutlined,
  RobotOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Badge, Layout, Modal } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  isLocalVisibility,
  isModuleVisible,
  type ModuleVisibilityKey,
} from '../config/moduleVisibility'
import {
  getWorkspacePageTabByPathname,
  workspacePageTabByMenuKey,
  workspacePageTabByTabKey,
  workspacePageTabDefinitions,
} from '../config/workspacePageTabs'
import { getNewCustomerAlertSoundUrl } from '../config/newCustomerAlertSounds'
import { headerAgentProfile } from '../mock/agent'
import {
  monitoringScreenshotViews,
  type MonitoringScreenshotView,
} from '../mock/monitoring'
import { useIdleLogout } from '../hooks/useIdleLogout'
import {
  useAppStore,
  useAuthStore,
  useCallManagementStore,
  useRoutingConfigStore,
} from '../store'
import type {
  CallTransferContext,
  InboundPopupSource,
  VideoCallPopupSource,
} from '../store'
import type {
  AgentStatus,
  BankAppCustomerType,
  CallStatus,
  LoginLogLogoutType,
  SessionEndMediaType,
} from '../types'
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
import { OperationNotice } from '../components'

const { Header, Sider, Content } = Layout

interface SideMenuChildItem {
  externalUrl?: string
  key: string
  label: string
  localOnly?: boolean
}

interface SideMenuItem {
  key: string
  externalUrl?: string
  icon: ReactNode
  label: string
  children?: SideMenuChildItem[]
  moduleKey: ModuleVisibilityKey
}

interface CallTiming {
  talkingStartedAt: number | null
  holdStartedAt: number | null
  accumulatedHoldSeconds: number
}

type ActiveCallChannel = 'voice' | 'video' | null
type CallHandoffNoticeReason = Exclude<
  VoiceVideoHandoffReadiness,
  'available'
>

interface AgentStatusUpdateOptions {
  bypassPreAux?: boolean
  seedDefaultLiveChat?: boolean
}

const initialCallTiming: CallTiming = {
  talkingStartedAt: null,
  holdStartedAt: null,
  accumulatedHoldSeconds: 0,
}

const monitoringMenuKeyPrefix = 'monitoring-'
const monitoringViewByMenuKey = Object.fromEntries(
  monitoringScreenshotViews.map((view) => [
    `${monitoringMenuKeyPrefix}${view.key}`,
    view,
  ]),
) as Record<string, MonitoringScreenshotView>
const monitoringMenuChildren: SideMenuChildItem[] =
  monitoringScreenshotViews.map((view) => ({
    key: `${monitoringMenuKeyPrefix}${view.key}`,
    label: view.label,
  }))
const qualityManageUrl = 'https://www.QualityManage.example/'
const aiAssistConfigUrl = 'https://www.AIAssistConfig.example/'
const aiMenuChildren: SideMenuChildItem[] = [
  {
    externalUrl: qualityManageUrl,
    key: 'ai-quality-manage',
    label: 'Quality Manage',
  },
  {
    externalUrl: aiAssistConfigUrl,
    key: 'ai-assist-config',
    label: 'AI Assist Config',
  },
]

function openExternalMenuUrl(url: string) {
  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (openedWindow) {
    openedWindow.opener = null
  }
}

function getWorkspacePageMenuChildren(moduleKey: ModuleVisibilityKey) {
  return workspacePageTabDefinitions
    .filter((definition) => definition.moduleKey === moduleKey)
    .map((definition) => ({
      key: definition.menuKey,
      label: definition.label,
    }))
}

const allSideMenuItems: SideMenuItem[] = [
  {
    key: 'test-menu',
    icon: <AppstoreOutlined />,
    label: 'Channel Simulation',
    moduleKey: 'channel-simulation',
    children: [
      {
        key: 'test-pstn-voice',
        label: 'PSTN',
      },
      {
        key: 'test-transferred-voice',
        label: 'Transferred Call',
        localOnly: true,
      },
      {
        key: 'customer-bankapp',
        label: 'BankApp',
      },
      {
        key: 'customer-webchat',
        label: 'Webchat',
      },
      {
        key: 'customer-whatsapp',
        label: 'WhatsApp',
      },
      {
        key: 'customer-email',
        label: 'Email',
      },
      {
        key: 'customer-social-media',
        label: 'Social Media',
      },
    ],
  },
  {
    key: 'monitoring',
    icon: <BarChartOutlined />,
    label: 'Monitoring',
    moduleKey: 'monitoring',
    children: monitoringMenuChildren,
  },
  {
    key: 'ai',
    icon: <RobotOutlined />,
    label: 'AI',
    moduleKey: 'monitoring',
    children: aiMenuChildren,
  },
  {
    key: 'call-management',
    icon: <CustomerServiceOutlined />,
    label: 'Call Management',
    moduleKey: 'call-management',
    children: getWorkspacePageMenuChildren('call-management'),
  },
  {
    key: 'routing-config',
    icon: <BranchesOutlined />,
    label: 'Routing Config',
    moduleKey: 'routing-config',
    children: getWorkspacePageMenuChildren('routing-config'),
  },
  {
    key: 'employee-management',
    icon: <IdcardOutlined />,
    label: 'Employee Management',
    moduleKey: 'employee-management',
    children: getWorkspacePageMenuChildren('employee-management'),
  },
  {
    key: 'design-system',
    icon: <SettingOutlined />,
    label: 'Design System',
    moduleKey: 'design-system',
  },
]

const sideMenuItems = allSideMenuItems
  .filter((item) => isModuleVisible(item.moduleKey))
  .map((item) => ({
    ...item,
    children: item.children?.filter(
      (child) => !child.localOnly || isLocalVisibility,
    ),
  }))
const externalChildMenuUrlByKey = Object.fromEntries(
  allSideMenuItems.flatMap((item) =>
    (item.children ?? [])
      .filter((childItem) => childItem.externalUrl)
      .map((childItem) => [childItem.key, childItem.externalUrl]),
  ),
) as Record<string, string | undefined>

function getRouteMenuKeyByPathname(pathname: string) {
  return getWorkspacePageTabByPathname(pathname)?.menuKey ?? null
}

function getRouteParentMenuKey(routeMenuKey: string | null) {
  if (!routeMenuKey) {
    return null
  }

  if (routeMenuKey.startsWith('monitoring-')) {
    return 'monitoring'
  }

  if (routeMenuKey.startsWith('routing-')) {
    return 'routing-config'
  }

  if (routeMenuKey.startsWith('call-management')) {
    return 'call-management'
  }

  if (routeMenuKey.startsWith('employee-')) {
    return 'employee-management'
  }

  return null
}

export function BasicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const authSession = useAuthStore((state) => state.session)
  const logout = useAuthStore((state) => state.logout)
  const recordLoginLog = useCallManagementStore((state) => state.recordLoginLog)
  const canTransferToNumber =
    authSession?.permissions.includes('transfer:external-number') ?? false
  const callAgentScope =
    authSession?.role === 'agent' ? 'leaders-only' : 'all'
  const sessionEndReasonEntries = useCallManagementStore(
    (state) => state.sessionEndReasonEntries,
  )
  const globalControlConfiguration = useCallManagementStore(
    (state) => state.globalControlConfiguration,
  )
  const collapsed = useAppStore((state) => state.collapsed)
  const activeWorkspaceTabKey = useAppStore(
    (state) => state.activeWorkspaceTabKey,
  )
  const activeLiveChatSessionIds = useAppStore(
    (state) => state.activeLiveChatSessionIds,
  )
  const activeLiveChat2SessionIds = useAppStore(
    (state) => state.activeLiveChat2SessionIds,
  )
  const newCustomerAlert = useAppStore((state) => state.newCustomerAlert)
  const routingChannels = useRoutingConfigStore((state) => state.channels)
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
  const bankAppVideoCustomerType = useAppStore(
    (state) => state.bankAppVideoCustomerType,
  )
  const bankAppVoiceCallActivateWorkspace = useAppStore(
    (state) => state.bankAppVoiceCallActivateWorkspace,
  )
  const bankAppVoiceCallRequestId = useAppStore(
    (state) => state.bankAppVoiceCallRequestId,
  )
  const bankAppVoiceCustomerType = useAppStore(
    (state) => state.bankAppVoiceCustomerType,
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
  const requestEmailWorkspace = useAppStore(
    (state) => state.requestEmailWorkspace,
  )
  const requestSocialMediaWorkspace = useAppStore(
    (state) => state.requestSocialMediaWorkspace,
  )
  const requestWebchatDemoWorkspace = useAppStore(
    (state) => state.requestWebchatDemoWorkspace,
  )
  const selectMonitoringHomeView = useAppStore(
    (state) => state.selectMonitoringHomeView,
  )
  const requestMonitoringMonitorWorkspace = useAppStore(
    (state) => state.requestMonitoringMonitorWorkspace,
  )
  const openWorkspacePageTab = useAppStore(
    (state) => state.openWorkspacePageTab,
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
  const [toolbarDisplayMode] = useState<'icon' | 'text'>('text')
  const [isInternalChatOpen, setIsInternalChatOpen] = useState(false)
  const [systemSoundEnabled, setSystemSoundEnabled] = useState(false)
  const [isAfterCallWork, setIsAfterCallWork] = useState(false)
  const [afterCallWorkDurationSeconds, setAfterCallWorkDurationSeconds] =
    useState(0)
  const [afterCallWorkAuxReason, setAfterCallWorkAuxReason] = useState<
    string | null
  >(null)
  const [callHandoffNotice, setCallHandoffNotice] = useState<{
    id: number
    reason: CallHandoffNoticeReason | null
  }>({
    id: 0,
    reason: null,
  })
  const [transferNotice, setTransferNotice] = useState<{
    id: number
    message: string | null
    tone: 'error' | 'success'
  }>({
    id: 0,
    message: null,
    tone: 'success',
  })
  const [closedFlyoutKey, setClosedFlyoutKey] = useState<string | null>(null)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>(() => {
    const routeParentMenuKey = getRouteParentMenuKey(
      getRouteMenuKeyByPathname(location.pathname),
    )

    return routeParentMenuKey ? [routeParentMenuKey] : []
  })
  const [selectedMenuKey, setSelectedMenuKey] = useState('test-pstn-voice')
  const handledBankAppVideoCallRequestIdRef = useRef(0)
  const handledBankAppVoiceCallRequestIdRef = useRef(0)
  const handledOutboundCallRequestIdRef = useRef(0)
  const playedNewCustomerAlertIdRef = useRef<number | null>(null)
  const newCustomerAlertAudioRef = useRef<HTMLAudioElement | null>(null)
  const currentCallInteraction = currentCallInteractionId
    ? callInteractions[currentCallInteractionId]
    : null
  const hasUnfinishedCurrentCall =
    callStatus !== 'Idle' &&
    currentCallInteraction !== null &&
    currentCallInteraction.phase !== 'ended'
  const voiceVideoHandoffReadiness =
    hasUnfinishedCurrentCall
      ? 'active-call'
      : agentStatus !== 'Ready' || callStatus !== 'Idle'
        ? 'not-ready'
        : 'available'
  const digitalHandoffReadiness =
    agentStatus === 'Ready' ? 'available' : 'not-ready'
  const callHandoffNoticeMessage =
    callHandoffNotice.reason === 'active-call'
      ? 'Active call in progress. Please hang up and wait until the agent is Ready before accepting another voice or video interaction.'
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

  const showTransferNotice = useCallback(
    (notice: { message: string; tone: 'error' | 'success' }) => {
      setTransferNotice((current) => ({
        id: current.id + 1,
        message: notice.message,
        tone: notice.tone,
      }))
    },
    [],
  )

  const updateAgentStatus = useCallback((
    status: AgentStatus,
    options: AgentStatusUpdateOptions = {},
  ) => {
    const hasActiveWork =
      callStatus !== 'Idle' ||
      activeLiveChatSessionIds.length > 0 ||
      activeLiveChat2SessionIds.length > 0
    const nextStatus =
      isAuxStatus(status) &&
      hasActiveWork &&
      !options.bypassPreAux
        ? createPreAuxStatus(getAuxReason(status))
        : status

    setAgentStatus(nextStatus)
    setStatusStartedAt(Date.now())
    if (nextStatus === 'Ready') {
      setLiveChatTabOpen(true, {
        seedDefaultCurrentSessions: options.seedDefaultLiveChat === true,
      })
    } else if (nextStatus === 'Unsigned' || isAuxStatus(nextStatus)) {
      setLiveChatTabOpen(false)
    }

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
    () => {
      const initialStatus: AgentStatus =
        globalControlConfiguration.signInDefaultStatus === 'ready'
          ? 'Ready'
          : 'Not Ready'
      setAgentServiceMode('voice-digital')
      updateAgentStatus(initialStatus, {
        seedDefaultLiveChat: initialStatus === 'Ready',
      })
    },
    [
      globalControlConfiguration.signInDefaultStatus,
      setAgentServiceMode,
      updateAgentStatus,
    ],
  )

  const isSignedIn = agentStatus !== 'Unsigned'

  useEffect(() => {
    if (
      !newCustomerAlert ||
      playedNewCustomerAlertIdRef.current === newCustomerAlert.id
    ) {
      return
    }

    playedNewCustomerAlertIdRef.current = newCustomerAlert.id

    if (!systemSoundEnabled) {
      return
    }

    const sound = routingChannels.find(
      (channel) => channel.channelCode === newCustomerAlert.channelCode,
    )?.businessConfig[newCustomerAlert.mediaCode]?.newCustomerAlertSound

    if (!sound) {
      return
    }

    newCustomerAlertAudioRef.current?.pause()
    const audio = new Audio(getNewCustomerAlertSoundUrl(sound))
    newCustomerAlertAudioRef.current = audio
    void audio.play().catch(() => undefined)
  }, [newCustomerAlert, routingChannels, systemSoundEnabled])

  useEffect(
    () => () => {
      newCustomerAlertAudioRef.current?.pause()
    },
    [],
  )

  const isConnectedCall = callStatus === 'Talking' || callStatus === 'Hold'
  const hasActiveCallInteraction = callStatus !== 'Idle'
  const hasActiveTextInteraction =
    activeLiveChatSessionIds.length > 0 ||
    activeLiveChat2SessionIds.length > 0
  const hasActiveCustomerInteraction =
    isSignedIn && (hasActiveCallInteraction || hasActiveTextInteraction)

  const handleProfileStatusChange = useCallback(
    (nextStatus: AgentStatus) => {
      if (
        nextStatus === 'Ready' ||
        nextStatus === 'Unsigned' ||
        isAuxStatus(nextStatus)
      ) {
        setAfterCallWorkAuxReason(null)
      }

      updateAgentStatus(nextStatus, {
        seedDefaultLiveChat:
          agentStatus === 'Not Ready' && nextStatus === 'Ready',
      })
    },
    [agentStatus, updateAgentStatus],
  )

  const showActiveServiceExitWarning = useCallback(() => {
    Modal.warning({
      centered: true,
      content: 'Please finish or close all current customer services before signing out.',
      okText: 'OK',
      title: 'Active Service in Progress',
    })
  }, [])

  const handleBlockedSignOut = useCallback(() => {
    showActiveServiceExitWarning()
  }, [showActiveServiceExitWarning])

  const completeSystemLogout = useCallback((logoutType: LoginLogLogoutType) => {
    if (authSession) {
      recordLoginLog({
        employeeId: authSession.employeeId,
        employeeName: authSession.displayName,
        logoutType,
        operation: 'Log Out',
      })
    }

    updateAgentStatus('Unsigned')
    logout()
    navigate('/login', { replace: true })
  }, [authSession, logout, navigate, recordLoginLog, updateAgentStatus])

  const handleIdleSystemLogout = useCallback(
    () => completeSystemLogout('System'),
    [completeSystemLogout],
  )

  const handleLogout = useCallback(() => {
    if (hasActiveCustomerInteraction) {
      Modal.warning({
        centered: true,
        content:
          'You have active customer service in progress. Please finish or close it before logging out.',
        okText: 'OK',
        title: 'Active Service in Progress',
      })
      return
    }

    const requiresStatusChange =
      isSignedIn && agentStatus !== 'Not Ready' && !isAuxStatus(agentStatus)

    if (requiresStatusChange) {
      Modal.warning({
        centered: true,
        content:
          'To prevent new customer work from being assigned while you log out, change your status to Not Ready or AUX before logging out.',
        okText: 'OK',
        title: 'Update Agent Status Before Log Out',
      })
      return
    }

    Modal.confirm({
      cancelText: 'Cancel',
      centered: true,
      content: 'Do you want to log out of the system?',
      okButtonProps: {
        className: 'aicc-logout-confirm__ok',
      },
      okText: 'Log Out',
      okType: 'danger',
      title: 'Confirm Log Out',
      onOk: () => completeSystemLogout('User'),
    })
  }, [
    agentStatus,
    completeSystemLogout,
    hasActiveCustomerInteraction,
    isSignedIn,
  ])

  const idleLogoutEnabled =
    agentStatus === 'Unsigned' ||
    agentStatus === 'Not Ready' ||
    isAuxStatus(agentStatus)
  const { dismissWarning: dismissIdleLogoutWarning, warningOpen: idleLogoutWarningOpen } =
    useIdleLogout({
      enabled: idleLogoutEnabled,
      onExpire: handleIdleSystemLogout,
      timeoutMinutes: globalControlConfiguration.idleAutoLogOutMinutes,
      warningLeadMinutes: globalControlConfiguration.idleWarningMinutes,
    })

  useEffect(() => {
    if (!idleLogoutWarningOpen || !idleLogoutEnabled) {
      return undefined
    }

    const idleLogoutWarning = Modal.warning({
      autoFocusButton: null,
      centered: true,
      closable: true,
      content:
        'You have been inactive for an extended period. The system will automatically log you out in ' +
        `${globalControlConfiguration.idleWarningMinutes} minutes. Continue working to stay signed in.`,
      maskClosable: true,
      okText: 'Continue Working',
      title: 'Session Expiring',
      onCancel: dismissIdleLogoutWarning,
      onOk: dismissIdleLogoutWarning,
    })

    return () => idleLogoutWarning.destroy()
  }, [
    dismissIdleLogoutWarning,
    globalControlConfiguration.idleWarningMinutes,
    idleLogoutEnabled,
    idleLogoutWarningOpen,
  ])

  const effectiveAgentPresence: AgentPresence = !isSignedIn
    ? 'offline'
    : hasActiveCustomerInteraction
      ? 'busy'
      : agentStatus === 'Ready'
        ? 'ready'
        : 'away'

  useEffect(() => {
    if (
      !isPreAuxStatus(agentStatus) ||
      hasActiveCustomerInteraction ||
      isAfterCallWork
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      updateAgentStatus(createAuxStatus(getAuxReason(agentStatus)))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [
    agentStatus,
    hasActiveCustomerInteraction,
    isAfterCallWork,
    updateAgentStatus,
  ])

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
    if (!transferNotice.message) {
      return undefined
    }

    const noticeId = transferNotice.id
    const timer = window.setTimeout(() => {
      setTransferNotice((current) =>
        current.id === noticeId
          ? { ...current, message: null }
          : current,
      )
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [transferNotice.id, transferNotice.message])

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
    if (
      !isAfterCallWork ||
      (agentStatus !== 'Not Ready' && !isPreAuxStatus(agentStatus))
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      updateAgentStatus(
        afterCallWorkAuxReason
          ? createAuxStatus(afterCallWorkAuxReason)
          : 'Ready',
        { bypassPreAux: Boolean(afterCallWorkAuxReason) },
      )
      setIsAfterCallWork(false)
      setAfterCallWorkAuxReason(null)
    }, afterCallWorkDurationSeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [
    afterCallWorkDurationSeconds,
    afterCallWorkAuxReason,
    agentStatus,
    isAfterCallWork,
    updateAgentStatus,
  ])

  const triggerVoiceInboundCall = useCallback(
    (
      source?: InboundPopupSource,
      activateWorkspace = true,
      bankAppCustomerType?: BankAppCustomerType,
      transferContext?: CallTransferContext,
    ) => {
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
      createCallInteraction(
        'voice',
        source ?? 'pstn',
        activateWorkspace,
        bankAppCustomerType,
        transferContext,
      )
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
    (
      source?: VideoCallPopupSource,
      activateWorkspace = true,
      bankAppCustomerType?: BankAppCustomerType,
    ) => {
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
      createCallInteraction(
        'video',
        source ?? 'standard',
        activateWorkspace,
        bankAppCustomerType,
      )
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
      bankAppVoiceCustomerType,
    )
  }, [
    bankAppVoiceCallActivateWorkspace,
    bankAppVoiceCallRequestId,
    bankAppVoiceCustomerType,
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
      bankAppVideoCustomerType,
    )
  }, [
    bankAppVideoCallActivateWorkspace,
    bankAppVideoCallRequestId,
    bankAppVideoCustomerType,
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
    }))
    updateCallStatus('Hold')
  }, [callStatus, updateCallStatus])

  const handleHangUp = useCallback((endReasonName = 'Normal') => {
    const preAuxReason = isPreAuxStatus(agentStatus)
      ? getAuxReason(agentStatus)
      : null

    if (currentCallInteractionId) {
      markCallInteractionEnded(
        currentCallInteractionId,
        Date.now(),
        endReasonName,
      )
    }

    updateCallStatus('Idle')
    setCallTiming(initialCallTiming)
    setActiveCallChannel(null)
    setAfterCallWorkDurationSeconds(
      globalControlConfiguration.autoCancelAcwSeconds,
    )
    setAfterCallWorkAuxReason(preAuxReason)
    setIsAfterCallWork(true)
    hideCallHandoffNotice()
    setOpenEyeVideoWindowVisible(false)
    resetBankAppVideoDesktopShare()
    if (preAuxReason) {
      setStatusStartedAt(Date.now())
    } else {
      updateAgentStatus('Not Ready')
    }
  }, [
    agentStatus,
    currentCallInteractionId,
    globalControlConfiguration.autoCancelAcwSeconds,
    hideCallHandoffNotice,
    markCallInteractionEnded,
    resetBankAppVideoDesktopShare,
    setOpenEyeVideoWindowVisible,
    updateAgentStatus,
    updateCallStatus,
  ])

  const openWorkspacePageFromMenu = useCallback(
    (menuKey: string) => {
      const workspacePageTab = workspacePageTabByMenuKey[menuKey]

      if (!workspacePageTab) {
        return false
      }

      openWorkspacePageTab(workspacePageTab.tabKey)
      navigate('/')
      return true
    },
    [navigate, openWorkspacePageTab],
  )

  const handlePrimaryMenuClick = useCallback(
    (item: SideMenuItem) => {
      if (collapsed) {
        setClosedFlyoutKey(item.key)

        if (!item.children?.length) {
          setSelectedMenuKey(item.key)
          if (item.externalUrl) {
            openExternalMenuUrl(item.externalUrl)
            return
          }
          openWorkspacePageFromMenu(item.key)
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
      if (item.externalUrl) {
        openExternalMenuUrl(item.externalUrl)
        return
      }
      openWorkspacePageFromMenu(item.key)
    },
    [collapsed, openWorkspacePageFromMenu],
  )

  const handleChildMenuClick = useCallback(
    (childKey: string, parentKey?: string) => {
      setSelectedMenuKey(childKey)
      setClosedFlyoutKey(parentKey ?? null)

      if (parentKey) {
        setOpenMenuKeys((current) =>
          current.includes(parentKey) ? current : [...current, parentKey],
        )
      }

      const externalUrl = externalChildMenuUrlByKey[childKey]

      if (externalUrl) {
        openExternalMenuUrl(externalUrl)
        return
      }

      if (childKey === 'test-pstn-voice') {
        navigate('/')
        triggerVoiceInboundCall()
      }

      if (childKey === 'test-transferred-voice') {
        navigate('/')
        triggerVoiceInboundCall('pstn', true, undefined, {
          sourceAgentEmployeeId: 'AICC1088',
          sourceAgentName: 'Maya Lestari',
          transferredAt: Date.now(),
        })
      }

      if (childKey === 'customer-bankapp') {
        navigate('/')
        requestBankAppDemoWorkspace()
      }

      if (childKey === 'customer-whatsapp') {
        navigate('/')
        requestWhatsAppDemoWorkspace()
      }

      if (childKey === 'customer-email') {
        navigate('/')
        requestEmailWorkspace()
      }

      if (childKey === 'customer-social-media') {
        navigate('/')
        requestSocialMediaWorkspace()
      }

      if (childKey === 'customer-webchat') {
        navigate('/')
        requestWebchatDemoWorkspace()
      }

      const monitoringView = monitoringViewByMenuKey[childKey]

      if (monitoringView) {
        navigate('/')

        if (monitoringView.kind === 'home') {
          selectMonitoringHomeView(monitoringView.key)
        } else {
          requestMonitoringMonitorWorkspace(monitoringView.key)
        }
      }

      if (openWorkspacePageFromMenu(childKey)) {
        return
      }
    },
    [
      navigate,
      openWorkspacePageFromMenu,
      requestBankAppDemoWorkspace,
      requestEmailWorkspace,
      requestMonitoringMonitorWorkspace,
      requestSocialMediaWorkspace,
      requestWebchatDemoWorkspace,
      requestWhatsAppDemoWorkspace,
      selectMonitoringHomeView,
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

    if (isAfterCallWork) {
      return {
        label: 'Not Ready',
        startedAt: statusStartedAt,
        elapsedSeconds: null,
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
    isAfterCallWork,
    statusStartedAt,
  ])
  const callIdentification = useMemo(() => {
    if (callStatus === 'Idle' || !currentCallInteraction) {
      return null
    }

    if (currentCallInteraction.source === 'pstn') {
      return { label: 'IVR:', value: '08123456789' }
    }

    if (
      currentCallInteraction.source === 'bankapp-voice' ||
      currentCallInteraction.source === 'bankapp-video'
    ) {
      return {
        label: 'HaloApp:',
        value:
          currentCallInteraction.bankAppCustomerType === 'guest'
            ? 'Guest'
            : '00012345',
      }
    }

    return null
  }, [callStatus, currentCallInteraction])
  const callSkillDisplayName =
    callStatus === 'Idle' || !currentCallInteraction
      ? null
      : currentCallInteraction.skillDisplayName
  const activeSessionEndMediaType: SessionEndMediaType | null =
    currentCallInteraction?.kind === 'voice'
      ? 'Voice'
      : currentCallInteraction?.kind === 'video'
        ? 'Video'
        : null
  const activeCallSessionEndReasons = useMemo(
    () =>
      activeSessionEndMediaType
        ? sessionEndReasonEntries.filter(
            (entry) =>
              entry.status === 'Active' &&
              entry.mediaTypes.includes(activeSessionEndMediaType),
          )
        : [],
    [activeSessionEndMediaType, sessionEndReasonEntries],
  )
  const routeMenuKey = useMemo(
    () => getRouteMenuKeyByPathname(location.pathname),
    [location.pathname],
  )
  const activeWorkspacePageMenuKey =
    workspacePageTabByTabKey[activeWorkspaceTabKey]?.menuKey ?? null
  const effectiveSelectedMenuKey =
    routeMenuKey ?? activeWorkspacePageMenuKey ?? selectedMenuKey
  const effectiveOpenMenuKeys = openMenuKeys

  return (
    <Layout className="aicc-app-shell">
      <Header className="aicc-header">
        <div className="aicc-header__brand">
          <span className="aicc-header__logo">BANK 1</span>
        </div>
        {isSignedIn && (
          <AgentToolbar
            callAgentScope={callAgentScope}
            requiresOutboundApproval={authSession?.role === 'agent'}
            canTransferToNumber={canTransferToNumber}
            callStatus={callStatus}
            canTransfer={activeCallChannel !== 'video'}
            callIdentification={callIdentification}
            callSkillDisplayName={callSkillDisplayName}
            baseElapsedSeconds={timerState.elapsedSeconds}
            timerLabel={timerState.label}
            timerStartedAt={timerState.startedAt}
            toolbarDisplayMode={toolbarDisplayMode}
            sessionEndReasons={activeCallSessionEndReasons}
            onAnswer={handleAnswer}
            onHangUp={handleHangUp}
            onHoldToggle={handleHoldToggle}
            onTransferNotice={showTransferNotice}
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
            avatarUrl={authSession?.avatarUrl}
            presence={effectiveAgentPresence}
            roleName={authSession?.roleName}
            status={agentStatus}
            teamName={authSession?.team}
            hasActiveCustomerInteraction={hasActiveCustomerInteraction}
            systemSoundEnabled={systemSoundEnabled}
            onBlockedSignOut={handleBlockedSignOut}
            onServiceSignIn={handleServiceSignIn}
            onStatusChange={handleProfileStatusChange}
            onSystemSoundEnabledChange={setSystemSoundEnabled}
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
      <OperationNotice
        message={transferNotice.message}
        tone={transferNotice.tone}
      />
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
