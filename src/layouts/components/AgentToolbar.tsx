import {
  CaretDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DisconnectOutlined,
  EllipsisOutlined,
  PauseCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { BaseModal, PhoneIcon, ToolbarButton } from '../../components'
import type {
  AgentStatus,
  CallStatus,
  SessionEndReasonEntry,
  CommonNumberEntry,
  TransferAgent,
  TransferSkill,
} from '../../types'
import { formatDuration } from '../../utils/duration'
import { OutboundCallModal } from './OutboundCallModal'
import { TransferModal } from './TransferModal'
import {
  getExternalOperationApprovalDescription,
  subscribeExternalOperationApprovalEvents,
} from '../../utils/outboundApproval'

export type ToolbarDisplayMode = 'icon' | 'text'

export interface TransferNotice {
  message: string
  tone: 'error' | 'success'
}

interface ApprovalNotice {
  description: string
  title: string
  tone: 'approved' | 'expired' | 'rejected'
}

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
  onReadyToggle: () => void
  onTransferNotice: (notice: TransferNotice) => void
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
  onReadyToggle,
  onTransferNotice,
}: AgentToolbarProps) {
  const [now, setNow] = useState(() => Date.now())
  const [isOutboundOpen, setIsOutboundOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [consultedAgent, setConsultedAgent] = useState<TransferAgent | null>(
    null,
  )
  const [isConferenceActive, setIsConferenceActive] = useState(false)
  const [approvalNotice, setApprovalNotice] = useState<ApprovalNotice | null>(
    null,
  )

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(
    () =>
      subscribeExternalOperationApprovalEvents((event) => {
        if (!['approved', 'rejected', 'expired'].includes(event.kind)) {
          return
        }

        const { approval } = event
        const result =
          event.kind === 'approved'
            ? 'TL approval granted'
            : event.kind === 'rejected'
              ? 'TL approval rejected'
              : 'TL approval timed out'
        const tone: ApprovalNotice['tone'] =
          event.kind === 'approved'
            ? 'approved'
            : event.kind === 'rejected'
              ? 'rejected'
              : 'expired'
        const note = approval.reviewNote
          ? ` Note: ${approval.reviewNote}`
          : ''
        setApprovalNotice({
          description: `${getExternalOperationApprovalDescription(approval)}.${note}`,
          title: result,
          tone,
        })
      }),
    [],
  )

  useEffect(() => {
    if (!approvalNotice) {
      return undefined
    }

    const timer = window.setTimeout(() => setApprovalNotice(null), 5000)

    return () => window.clearTimeout(timer)
  }, [approvalNotice])

  const isIncoming = callStatus === 'Incoming'
  const isInCall = callStatus === 'Talking' || callStatus === 'Hold'
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
  const closeTransferModal = () => {
    setConsultedAgent(null)
    setIsTransferOpen(false)
  }
  const handleCallEnd = (endReasonName?: string) => {
    closeTransferModal()
    setIsConferenceActive(false)
    onHangUp(endReasonName)
  }
  const handleTransferToAgent = (agent: TransferAgent) => {
    handleCallEnd()
    onTransferNotice({
      message: `Transferred to ${agent.name}.`,
      tone: 'success',
    })
  }
  const handleConferenceWithAgent = (agent: TransferAgent) => {
    setConsultedAgent(null)
    setIsConferenceActive(true)
    setIsTransferOpen(false)
    onTransferNotice({
      message: `${agent.name} joined the conference.`,
      tone: 'success',
    })
  }
  const handleTransferToSkill = (skill: TransferSkill) => {
    handleCallEnd()
    onTransferNotice({
      message: `Transferred to skill queue ${skill.skillName}.`,
      tone: 'success',
    })
  }
  const handleTransferToNumber = (number: string) => {
    handleCallEnd()
    onTransferNotice({
      message: `Transferred to ${number}.`,
      tone: 'success',
    })
  }
  const handleTransferToIvr = (entry: CommonNumberEntry) => {
    handleCallEnd()
    onTransferNotice({
      message: `Transferred to IVR ${entry.name}.`,
      tone: 'success',
    })
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

    handleCallEnd(selectedReason.reasonName)
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
            {canTransfer &&
              (isConferenceActive ? (
                <ToolbarButton
                  aria-label="Transfer"
                  disabled
                  icon={<SwapOutlined />}
                  title="Transfer unavailable during conference"
                >
                  {showButtonText ? 'Transfer' : undefined}
                </ToolbarButton>
              ) : (
                <ToolbarButton
                  active={isTransferOpen}
                  aria-label="Transfer"
                  icon={<SwapOutlined />}
                  title="Transfer"
                  onClick={() => setIsTransferOpen(true)}
                >
                  {showButtonText ? 'Transfer' : undefined}
                </ToolbarButton>
              ))}
            <span className="aicc-agent-toolbar__split-action">
              <ToolbarButton
                aria-label="Hang Up"
                className="aicc-agent-toolbar__split-main"
                icon={<DisconnectOutlined />}
                title="Hang Up"
                tone="danger"
                onClick={() => handleCallEnd()}
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

      {canTransfer && isTransferOpen && (
        <TransferModal
          consultedAgentId={consultedAgent?.id}
          open={isTransferOpen}
          onClose={closeTransferModal}
          onConferenceWithAgent={handleConferenceWithAgent}
          onConsultAgent={setConsultedAgent}
          onTransferToAgent={handleTransferToAgent}
          onTransferToIvr={handleTransferToIvr}
          onTransferToNumber={handleTransferToNumber}
          onTransferToNumberFailed={() =>
            onTransferNotice({
              message: "We couldn't complete the transfer. Please try again.",
              tone: 'error',
            })
          }
          onTransferToSkill={handleTransferToSkill}
        />
      )}
      <OutboundCallModal
        open={isOutboundOpen}
        onClose={() => setIsOutboundOpen(false)}
      />
      <BaseModal
        className={`aicc-approval-result-modal aicc-approval-result-modal--${approvalNotice?.tone ?? 'approved'}`}
        closable
        footer={null}
        kind="standard"
        mask={false}
        open={Boolean(approvalNotice)}
        rootClassName="aicc-approval-result-modal-root"
        title={
          approvalNotice && (
            <span className="aicc-approval-result-modal__title">
              {approvalNotice.tone === 'approved' ? (
                <CheckCircleOutlined />
              ) : approvalNotice.tone === 'rejected' ? (
                <CloseCircleOutlined />
              ) : (
                <ClockCircleOutlined />
              )}
              {approvalNotice.title}
            </span>
          )
        }
        width={360}
        onCancel={() => setApprovalNotice(null)}
      >
        {approvalNotice && (
          <p className="aicc-approval-result-modal__description">
            {approvalNotice.description}
          </p>
        )}
      </BaseModal>
    </>
  )
}
