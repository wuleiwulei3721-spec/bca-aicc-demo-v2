import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
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
      outboundReason: scope.outboundReason,
      targetNumber: scope.targetNumber,
      type: scope.type,
    }),
    [
      scope.customerId,
      scope.outboundReason,
      scope.targetNumber,
      scope.type,
    ],
  )
  const previousScopeRef = useRef(stableScope)

  useEffect(() => {
    const previousScope = previousScopeRef.current
    const scopeChanged =
      previousScope.customerId !== stableScope.customerId ||
      previousScope.outboundReason !== stableScope.outboundReason ||
      previousScope.targetNumber !== stableScope.targetNumber ||
      previousScope.type !== stableScope.type

    if (scopeChanged) {
      releaseExternalOperationApproval(previousScope)
      previousScopeRef.current = stableScope
    }
  }, [stableScope])
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
            Boolean(stableScope.outboundReason) &&
            item.type === stableScope.type &&
            item.targetNumber === stableScope.targetNumber &&
            item.customerId === stableScope.customerId &&
            item.outboundReason === stableScope.outboundReason,
        )
        .sort((left, right) => right.createdAt - left.createdAt)[0] ?? null,
    [
      approvals,
      stableScope.customerId,
      stableScope.outboundReason,
      stableScope.targetNumber,
      stableScope.type,
    ],
  )
  const status: ExternalOperationApprovalState = approval?.status ?? 'idle'

  const request = useCallback(
    () =>
      requestExternalOperationApproval({
        ...stableScope,
        agentEmployeeId: session?.employeeId ?? '10027',
        agentName: session?.displayName ?? headerAgentProfile.name,
      }),
    [session?.displayName, session?.employeeId, stableScope],
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
    request,
    status,
  }
}
