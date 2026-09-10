import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { OperationNotice } from '../components/OperationNotice'
import type { OperationNoticeTone } from '../components/OperationNotice'
import {
  OperationFeedbackContext,
} from './operationFeedbackContext'

const OPERATION_FEEDBACK_DURATION_MS = 4000

interface OperationFeedback {
  id: number
  message: string
  tone: OperationNoticeTone
}

export function OperationFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<OperationFeedback | null>(null)

  const notify = useCallback(
    (message: string, tone: OperationNoticeTone = 'success') => {
      setFeedback((current) => ({
        id: (current?.id ?? 0) + 1,
        message,
        tone,
      }))
    },
    [],
  )

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const feedbackId = feedback.id
    const timer = window.setTimeout(() => {
      setFeedback((current) =>
        current?.id === feedbackId ? null : current,
      )
    }, OPERATION_FEEDBACK_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [feedback])

  return (
    <OperationFeedbackContext.Provider value={{ notify }}>
      {children}
      <OperationNotice message={feedback?.message ?? null} tone={feedback?.tone ?? 'success'} />
    </OperationFeedbackContext.Provider>
  )
}
