import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { headerAgentProfile } from '../mock/agent'
import { useAuthStore } from '../store'
import type {
  ExternalOperationApprovalScope,
  ExternalOperationApprovalStatus,
} from '../types'
import {
  consumeExternalOperationApproval,
  getExternalOperationApprovalsSnapshot,
  releaseExternalOperationApproval,
  requestExternalOperationApproval,
  subscribeExternalOperationApprovals,
} from '../utils/outboundApproval'

export type ExternalOperationApprovalState =
  | 'idle'
  | ExternalOperationApprovalStatus

export function useExternalOperationApproval(
  scope: ExternalOperationApprovalScope,
) {
  const session = useAuthStore((state) => state.session)
  const stableScope = useMemo(
    () => ({
      customerId: scope.customerId,
      targetNumber: scope.targetNumber,
      type: scope.type,
    }),
    [scope.customerId, scope.targetNumber, scope.type],
  )
  const approvals = useSyncExternalStore(
    subscribeExternalOperationApprovals,
    getExternalOperationApprovalsSnapshot,
    () => [],
  )
  const approval = useMemo(
    () =>
      approvals
        .filter(
          (item) =>
            item.type === stableScope.type &&
            item.targetNumber === stableScope.targetNumber &&
            item.customerId === stableScope.customerId,
        )
        .sort((left, right) => right.createdAt - left.createdAt)[0] ?? null,
    [
      approvals,
      stableScope.customerId,
      stableScope.targetNumber,
      stableScope.type,
    ],
  )
  const status: ExternalOperationApprovalState = approval?.status ?? 'idle'

  const request = useCallback(
    () =>
      requestExternalOperationApproval({
        ...stableScope,
        agentAvatarUrl: headerAgentProfile.avatarUrl,
        agentName: session?.displayName ?? headerAgentProfile.name,
      }),
    [session?.displayName, stableScope],
  )
  const release = useCallback(
    () => releaseExternalOperationApproval(stableScope),
    [stableScope],
  )
  const consume = useCallback(
    () => consumeExternalOperationApproval(stableScope),
    [stableScope],
  )

  return {
    approval,
    consume,
    isApproved: status === 'approved',
    isPending: status === 'pending',
    release,
    request,
    status,
  }
}
