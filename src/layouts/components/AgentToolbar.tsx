import {
  AudioMutedOutlined,
  CaretDownOutlined,
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
import type { AgentStatus, CallStatus, SessionEndReasonEntry } from '../../types'
import { formatDuration } from '../../utils/duration'
import { OutboundCallModal } from './OutboundCallModal'
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
  callSkillDisplayName?: string | null
  callStatus: CallStatus
  canTransfer?: boolean
  sessionEndReasons?: SessionEndReasonEntry[]
  timerLabel: string
  timerStartedAt: number
  toolbarDisplayMode: ToolbarDisplayMode
  onAnswer: () => void
  onHangUp: (endReasonName?: string) => void
  onHoldToggle: () => void
  onMuteToggle: () => void
  onReadyToggle: () => void
}

export function AgentToolbar({
  agentStatus,
  baseElapsedSeconds,
  callIdentification,
  callSkillDisplayName,
  callStatus,
  canTransfer = true,
  sessionEndReasons = [],
  timerLabel,
  timerStartedAt,
  toolbarDisplayMode,
  onAnswer,
  onHangUp,
  onHoldToggle,
  onMuteToggle,
  onReadyToggle,
}: AgentToolbarProps) {
  const [now, setNow] = useState(() => Date.now())
  const [isOutboundOpen, setIsOutboundOpen] = useState(false)
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
  ]

  const handleMoreMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'outbound-call') {
      setIsOutboundOpen(true)
    }
  }
  const endReasonItems: MenuProps['items'] =
    sessionEndReasons.length > 0
      ? [
          {
            key: 'abnormal-end-reason-title',
            label: 'Abnormal End Reason',
            type: 'group',
            children: sessionEndReasons.map((reason) => ({
              key: reason.id,
              label: reason.reasonName,
            })),
          },
        ]
      : [
          {
            key: 'no-abnormal-end-reason',
            disabled: true,
            label: 'No abnormal end reason',
          },
        ]
  const handleEndReasonMenuClick: MenuProps['onClick'] = ({ key }) => {
    const selectedReason = sessionEndReasons.find((reason) => reason.id === key)

    if (!selectedReason) {
      return
    }

    onHangUp(selectedReason.reasonName)
  }
  const callContextTitle = [
    callIdentification
      ? `${callIdentification.label} ${callIdentification.value}`
      : null,
    callSkillDisplayName ? `Skill ${callSkillDisplayName}` : null,
  ]
    .filter(Boolean)
    .join(' | ')
  const callContextNode =
    callIdentification || callSkillDisplayName ? (
      <div
        aria-label={callContextTitle}
        className="aicc-agent-toolbar__identification"
        title={callContextTitle}
      >
        {callIdentification && (
          <span className="aicc-agent-toolbar__identification-row">
            <span>{callIdentification.label}</span>
            <strong>{callIdentification.value}</strong>
          </span>
        )}
        {callSkillDisplayName && (
          <span className="aicc-agent-toolbar__identification-row aicc-agent-toolbar__identification-row--skill">
            <span>Skill</span>
            <strong>{callSkillDisplayName}</strong>
          </span>
        )}
      </div>
    ) : null

  return (
    <>
      <div
        className={[
          'aicc-agent-toolbar',
          toolbarDisplayMode === 'icon'
            ? 'aicc-agent-toolbar--icon-only'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Call controls"
      >
        {!isInCall && (
          <>
            {callContextNode}
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
            {callContextNode}
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
            {canTransfer && (
              <ToolbarButton
                active={isTransferOpen}
                aria-label="Transfer"
                icon={<SwapOutlined />}
                title="Transfer"
                onClick={() => setIsTransferOpen(true)}
              >
                {showButtonText ? 'Transfer' : undefined}
              </ToolbarButton>
            )}
            <span className="aicc-agent-toolbar__split-action">
              <ToolbarButton
                aria-label="Hang Up"
                className="aicc-agent-toolbar__split-main"
                icon={<DisconnectOutlined />}
                title="Hang Up"
                tone="danger"
                onClick={() => onHangUp()}
              >
                {showButtonText ? 'Hang Up' : undefined}
              </ToolbarButton>
              <Dropdown
                classNames={{ root: 'aicc-agent-status-menu' }}
                menu={{
                  items: endReasonItems,
                  onClick: handleEndReasonMenuClick,
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <button
                  aria-label="Select abnormal end reason"
                  className="aicc-agent-toolbar__split-caret"
                  title="Abnormal End Reason"
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                >
                  <CaretDownOutlined />
                </button>
              </Dropdown>
            </span>
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

      {canTransfer && (
        <TransferModal
          open={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
        />
      )}
      <OutboundCallModal
        open={isOutboundOpen}
        onClose={() => setIsOutboundOpen(false)}
      />
    </>
  )
}
