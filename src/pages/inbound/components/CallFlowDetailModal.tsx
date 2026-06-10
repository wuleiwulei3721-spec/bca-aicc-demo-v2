import { BaseButton, BaseModal, TimelineFlow } from '../../../components'
import { callFlowDetail } from '../../../mock/inbound'

interface CallFlowDetailModalProps {
  accessMenuLabel?: string
  accessMenuName?: string
  open: boolean
  showIvrJourney?: boolean
  showTransferHistory?: boolean
  onClose: () => void
}

export function CallFlowDetailModal({
  accessMenuLabel = 'Access Menu',
  accessMenuName,
  open,
  showIvrJourney = true,
  showTransferHistory,
  onClose,
}: CallFlowDetailModalProps) {
  const shouldShowTransferHistory =
    (showTransferHistory ?? showIvrJourney) &&
    callFlowDetail.transferHistory.length > 0

  return (
    <BaseModal
      className="inbound-call-flow-modal"
      kind="detail"
      open={open}
      title="Call Flow Detail"
      width={720}
      onCancel={onClose}
    >
      <div className="inbound-call-flow">
        {showIvrJourney ? (
          <section className="aicc-modal-section inbound-call-flow__section">
            <div className="aicc-modal-section__header inbound-call-flow__section-header">
              <span className="aicc-modal-section__title">IVR Journey</span>
            </div>
            <TimelineFlow
              className="inbound-call-flow__steps"
              items={callFlowDetail.ivrJourney.map((step) => ({
                id: step.id,
                meta: step.actionTime,
                title: step.nodeName,
              }))}
            />
          </section>
        ) : null}

        {accessMenuName ? (
          <section className="aicc-modal-section inbound-call-flow__section">
            <div className="aicc-modal-section__header inbound-call-flow__section-header">
              <span className="aicc-modal-section__title">
                {accessMenuLabel}
              </span>
            </div>
            <TimelineFlow
              className="inbound-call-flow__steps"
              items={[
                {
                  id: 'access-menu-single-level',
                  title: accessMenuName,
                },
              ]}
            />
          </section>
        ) : null}

        {shouldShowTransferHistory ? (
          <section className="aicc-modal-section inbound-call-flow__section">
            <div className="aicc-modal-section__header inbound-call-flow__section-header">
              <span className="aicc-modal-section__title">
                Transfer History
              </span>
              <strong className="aicc-modal-section__meta">
                {callFlowDetail.transferHistory.length} records
              </strong>
            </div>
            <div className="inbound-call-flow__transfers">
              <div className="inbound-call-flow__transfer-head">
                <span>Agent ID</span>
                <span>Agent Name</span>
                <span>Skill</span>
                <span>Service Duration</span>
                <span>Transfer Time</span>
              </div>
              {callFlowDetail.transferHistory.map((item) => (
                <div className="inbound-call-flow__transfer-row" key={item.id}>
                  <span>{item.agentId}</span>
                  <strong>{item.transferAgent}</strong>
                  <span>{item.agentSkill}</span>
                  <span>{item.serviceDuration}</span>
                  <span>{item.transferTime}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
        <footer className="aicc-modal-footer inbound-call-flow__footer">
          <BaseButton onClick={onClose}>Close</BaseButton>
        </footer>
      </div>
    </BaseModal>
  )
}
