import { useCallback, useEffect, useRef, useState } from 'react'

interface UseIdleLogoutOptions {
  enabled: boolean
  onExpire: () => void
  timeoutMinutes: number
  warningLeadMinutes: number
}

export function useIdleLogout({
  enabled,
  onExpire,
  timeoutMinutes,
  warningLeadMinutes,
}: UseIdleLogoutOptions) {
  const [warningOpen, setWarningOpen] = useState(false)
  const expireTimerRef = useRef<number | null>(null)
  const warningTimerRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current !== null) {
      window.clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }

    if (expireTimerRef.current !== null) {
      window.clearTimeout(expireTimerRef.current)
      expireTimerRef.current = null
    }
  }, [])

  const scheduleIdleTimer = useCallback(() => {
    clearTimers()

    if (!enabled) {
      return
    }

    const timeoutMs = Math.max(1, timeoutMinutes) * 60 * 1000
    const warningLeadMs = Math.max(0, warningLeadMinutes) * 60 * 1000
    const warningDelayMs = Math.max(0, timeoutMs - warningLeadMs)

    warningTimerRef.current = window.setTimeout(() => {
      setWarningOpen(true)
    }, warningDelayMs)
    expireTimerRef.current = window.setTimeout(() => {
      setWarningOpen(false)
      onExpire()
    }, timeoutMs)
  }, [clearTimers, enabled, onExpire, timeoutMinutes, warningLeadMinutes])

  const resetIdleTimer = useCallback(() => {
    setWarningOpen(false)
    scheduleIdleTimer()
  }, [scheduleIdleTimer])

  useEffect(() => {
    clearTimers()

    if (!enabled) {
      return clearTimers
    }

    const startTimer = window.setTimeout(() => {
      resetIdleTimer()
    }, 0)

    const activityEvents: Array<keyof WindowEventMap> = [
      'focus',
      'keydown',
      'pointerdown',
      'pointermove',
      'scroll',
      'touchstart',
    ]

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true })
    })

    return () => {
      window.clearTimeout(startTimer)
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer)
      })
      clearTimers()
    }
  }, [clearTimers, enabled, resetIdleTimer])

  return {
    dismissWarning: resetIdleTimer,
    warningOpen,
  }
}
