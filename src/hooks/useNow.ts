import { useEffect, useState } from 'react'

export function useNow(enabled = true, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const refreshId = window.setTimeout(() => {
      setNow(Date.now())
    }, 0)
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, intervalMs)

    return () => {
      window.clearTimeout(refreshId)
      window.clearInterval(intervalId)
    }
  }, [enabled, intervalMs])

  return now
}
