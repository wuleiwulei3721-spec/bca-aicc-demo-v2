import { BaseModal, TimelineFlow } from '../../../components'
import { callFlowDetail } from '../../../mock/inbound'

interface CallFlowDetailModalProps {
  open: boolean
  onClose: () => void
}

export function CallFlowDetailModal({
  open,
  onClose,
}: CallFlowDetailModalProps) {
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
        <section className="inbound-call-flow__section">
          <div className="inbound-call-flow__section-header">
            <span>IVR Journey</span>
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

        {callFlowDetail.transferHistory.length > 0 ? (
          <section className="inbound-call-flow__section inbound-call-flow__section--separated">
            <div className="inbound-call-flow__section-header">
              <span>Transfer History</span>
              <strong>{callFlowDetail.transferHistory.length} records</strong>
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
      </div>
    </BaseModal>
  )
}
