import {
  AudioMutedOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  EllipsisOutlined,
  PauseCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { PhoneIcon, ToolbarButton } from '../../components'
import type { AgentStatus, CallStatus } from '../../types'
import { OutboundCallModal } from './OutboundCallModal'
import { ToolbarSettingsModal } from './ToolbarSettingsModal'
import { TransferModal } from './TransferModal'

interface AgentToolbarProps {
  agentStatus: AgentStatus
  autoAnswerSeconds: number
  baseElapsedSeconds: number | null
  callStatus: CallStatus
  timerLabel: string
  timerStartedAt: number
  onAnswer: () => void
  onAutoAnswerSecondsChange: (seconds: number) => void
  onHangUp: () => void
  onHoldToggle: () => void
  onMuteToggle: () => void
  onReadyToggle: () => void
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function AgentToolbar({
  agentStatus,
  autoAnswerSeconds,
  baseElapsedSeconds,
  callStatus,
  timerLabel,
  timerStartedAt,
  onAnswer,
  onAutoAnswerSecondsChange,
  onHangUp,
  onHoldToggle,
  onMuteToggle,
  onReadyToggle,
}: AgentToolbarProps) {
  const [now, setNow] = useState(() => Date.now())
  const [isOutboundOpen, setIsOutboundOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  const isIncoming = callStatus === 'Incoming'
  const isInCall =
    callStatus === 'Talking' || callStatus === 'Hold' || callStatus === 'Mute'
  const isReady = agentStatus === 'Ready'
  const readyLabel = isReady ? 'Ready' : 'Not Ready'
  const elapsedSeconds = Math.max(
    0,
    (baseElapsedSeconds ?? 0) + Math.floor((now - timerStartedAt) / 1000),
  )
  const moreItems: MenuProps['items'] = [
    {
      key: 'outbound-call',
      icon: <PhoneIcon />,
      label: 'Outbound Call',
    },
  ]

  const handleMoreMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'outbound-call') {
      setIsOutboundOpen(true)
    }

    if (key === 'settings') {
      setIsSettingsOpen(true)
    }
  }

  return (
    <>
      <div className="aicc-agent-toolbar" aria-label="Call controls">
        {!isInCall && (
          <ToolbarButton
            disabled={!isIncoming}
            flashing={isIncoming}
            icon={<PhoneIcon />}
            tone={isIncoming ? 'incoming' : 'default'}
            onClick={onAnswer}
          >
            Answer
          </ToolbarButton>
        )}

        {isInCall && (
          <>
            <ToolbarButton
              active={callStatus === 'Hold'}
              icon={<PauseCircleOutlined />}
              onClick={onHoldToggle}
            >
              Hold
            </ToolbarButton>
            <ToolbarButton
              active={callStatus === 'Mute'}
              icon={<AudioMutedOutlined />}
              onClick={onMuteToggle}
            >
              Mute
            </ToolbarButton>
            <ToolbarButton
              active={isTransferOpen}
              icon={<SwapOutlined />}
              onClick={() => setIsTransferOpen(true)}
            >
              Transfer
            </ToolbarButton>
            <ToolbarButton
              icon={<DisconnectOutlined />}
              tone="danger"
              onClick={onHangUp}
            >
              Hang Up
            </ToolbarButton>
          </>
        )}

        <ToolbarButton
          aria-pressed={isReady}
          icon={isReady ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          selected={isReady}
          tone={isReady ? 'ready' : 'default'}
          onClick={onReadyToggle}
        >
          {readyLabel}
        </ToolbarButton>

        <div className="aicc-agent-toolbar__timer">
          <span>{timerLabel}</span>
          <strong>{formatDuration(elapsedSeconds)}</strong>
        </div>

        <Dropdown
          classNames={{ root: 'aicc-agent-status-menu' }}
          menu={{ items: moreItems, onClick: handleMoreMenuClick }}
          placement="bottomRight"
        >
          <button
            aria-label="More call actions"
            className={[
              'aicc-agent-toolbar__icon-control',
              isOutboundOpen ? 'aicc-agent-toolbar__icon-control--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
          >
            <EllipsisOutlined />
          </button>
        </Dropdown>
      </div>

      <TransferModal
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <OutboundCallModal
        open={isOutboundOpen}
        onClose={() => setIsOutboundOpen(false)}
      />
      <ToolbarSettingsModal
        autoAnswerSeconds={autoAnswerSeconds}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfirm={(seconds) => {
          onAutoAnswerSecondsChange(seconds)
          setIsSettingsOpen(false)
        }}
      />
    </>
  )
}
