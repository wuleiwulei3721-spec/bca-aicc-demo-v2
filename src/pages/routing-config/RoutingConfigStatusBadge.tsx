import { StatusBadge, type StatusBadgeStatus } from '../../components'
import type { RoutingConfigStatus } from '../../types'

interface RoutingConfigStatusBadgeProps {
  status: RoutingConfigStatus
}

function statusToBadgeStatus(status: RoutingConfigStatus): StatusBadgeStatus {
  if (status === 'Active') {
    return 'success'
  }

  if (status === 'Disabled') {
    return 'disabled'
  }

  if (status === 'Replaced') {
    return 'neutral'
  }

  return 'warning'
}

function statusToLabel(status: RoutingConfigStatus) {
  if (status === 'Active') {
    return 'Enabled'
  }

  return status
}

export function RoutingConfigStatusBadge({
  status,
}: RoutingConfigStatusBadgeProps) {
  return (
    <StatusBadge
      dot
      label={statusToLabel(status)}
      size="small"
      status={statusToBadgeStatus(status)}
    />
  )
}
