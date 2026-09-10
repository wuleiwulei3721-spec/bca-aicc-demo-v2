export const DEFAULT_AUDIT_ACTOR = '1234-Admin'

export function formatAuditActor(
  employeeId?: string,
  displayName?: string,
) {
  const normalizedEmployeeId = employeeId?.trim()
  const normalizedDisplayName = displayName?.trim()

  if (normalizedEmployeeId && normalizedDisplayName) {
    return `${normalizedEmployeeId}-${normalizedDisplayName}`
  }

  return normalizedDisplayName || normalizedEmployeeId || DEFAULT_AUDIT_ACTOR
}

export function formatAuditDateTime(value: Date | string) {
  const date = value instanceof Date ? value : parseAuditDateTime(value)

  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '-'
  }

  const pad = (part: number) => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`
}

export function formatCallManagementDateTime(value: Date | string) {
  const date = value instanceof Date ? value : parseAuditDateTime(value)

  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '-'
  }

  const pad = (part: number) => String(part).padStart(2, '0')

  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function parseAuditDateTime(value: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return new Date(Number.NaN)
  }

  const localDateTimeMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(
    normalizedValue,
  )

  if (localDateTimeMatch) {
    const [, year, month, day, hour = '00', minute = '00', second = '00'] =
      localDateTimeMatch

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )
  }

  const dayFirstDateTimeMatch = /^(\d{2})-(\d{2})-(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(
    normalizedValue,
  )

  if (dayFirstDateTimeMatch) {
    const [, day, month, year, hour = '00', minute = '00', second = '00'] =
      dayFirstDateTimeMatch

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    )
  }

  return new Date(normalizedValue)
}
