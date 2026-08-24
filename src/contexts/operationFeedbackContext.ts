import { createContext, useContext } from 'react'
import type { OperationNoticeTone } from '../components/OperationNotice'

export interface OperationFeedbackContextValue {
  notify: (message: string, tone?: OperationNoticeTone) => void
}

export const OperationFeedbackContext =
  createContext<OperationFeedbackContextValue | null>(null)

export function useOperationFeedback() {
  const context = useContext(OperationFeedbackContext)

  if (!context) {
    throw new Error('useOperationFeedback must be used within OperationFeedbackProvider.')
  }

  return context
}
