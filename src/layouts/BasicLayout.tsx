import {
  BellOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { Badge, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { headerAgentProfile } from '../mock/agent'
import { useAppStore } from '../store'
import type { AgentStatus, CallStatus } from '../types'
import { AgentProfileArea } from './components/AgentProfileArea'
import { AgentToolbar } from './components/AgentToolbar'
import { InternalChatModal } from './components/InternalChatModal'

const { Header, Sider, Content } = Layout

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

const sideMenuItems: MenuProps['items'] = [
  {
    key: 'desktop',
    icon: <DashboardOutlined />,
    label: 'Desktop',
  },
  {
    key: 'inbound',
    icon: <CustomerServiceOutlined />,
    label: 'Inbound',
  },
  {
    key: 'voice',
    icon: <PhoneOutlined />,
    label: 'Voice',
  },
]

export function BasicLayout() {
  const requestInboundPopup = useAppStore((state) => state.requestInboundPopup)
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
  const [autoAnswerSeconds, setAutoAnswerSeconds] = useState(5)
  const [isInternalChatOpen, setIsInternalChatOpen] = useState(false)
  const [isAfterCallWork, setIsAfterCallWork] = useState(false)

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

  const handleAnswer = useCallback(() => {
    if (callStatus === 'Incoming') {
      const now = Date.now()
      setCallTiming({
        ...initialCallTiming,
        talkingStartedAt: now,
      })
      updateCallStatus('Talking')
    }
  }, [callStatus, updateCallStatus])

  useEffect(() => {
    if (callStatus !== 'Incoming') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      const now = Date.now()
      setCallTiming({
        ...initialCallTiming,
        talkingStartedAt: now,
      })
      updateCallStatus('Talking')
    }, autoAnswerSeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [autoAnswerSeconds, callStatus, updateCallStatus])

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
          <span className="aicc-header__logo">BCA</span>
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
          className="aicc-sider"
          collapsed
          collapsedWidth={48}
          theme="light"
          width="var(--aicc-layout-sider-width)"
        >
          <Menu
            className="aicc-sider__menu"
            items={sideMenuItems}
            mode="inline"
            selectedKeys={['desktop']}
          />
        </Sider>
        <Content className="aicc-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
