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
        label: 'PSTN / Voice',
      },
      {
        key: 'test-chat',
        label: 'Live Chat',
      },
      {
        key: 'test-video',
        label: 'Video Call',
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
  const setCollapsed = useAppStore((state) => state.setCollapsed)
  const requestInboundPopup = useAppStore((state) => state.requestInboundPopup)
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
  const [autoAnswerSeconds, setAutoAnswerSeconds] = useState(3)
  const [isInternalChatOpen, setIsInternalChatOpen] = useState(false)
  const [isAfterCallWork, setIsAfterCallWork] = useState(false)
  const [closedFlyoutKey, setClosedFlyoutKey] = useState<string | null>(null)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>([])
  const [selectedMenuKey, setSelectedMenuKey] = useState('test-pstn-voice')
  const handledOutboundCallRequestIdRef = useRef(0)

  const updateAgentStatus = useCallback((status: AgentStatus) => {
    setAgentStatus(status)
    setStatusStartedAt(Date.now())

    if (status === 'Unsigned' || status.startsWith('AUX')) {
      setCallStatus('Idle')
      setCallStatusStartedAt(Date.now())
      setCallTiming(initialCallTiming)
      setIsAfterCallWork(false)
    }
  }, [])

  const updateCallStatus = useCallback((status: CallStatus) => {
    setCallStatus(status)
    setCallStatusStartedAt(Date.now())
  }, [])

  const isSignedIn = agentStatus !== 'Unsigned'
  const canReceiveInbound = agentStatus === 'Ready' && callStatus === 'Idle'

  useEffect(() => {
    if (!canReceiveInbound || isAfterCallWork) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setCallStatus('Incoming')
      setCallStatusStartedAt(Date.now())
      requestInboundPopup()
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [canReceiveInbound, isAfterCallWork, requestInboundPopup, statusStartedAt])

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

  const startTalkingCall = useCallback(() => {
    const now = Date.now()
    setCallTiming({
      ...initialCallTiming,
      talkingStartedAt: now,
    })
    setIsAfterCallWork(false)
    updateCallStatus('Talking')
  }, [updateCallStatus])

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
    setIsAfterCallWork(true)
    updateAgentStatus('Not Ready')
  }, [updateAgentStatus, updateCallStatus])

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
    },
    [],
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
