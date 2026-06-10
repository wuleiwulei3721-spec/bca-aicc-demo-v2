import type { AgentStatus } from '../types'

const AUX_PREFIX = 'AUX - '
const PRE_AUX_PREFIX = 'Pre-AUX - '

export function isAuxStatus(status: AgentStatus) {
  return status.startsWith(AUX_PREFIX)
}

export function isPreAuxStatus(status: AgentStatus) {
  return status.startsWith(PRE_AUX_PREFIX)
}

export function isAuxLikeStatus(status: AgentStatus) {
  return isAuxStatus(status) || isPreAuxStatus(status)
}

export function getAuxReason(status: AgentStatus) {
  if (isPreAuxStatus(status)) {
    return status.slice(PRE_AUX_PREFIX.length)
  }

  if (isAuxStatus(status)) {
    return status.slice(AUX_PREFIX.length)
  }

  return ''
}

export function createAuxStatus(reason: string): AgentStatus {
  return `${AUX_PREFIX}${reason}` as AgentStatus
}

export function createPreAuxStatus(reason: string): AgentStatus {
  return `${PRE_AUX_PREFIX}${reason}` as AgentStatus
}
