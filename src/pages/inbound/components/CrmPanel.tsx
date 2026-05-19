import { EmbeddedPlaceholder } from './EmbeddedPlaceholder'

interface CrmPanelProps {
  activeCrmLink?: string
}

export function CrmPanel({ activeCrmLink }: CrmPanelProps) {
  return (
    <div className="inbound-center-panel">
      <EmbeddedPlaceholder label="Come from BCA CRM" title="CRM">
        {activeCrmLink && (
          <div className="inbound-crm-route">CRM Route: {activeCrmLink}</div>
        )}
      </EmbeddedPlaceholder>
    </div>
  )
}
