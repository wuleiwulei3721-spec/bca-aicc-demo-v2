import type {
  ExternalOperationApproval,
  ExternalOperationApprovalEvent,
  ExternalOperationApprovalEventKind,
  ExternalOperationApprovalScope,
} from '../types'

const storageKey = 'bank1-aicc-external-operation-approvals'
const broadcastChannelName = 'bank1-aicc-external-operation-approvals'
const retentionMs = 30 * 60 * 1000
export const externalOperationApprovalTimeoutMs = 10 * 1000
const tabId = `approval-tab-${Math.random().toString(36).slice(2, 10)}`

type ApprovalListener = () => void
type ApprovalEventListener = (event: ExternalOperationApprovalEvent) => void

let approvals = readApprovals()
let broadcastChannel: BroadcastChannel | null = null
const approvalTimeouts = new Map<string, number>()
const listeners = new Set<ApprovalListener>()
const eventListeners = new Set<ApprovalEventListener>()

function readApprovals() {
  if (typeof window === 'undefined') {
    return [] as ExternalOperationApproval[]
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey)

    if (!rawValue) {
      return [] as ExternalOperationApproval[]
    }

    const parsed = JSON.parse(rawValue) as unknown

    return Array.isArray(parsed)
      ? parsed.filter(isExternalOperationApproval)
      : ([] as ExternalOperationApproval[])
  } catch {
    return [] as ExternalOperationApproval[]
  }
}

function isExternalOperationApproval(
  value: unknown,
): value is ExternalOperationApproval {
  if (!value || typeof value !== 'object') {
    return false
  }

  const approval = value as Partial<ExternalOperationApproval>

  return (
    typeof approval.id === 'string' &&
    typeof approval.type === 'string' &&
    typeof approval.targetNumber === 'string' &&
    typeof approval.status === 'string' &&
    typeof approval.createdAt === 'number' &&
    typeof approval.updatedAt === 'number'
  )
}

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function notifyEventListeners(event: ExternalOperationApprovalEvent) {
  eventListeners.forEach((listener) => listener(event))
}

function persistApprovals() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(approvals))
}

function getBroadcastChannel() {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
    return null
  }

  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(broadcastChannelName)
    broadcastChannel.onmessage = (message: MessageEvent<unknown>) => {
      const data = message.data as {
        event?: ExternalOperationApprovalEvent
        senderId?: string
      }

      if (!data || data.senderId === tabId || !data.event) {
        return
      }

      reloadApprovals(data.event)
    }
  }

  return broadcastChannel
}

function publishEvent(event: ExternalOperationApprovalEvent) {
  notifyEventListeners(event)
  getBroadcastChannel()?.postMessage({ event, senderId: tabId })
}

function reloadApprovals(event?: ExternalOperationApprovalEvent) {
  approvals = readApprovals()
  schedulePendingApprovalTimeouts()
  notifyListeners()

  if (event) {
    notifyEventListeners(event)
  }
}

function setApprovals(
  nextApprovals: ExternalOperationApproval[],
  event?: ExternalOperationApprovalEvent,
) {
  approvals = nextApprovals.filter(
    (approval) =>
      approval.status === 'pending' ||
      approval.updatedAt >= Date.now() - retentionMs,
  )
  persistApprovals()
  notifyListeners()

  if (event) {
    publishEvent(event)
  }

  schedulePendingApprovalTimeouts()
}

function scopeMatches(
  approval: ExternalOperationApproval,
  scope: ExternalOperationApprovalScope,
) {
  if (!scope.outboundReason) {
    return false
  }

  return (
    approval.type === scope.type &&
    approval.targetNumber === scope.targetNumber &&
    approval.customerId === scope.customerId &&
    approval.outboundReason === scope.outboundReason
  )
}

function resolveApproval(
  id: string,
  status: Extract<
    ExternalOperationApproval['status'],
    'approved' | 'cancelled' | 'consumed' | 'rejected' | 'timed-out'
  >,
  reviewNote?: string,
) {
  const current = approvals.find((approval) => approval.id === id)

  if (!current || (current.status !== 'pending' && status !== 'consumed')) {
    return current ?? null
  }

  if (status === 'consumed' && current.status !== 'approved') {
    return current
  }

  const now = Date.now()
  const nextApproval: ExternalOperationApproval = {
    ...current,
    reviewNote:
      status === 'approved' || status === 'rejected'
        ? reviewNote?.trim() || undefined
        : undefined,
    resolvedAt: now,
    status,
    updatedAt: now,
  }
  const kind = status as ExternalOperationApprovalEventKind
  const nextApprovals = approvals
    .filter(
      (approval) =>
        status !== 'approved' ||
        approval.id === id ||
        approval.agentEmployeeId !== nextApproval.agentEmployeeId ||
        approval.status !== 'approved',
    )
    .map((approval) =>
      approval.id === id ? nextApproval : approval,
    )

  setApprovals(nextApprovals, { approval: nextApproval, kind })

  return nextApproval
}

function schedulePendingApprovalTimeouts() {
  if (typeof window === 'undefined') {
    return
  }

  const pendingApprovalIds = new Set(
    approvals
      .filter((approval) => approval.status === 'pending')
      .map((approval) => approval.id),
  )

  approvalTimeouts.forEach((timer, approvalId) => {
    if (!pendingApprovalIds.has(approvalId)) {
      window.clearTimeout(timer)
      approvalTimeouts.delete(approvalId)
    }
  })

  approvals
    .filter((approval) => approval.status === 'pending')
    .forEach((approval) => {
      if (approvalTimeouts.has(approval.id)) {
        return
      }

      const remainingMs =
        approval.createdAt + externalOperationApprovalTimeoutMs - Date.now()

      if (remainingMs <= 0) {
        resolveApproval(approval.id, 'timed-out')
        return
      }

      const timer = window.setTimeout(() => {
        approvalTimeouts.delete(approval.id)
        resolveApproval(approval.id, 'timed-out')
      }, remainingMs)
      approvalTimeouts.set(approval.id, timer)
    })
}

function createApprovalId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `outbound-approval-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function subscribeExternalOperationApprovals(listener: ApprovalListener) {
  getBroadcastChannel()
  listeners.add(listener)
  schedulePendingApprovalTimeouts()

  return () => listeners.delete(listener)
}

export function subscribeExternalOperationApprovalEvents(
  listener: ApprovalEventListener,
) {
  getBroadcastChannel()
  eventListeners.add(listener)

  return () => eventListeners.delete(listener)
}

export function getExternalOperationApprovalsSnapshot() {
  return approvals
}

export function getExternalOperationApproval(id: string) {
  return approvals.find((approval) => approval.id === id) ?? null
}

export function getExternalOperationApprovalForScope(
  scope: ExternalOperationApprovalScope,
) {
  return (
    approvals
      .filter((approval) => scopeMatches(approval, scope))
      .sort((left, right) => right.createdAt - left.createdAt)[0] ?? null
  )
}

export function requestExternalOperationApproval(
  input: ExternalOperationApprovalScope & {
    agentEmployeeId: string
    agentName: string
  },
) {
  const now = Date.now()
  const approval: ExternalOperationApproval = {
    ...input,
    createdAt: now,
    id: createApprovalId(),
    status: 'pending',
    updatedAt: now,
  }

  setApprovals([...approvals, approval], { approval, kind: 'created' })

  const popup = window.open(
    `/tl-outbound-approval?requestId=${encodeURIComponent(approval.id)}`,
    'bank1-tl-approval',
    'popup=yes,width=1440,height=810,resizable=yes,scrollbars=no',
  )

  if (!popup) {
    resolveApproval(approval.id, 'cancelled')
    return { approval, popupBlocked: true }
  }

  popup.focus()
  return { approval, popupBlocked: false }
}

export function approveExternalOperationApproval(id: string, note?: string) {
  return resolveApproval(id, 'approved', note)
}

export function rejectExternalOperationApproval(id: string, note?: string) {
  return resolveApproval(id, 'rejected', note)
}

export function releaseExternalOperationApproval(
  scope: ExternalOperationApprovalScope,
) {
  const approval = getExternalOperationApprovalForScope(scope)

  if (!approval || !['pending', 'approved'].includes(approval.status)) {
    return approval
  }

  return resolveApproval(approval.id, 'cancelled')
}

export function consumeExternalOperationApproval(
  scope: ExternalOperationApprovalScope,
) {
  const approval = getExternalOperationApprovalForScope(scope)

  if (!approval || approval.status !== 'approved') {
    return approval
  }

  return resolveApproval(approval.id, 'consumed')
}

export function clearExternalOperationApprovals() {
  approvals
    .filter((approval) =>
      approval.status === 'pending' || approval.status === 'approved',
    )
    .forEach((approval) => resolveApproval(approval.id, 'cancelled'))
}

export function releaseExternalOperationApprovals() {
  approvals
    .filter(
      (approval) =>
        ['pending', 'approved'].includes(approval.status),
    )
    .forEach((approval) => resolveApproval(approval.id, 'cancelled'))
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) {
      reloadApprovals()
    }
  })
}
