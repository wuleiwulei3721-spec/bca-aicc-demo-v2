export type InteractionSlaState = 'normal' | 'warning' | 'breach'

export const LIVE_CHAT_SLA_WARNING_SECONDS = 60
export const LIVE_CHAT_SLA_BREACH_SECONDS = 120

export function parseDurationSeconds(duration: string) {
  const parts = duration
    .split(':')
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => Number.isFinite(part))

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }

  return 0
}

export function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const remainingSeconds = safeSeconds % 60
  const segments =
    hours > 0 ? [hours, minutes, remainingSeconds] : [minutes, remainingSeconds]

  return segments.map((segment) => String(segment).padStart(2, '0')).join(':')
}

export function getElapsedSeconds(startedAt: number, now = Date.now()) {
  return Math.max(0, Math.floor((now - startedAt) / 1000))
}

export function getLiveChatSlaState(
  elapsedSeconds: number,
): InteractionSlaState {
  if (elapsedSeconds >= LIVE_CHAT_SLA_BREACH_SECONDS) {
    return 'breach'
  }

  if (elapsedSeconds >= LIVE_CHAT_SLA_WARNING_SECONDS) {
    return 'warning'
  }

  return 'normal'
}
