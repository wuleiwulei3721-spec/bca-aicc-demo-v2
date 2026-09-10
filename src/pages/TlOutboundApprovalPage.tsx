import { Input } from 'antd'
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { AgentAvatar, BaseButton, BaseModal } from '../components'
import type { ExternalOperationApproval } from '../types'
import { formatAgentDisplay } from '../utils/agentDisplay'
import {
  approveExternalOperationApproval,
  externalOperationApprovalTimeoutMs,
  getExternalOperationApprovalsSnapshot,
  rejectExternalOperationApproval,
  startExternalOperationApprovalReview,
  subscribeExternalOperationApprovals,
} from '../utils/outboundApproval'

function getOutboundReasonLabel(approval: ExternalOperationApproval) {
  return approval.outboundReason === 'financial-risk'
    ? 'Financial Risk'
    : 'Miss Information'
}

function ApprovalRequestDetails({
  approval,
}: {
  approval: ExternalOperationApproval
}) {
  return (
    <div className="tl-outbound-approval-modal__request">
      <div className="tl-outbound-approval-modal__request-main">
        <span>Outbound</span>
        <strong>{approval.targetNumber}</strong>
      </div>
      <span className="tl-outbound-approval-modal__reason-tag">
        {getOutboundReasonLabel(approval)}
      </span>
    </div>
  )
}

const demoFollowupDelayMs = 5 * 1000

function createDemoQueuedApproval(createdAt: number): ExternalOperationApproval {
  return {
    agentEmployeeId: 'AICC1024',
    agentName: 'Siti Rahmawati',
    createdAt,
    id: `tl-approval-demo-queue-item-${createdAt}`,
    outboundReason: 'financial-risk',
    status: 'pending',
    targetNumber: '081298700456',
    type: 'outbound-number',
    updatedAt: createdAt,
  }
}

export function TlOutboundApprovalPage() {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get('requestId')
  const approvals = useSyncExternalStore(
    subscribeExternalOperationApprovals,
    getExternalOperationApprovalsSnapshot,
    () => [],
  )
  const [reviewNote, setReviewNote] = useState('')
  const [demoFollowup, setDemoFollowup] =
    useState<ExternalOperationApproval | null>(null)
  const [initialRequestId] = useState(requestId)
  const [now, setNow] = useState(() => Date.now())
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
  const initialPendingApproval = pendingApprovals.find(
    (item) => item.id === initialRequestId,
  )
  const approval = pendingApprovals[0] ?? demoFollowup ?? requestedApproval
  const queuedApprovals = [
    ...pendingApprovals.slice(1),
    ...(demoFollowup ? [demoFollowup] : []),
  ]
  const isDemoApproval = approval?.id === demoFollowup?.id
  const initialApproval = approvals.find(
    (item) => item.id === initialRequestId,
  )
  const approvalId = approval?.id
  const secondsRemaining = approval
    ? Math.max(
        0,
        Math.ceil(
          ((approval.reviewStartedAt ?? now) +
            externalOperationApprovalTimeoutMs -
            now) /
            1000,
        ),
      )
    : 0

  useEffect(() => {
    if (!approvalId) {
      return
    }

    startExternalOperationApprovalReview(approvalId)
  }, [approvalId])

  useEffect(() => {
    if (!approval) {
      return undefined
    }

    const timer = window.setInterval(() => setNow(Date.now()), 250)

    return () => window.clearInterval(timer)
  }, [approval])

  useEffect(() => {
    if (
      initialApproval?.status !== 'timed-out'
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => window.close(), 180)

    return () => window.clearTimeout(timer)
  }, [initialApproval?.status])

  useEffect(() => {
    if (
      !initialPendingApproval ||
      pendingApprovals.length !== 1 ||
      demoFollowup
    ) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setDemoFollowup(createDemoQueuedApproval(Date.now())),
      demoFollowupDelayMs,
    )

    return () => window.clearTimeout(timer)
  }, [demoFollowup, initialPendingApproval, pendingApprovals.length])

  const closePopupAfterResolution = (resolvedApprovalId: string) => {
    const hasNextApproval =
      pendingApprovals.some((item) => item.id !== resolvedApprovalId) ||
      (demoFollowup !== null && demoFollowup.id !== resolvedApprovalId)

    if (hasNextApproval) {
      return
    }

    window.setTimeout(() => window.close(), 260)
  }

  const handleApprove = () => {
    if (!approval) {
      return
    }

    if (isDemoApproval) {
      setDemoFollowup(null)
      closePopupAfterResolution(approval.id)
      return
    }

    approveExternalOperationApproval(approval.id, reviewNote)
    setReviewNote('')
    closePopupAfterResolution(approval.id)
  }

  const handleReject = () => {
    if (!approval) {
      return
    }

    if (isDemoApproval) {
      setDemoFollowup(null)
      closePopupAfterResolution(approval.id)
      return
    }

    rejectExternalOperationApproval(approval.id, reviewNote)
    setReviewNote('')
    closePopupAfterResolution(approval.id)
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
                <time>{`00:${String(secondsRemaining).padStart(2, '0')}`}</time>
                {queuedApprovals.length > 0 && (
                  <span>{queuedApprovals.length} more pending</span>
                )}
              </span>
            </>
          ) : null
        }
        width={400}
      >
        {approval && (
          <div aria-live="polite" className="tl-outbound-approval-modal__content">
            <div className="tl-outbound-approval-modal__agent">
              <AgentAvatar name={approval.agentName} size={28} />
              <strong>
                {formatAgentDisplay(
                  approval.agentEmployeeId,
                  approval.agentName,
                )}
              </strong>
            </div>
            <ApprovalRequestDetails approval={approval} />
            <Input
              maxLength={100}
              placeholder="Add note (optional)"
              value={reviewNote}
              onChange={(event) => setReviewNote(event.target.value)}
            />
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
