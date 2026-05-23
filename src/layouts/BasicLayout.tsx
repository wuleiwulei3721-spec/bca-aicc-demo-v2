import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PhoneOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Badge, Layout } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { headerAgentProfile } from '../mock/agent'
import { useAppStore } from '../store'
import type { InboundPopupSource, VideoCallPopupSource } from '../store'
import type { AgentStatus, CallStatus } from '../types'
import { AgentProfileArea } from './components/AgentProfileArea'
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

const initialCallTiming: CallTiming = {
  talkingStartedAt: null,
  holdStartedAt: null,
  muteStartedAt: null,
  accumulatedHoldSeconds: 0,
  accumulatedMuteSeconds: 0,
}

const sideMenuItems: SideMenuItem[] = [
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
    key: 'call-management',
    icon: <PhoneOutlined className="aicc-sider__menu-phone-icon" />,
    label: 'Call Management',
  },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
]

export function BasicLayout() {
  const collapsed = useAppStore((state) => state.collapsed)
  const bankAppVideoCallRequestId = useAppStore(
    (state) => state.bankAppVideoCallRequestId,
  )
  const bankAppVoiceCallRequestId = useAppStore(
    (state) => state.bankAppVoiceCallRequestId,
  )
  const setCollapsed = useAppStore((state) => state.setCollapsed)
  const requestInboundPopup = useAppStore((state) => state.requestInboundPopup)
  const requestBankAppDemoWorkspace = useAppStore(
    (state) => state.requestBankAppDemoWorkspace,
  )
  const requestWhatsAppDemoWorkspace = useAppStore(
    (state) => state.requestWhatsAppDemoWorkspace,
  )
  const requestVideoCallPopup = useAppStore(
    (state) => state.requestVideoCallPopup,
  )
  const isVideoCallTabOpen = useAppStore((state) => state.isVideoCallTabOpen)
  const setLiveChatTabOpen = useAppStore(
    (state) => state.setLiveChatTabOpen,
  )
  const setOpenEyeVideoWindowVisible = useAppStore(
    (state) => state.setOpenEyeVideoWindowVisible,
  )
  const setScreenShareActive = useAppStore(
    (state) => state.setScreenShareActive,
  )
  const customerOutboundCallRequestId = useAppStore(
    (state) => state.customerOutboundCallRequestId,
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
  const [autoAnswerSeconds, setAutoAnswerSeconds] = useState(3)
  const [isInternalChatOpen, setIsInternalChatOpen] = useState(false)
  const [isAfterCallWork, setIsAfterCallWork] = useState(false)
  const [closedFlyoutKey, setClosedFlyoutKey] = useState<string | null>(null)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([])
  const [selectedMenuKey, setSelectedMenuKey] = useState('test-pstn-voice')
  const handledBankAppVideoCallRequestIdRef = useRef(0)
  const handledBankAppVoiceCallRequestIdRef = useRef(0)
  const handledOutboundCallRequestIdRef = useRef(0)

  const updateAgentStatus = useCallback((status: AgentStatus) => {
    setAgentStatus(status)
    setStatusStartedAt(Date.now())
    setLiveChatTabOpen(status !== 'Unsigned')

    if (status === 'Unsigned' || status.startsWith('AUX')) {
      setCallStatus('Idle')
      setCallStatusStartedAt(Date.now())
      setCallTiming(initialCallTiming)
      setActiveCallChannel(null)
      setIsAfterCallWork(false)
      setOpenEyeVideoWindowVisible(false)
      setScreenShareActive(false)
    }
  }, [setLiveChatTabOpen, setOpenEyeVideoWindowVisible, setScreenShareActive])

  const updateCallStatus = useCallback((status: CallStatus) => {
    setCallStatus(status)
    setCallStatusStartedAt(Date.now())
  }, [])

  const isSignedIn = agentStatus !== 'Unsigned'
  const isConnectedCall =
    callStatus === 'Talking' || callStatus === 'Hold' || callStatus === 'Mute'

  useEffect(() => {
    setOpenEyeVideoWindowVisible(
      activeCallChannel === 'video' && isConnectedCall && isVideoCallTabOpen,
    )
  }, [
    activeCallChannel,
    isConnectedCall,
    isVideoCallTabOpen,
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
      if (agentStatus !== 'Ready' || callStatus !== 'Idle') {
        return
      }

      setCallTiming(initialCallTiming)
      setActiveCallChannel('voice')
      setIsAfterCallWork(false)
      setOpenEyeVideoWindowVisible(false)
      setScreenShareActive(false)
      updateCallStatus('Incoming')
      requestInboundPopup(source, activateWorkspace)
    },
    [
      agentStatus,
      callStatus,
      requestInboundPopup,
      setOpenEyeVideoWindowVisible,
      setScreenShareActive,
      updateCallStatus,
    ],
  )

  const triggerVideoInboundCall = useCallback(
    (source?: VideoCallPopupSource, activateWorkspace = true) => {
      if (agentStatus !== 'Ready' || callStatus !== 'Idle') {
        return
      }

      setCallTiming(initialCallTiming)
      setActiveCallChannel('video')
      setIsAfterCallWork(false)
      setOpenEyeVideoWindowVisible(false)
      if (source !== 'bankapp-video') {
        setScreenShareActive(false)
      }
      updateCallStatus('Incoming')
      requestVideoCallPopup(source, activateWorkspace)
    },
    [
      agentStatus,
      callStatus,
      requestVideoCallPopup,
      setOpenEyeVideoWindowVisible,
      setScreenShareActive,
      updateCallStatus,
    ],
  )

  const startTalkingCall = useCallback(() => {
    const now = Date.now()
    setCallTiming({
      ...initialCallTiming,
      talkingStartedAt: now,
    })
    setIsAfterCallWork(false)
    setOpenEyeVideoWindowVisible(activeCallChannel === 'video')
    updateCallStatus('Talking')
  }, [activeCallChannel, setOpenEyeVideoWindowVisible, updateCallStatus])

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
    triggerVoiceInboundCall('bankapp-voice', false)
  }, [bankAppVoiceCallRequestId, triggerVoiceInboundCall])

  useEffect(() => {
    if (
      bankAppVideoCallRequestId === 0 ||
      handledBankAppVideoCallRequestIdRef.current === bankAppVideoCallRequestId
    ) {
      return
    }

    handledBankAppVideoCallRequestIdRef.current = bankAppVideoCallRequestId
    triggerVideoInboundCall('bankapp-video', false)
  }, [bankAppVideoCallRequestId, triggerVideoInboundCall])

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
    updateCallStatus('Idle')
    setCallTiming(initialCallTiming)
    setActiveCallChannel(null)
    setIsAfterCallWork(true)
    setOpenEyeVideoWindowVisible(false)
    setScreenShareActive(false)
    updateAgentStatus('Not Ready')
  }, [
    setOpenEyeVideoWindowVisible,
    setScreenShareActive,
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
        triggerVoiceInboundCall()
      }

      if (childKey === 'customer-bankapp') {
        requestBankAppDemoWorkspace()
      }

      if (childKey === 'customer-whatsapp') {
        requestWhatsAppDemoWorkspace()
      }
    },
    [
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

    if (agentStatus.startsWith('AUX')) {
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

  return (
    <Layout className="aicc-app-shell">
      <Header className="aicc-header">
        <div className="aicc-header__brand">
          <span className="aicc-header__logo">BANK 1</span>
        </div>
        {isSignedIn && (
          <AgentToolbar
            agentStatus={agentStatus}
            autoAnswerSeconds={autoAnswerSeconds}
            callStatus={callStatus}
            baseElapsedSeconds={timerState.elapsedSeconds}
            timerLabel={timerState.label}
            timerStartedAt={timerState.startedAt}
            onAnswer={handleAnswer}
            onAutoAnswerSecondsChange={setAutoAnswerSeconds}
            onHangUp={handleHangUp}
            onHoldToggle={handleHoldToggle}
            onMuteToggle={handleMuteToggle}
            onReadyToggle={handleReadyToggle}
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
            status={agentStatus}
            onStatusChange={updateAgentStatus}
          />
        </div>
      </Header>
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
                openMenuKeys.includes(item.key) ||
                Boolean(menuSearchQuery.trim())
              const isSelected =
                selectedMenuKey === item.key ||
                Boolean(
                  item.children?.some(
                    (childItem) => childItem.key === selectedMenuKey,
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
                            selectedMenuKey === childItem.key
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
                            selectedMenuKey === childItem.key
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
