import { Avatar, Input } from 'antd'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BaseButton, BaseModal } from '../components'
import type { ExternalOperationApproval } from '../types'
import {
  approveExternalOperationApproval,
  getExternalOperationApprovalDescription,
  getExternalOperationApprovalsSnapshot,
  rejectExternalOperationApproval,
  subscribeExternalOperationApprovals,
} from '../utils/outboundApproval'

function formatRemainingTime(expiresAt: number, now: number) {
  const seconds = Math.max(0, Math.ceil((expiresAt - now) / 1000))
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const demoQueuedApproval: ExternalOperationApproval = {
  agentAvatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  agentName: 'Siti Rahmawati',
  createdAt: 0,
  expiresAt: Number.MAX_SAFE_INTEGER,
  id: 'tl-approval-demo-queue-item',
  outboundReason: 'financial-risk',
  status: 'pending',
  targetNumber: '081298700456',
  type: 'outbound-number',
  updatedAt: 0,
}

export function TlOutboundApprovalPage() {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('requestId')
  const approvals = useSyncExternalStore(
    subscribeExternalOperationApprovals,
    getExternalOperationApprovalsSnapshot,
    () => [],
  )
  const [now, setNow] = useState(() => Date.now())
  const [reviewNote, setReviewNote] = useState('')
  const [showDemoFollowup, setShowDemoFollowup] = useState(false)
  const pendingApprovals = useMemo(
    () =>
      approvals
        .filter((item) => item.status === 'pending')
        .sort((left, right) => left.createdAt - right.createdAt),
    [approvals],
  )
  const requestedApproval =
    approvals.find(
      (item) => item.id === requestId && item.status === 'pending',
    ) ?? null
  const shouldAppendDemoFollowup =
    pendingApprovals.length === 1 && !showDemoFollowup
  const approval =
    pendingApprovals[0] ??
    (showDemoFollowup ? demoQueuedApproval : requestedApproval)
  const queuedApprovals = [
    ...pendingApprovals.slice(1),
    ...(shouldAppendDemoFollowup ? [demoQueuedApproval] : []),
  ]
  const isDemoApproval = approval?.id === demoQueuedApproval.id
  const approvalCount =
    pendingApprovals.length + (shouldAppendDemoFollowup || showDemoFollowup ? 1 : 0)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  const closePopupAfterResolution = () => {
    if (!window.opener || queuedApprovals.length > 0) {
      return
    }

    window.setTimeout(() => window.close(), 260)
  }

  const handleApprove = () => {
    if (!approval) {
      return
    }

    if (isDemoApproval) {
      setShowDemoFollowup(false)
      closePopupAfterResolution()
      return
    }

    if (shouldAppendDemoFollowup) {
      setShowDemoFollowup(true)
    }
    approveExternalOperationApproval(approval.id, reviewNote)
    setReviewNote('')
    closePopupAfterResolution()
  }

  const handleReject = () => {
    if (!approval) {
      return
    }

    if (isDemoApproval) {
      setShowDemoFollowup(false)
      closePopupAfterResolution()
      return
    }

    if (shouldAppendDemoFollowup) {
      setShowDemoFollowup(true)
    }
    rejectExternalOperationApproval(approval.id, reviewNote)
    setReviewNote('')
    closePopupAfterResolution()
  }

  return (
    <main className="tl-outbound-approval-page">
      <div className="tl-outbound-approval-page__notice" role="status">
        Current window is only for simulating the TL approval page.
      </div>
      <img
        alt="TL monitoring dashboard"
        className="tl-outbound-approval-page__background"
        src="/screenshots/tl-approval-dashboard.png"
      />
      <BaseModal
        className="tl-outbound-approval-modal"
        classNames={{
          body: 'tl-outbound-approval-modal__body',
          header: 'tl-outbound-approval-modal__header',
          title: 'tl-outbound-approval-modal__title',
        }}
        centered
        closable={false}
        footer={null}
        kind="outbound"
        mask
        maskClosable={false}
        open={Boolean(approval)}
        rootClassName="tl-outbound-approval-modal-root"
        title={
          approval ? (
            <>
              <span>Approval</span>
              <span className="tl-outbound-approval-modal__header-meta">
                {approvalCount > 1 && (
                  <span>{showDemoFollowup ? 2 : 1} of {approvalCount}</span>
                )}
                <time>
                  Expires in {formatRemainingTime(approval.expiresAt, now)}
                </time>
              </span>
            </>
          ) : null
        }
        width={400}
      >
        {approval && (
          <div aria-live="polite" className="tl-outbound-approval-modal__content">
            <div className="tl-outbound-approval-modal__agent">
              <Avatar size={28} src={approval.agentAvatarUrl}>
                {approval.agentName.slice(0, 1)}
              </Avatar>
              <strong>{approval.agentName}</strong>
            </div>
            <p className="tl-outbound-approval-modal__description">
              {getExternalOperationApprovalDescription(approval)}
            </p>
            <Input
              maxLength={100}
              placeholder="Add note (optional)"
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
            />
            {queuedApprovals.length > 0 && (
              <div className="tl-outbound-approval-modal__queue">
                <span>{queuedApprovals.length} more pending</span>
                <p>{getExternalOperationApprovalDescription(queuedApprovals[0])}</p>
              </div>
            )}
            <footer className="tl-outbound-approval-modal__actions">
              <BaseButton variant="secondary" onClick={handleReject}>
                Reject
              </BaseButton>
              <BaseButton variant="primary" onClick={handleApprove}>
                Approve
              </BaseButton>
            </footer>
          </div>
        )}
      </BaseModal>
    </main>
  )
}
