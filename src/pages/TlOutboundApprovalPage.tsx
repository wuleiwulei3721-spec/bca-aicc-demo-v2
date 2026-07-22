import { Avatar, Input } from 'antd'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BaseButton, BaseModal } from '../components'
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
  const approval = useMemo(
    () => approvals.find((item) => item.id === requestId) ?? null,
    [approvals, requestId],
  )

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  const closePopupAfterResolution = () => {
    if (!window.opener) {
      return
    }

    window.setTimeout(() => window.close(), 260)
  }

  const handleApprove = () => {
    if (!approval) {
      return
    }

    approveExternalOperationApproval(approval.id, reviewNote)
    closePopupAfterResolution()
  }

  const handleReject = () => {
    if (!approval) {
      return
    }

    rejectExternalOperationApproval(approval.id, reviewNote)
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
        closable={false}
        footer={null}
        kind="outbound"
        mask={false}
        open={approval?.status === 'pending'}
        rootClassName="tl-outbound-approval-modal-root"
        title={
          approval ? (
            <>
              <span>Approval</span>
              <time>Expires in {formatRemainingTime(approval.expiresAt, now)}</time>
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
