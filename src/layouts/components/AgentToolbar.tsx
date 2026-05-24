import {
  AudioMutedOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  EllipsisOutlined,
  PauseCircleOutlined,
  SettingOutlined,
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

export type ToolbarDisplayMode = 'icon' | 'text'

interface CallIdentification {
  label: string
  value: string
}

interface AgentToolbarProps {
  agentStatus: AgentStatus
  baseElapsedSeconds: number | null
  callIdentification?: CallIdentification | null
  callStatus: CallStatus
  timerLabel: string
  timerStartedAt: number
  toolbarDisplayMode: ToolbarDisplayMode
  onAnswer: () => void
  onHangUp: () => void
  onHoldToggle: () => void
  onMuteToggle: () => void
  onReadyToggle: () => void
  onToolbarDisplayModeChange: (displayMode: ToolbarDisplayMode) => void
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function AgentToolbar({
  agentStatus,
  baseElapsedSeconds,
  callIdentification,
  callStatus,
  timerLabel,
  timerStartedAt,
  toolbarDisplayMode,
  onAnswer,
  onHangUp,
  onHoldToggle,
  onMuteToggle,
  onReadyToggle,
  onToolbarDisplayModeChange,
}: AgentToolbarProps) {
  const [now, setNow] = useState(() => Date.now())
  const [draftToolbarDisplayMode, setDraftToolbarDisplayMode] =
    useState<ToolbarDisplayMode>(toolbarDisplayMode)
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
  const showButtonText = toolbarDisplayMode === 'text'
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
      setDraftToolbarDisplayMode(toolbarDisplayMode)
      setIsSettingsOpen(true)
    }
  }

  return (
    <>
      <div className="aicc-agent-toolbar" aria-label="Call controls">
        {!isInCall && (
          <>
            {callIdentification && (
              <div
                aria-label={`${callIdentification.label} ${callIdentification.value}`}
                className="aicc-agent-toolbar__identification"
                title={`${callIdentification.label} ${callIdentification.value}`}
              >
                <span>{callIdentification.label}</span>
                <strong>{callIdentification.value}</strong>
              </div>
            )}
            <ToolbarButton
              aria-label="Answer"
              disabled={!isIncoming}
              flashing={isIncoming}
              icon={<PhoneIcon />}
              title="Answer"
              tone={isIncoming ? 'incoming' : 'default'}
              onClick={onAnswer}
            >
              {showButtonText ? 'Answer' : undefined}
            </ToolbarButton>
          </>
        )}

        {isInCall && (
          <>
            {callIdentification && (
              <div
                aria-label={`${callIdentification.label} ${callIdentification.value}`}
                className="aicc-agent-toolbar__identification"
                title={`${callIdentification.label} ${callIdentification.value}`}
              >
                <span>{callIdentification.label}</span>
                <strong>{callIdentification.value}</strong>
              </div>
            )}
            <ToolbarButton
              active={callStatus === 'Hold'}
              aria-label="Hold"
              icon={<PauseCircleOutlined />}
              title="Hold"
              onClick={onHoldToggle}
            >
              {showButtonText ? 'Hold' : undefined}
            </ToolbarButton>
            <ToolbarButton
              active={callStatus === 'Mute'}
              aria-label="Mute"
              icon={<AudioMutedOutlined />}
              title="Mute"
              onClick={onMuteToggle}
            >
              {showButtonText ? 'Mute' : undefined}
            </ToolbarButton>
            <ToolbarButton
              active={isTransferOpen}
              aria-label="Transfer"
              icon={<SwapOutlined />}
              title="Transfer"
              onClick={() => setIsTransferOpen(true)}
            >
              {showButtonText ? 'Transfer' : undefined}
            </ToolbarButton>
            <ToolbarButton
              aria-label="Hang Up"
              icon={<DisconnectOutlined />}
              title="Hang Up"
              tone="danger"
              onClick={onHangUp}
            >
              {showButtonText ? 'Hang Up' : undefined}
            </ToolbarButton>
          </>
        )}

        <ToolbarButton
          aria-label={readyLabel}
          aria-pressed={isReady}
          icon={isReady ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          selected={isReady}
          title={readyLabel}
          tone={isReady ? 'ready' : 'default'}
          onClick={onReadyToggle}
        >
          {showButtonText ? readyLabel : undefined}
        </ToolbarButton>

        <div className="aicc-agent-toolbar__timer">
          <span>{timerLabel}</span>
          <strong>{formatDuration(elapsedSeconds)}</strong>
        </div>

        <Dropdown
          classNames={{ root: 'aicc-agent-status-menu' }}
          menu={{ items: moreItems, onClick: handleMoreMenuClick }}
          placement="bottomRight"
          trigger={['click']}
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
        displayMode={draftToolbarDisplayMode}
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfirm={() => {
          onToolbarDisplayModeChange(draftToolbarDisplayMode)
          setIsSettingsOpen(false)
        }}
        onDisplayModeChange={setDraftToolbarDisplayMode}
      />
    </>
  )
}
