import {
  AudioMutedOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  EllipsisOutlined,
  PauseCircleOutlined,
  PhoneOutlined,
  SettingOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useState } from 'react'
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
      icon: <PhoneOutlined />,
      label: 'Outbound Call',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
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
          <button
            className={[
              'aicc-agent-toolbar__control',
              isIncoming ? 'aicc-agent-toolbar__control--incoming' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!isIncoming}
            type="button"
            onClick={onAnswer}
          >
            <PhoneOutlined />
            <span>Answer</span>
          </button>
        )}

        {isInCall && (
          <>
            <button
              className={[
                'aicc-agent-toolbar__control',
                callStatus === 'Hold'
                  ? 'aicc-agent-toolbar__control--active aicc-agent-toolbar__control--hold-active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={onHoldToggle}
            >
              <PauseCircleOutlined />
              <span>Hold</span>
            </button>
            <button
              className={[
                'aicc-agent-toolbar__control',
                callStatus === 'Mute'
                  ? 'aicc-agent-toolbar__control--active aicc-agent-toolbar__control--mute-active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={onMuteToggle}
            >
              <AudioMutedOutlined />
              <span>Mute</span>
            </button>
            <button
              className={[
                'aicc-agent-toolbar__control',
                isTransferOpen
                  ? 'aicc-agent-toolbar__control--active aicc-agent-toolbar__control--transfer-active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => setIsTransferOpen(true)}
            >
              <SwapOutlined />
              <span>Transfer</span>
            </button>
            <button
              className="aicc-agent-toolbar__control aicc-agent-toolbar__control--danger"
              type="button"
              onClick={onHangUp}
            >
              <DisconnectOutlined />
              <span>Hang Up</span>
            </button>
          </>
        )}

        <button
          aria-pressed={isReady}
          className={[
            'aicc-agent-toolbar__control',
            isReady ? 'aicc-agent-toolbar__control--ready' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          type="button"
          onClick={onReadyToggle}
        >
          {isReady ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          {readyLabel}
        </button>

        <div className="aicc-agent-toolbar__timer">
          <span>{timerLabel}</span>
          <strong>{formatDuration(elapsedSeconds)}</strong>
        </div>

        <Dropdown
          overlayClassName="aicc-agent-status-menu"
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
