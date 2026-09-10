export function formatAgentDisplay(
  employeeId: string | undefined,
  name: string | undefined,
  separator = '-',
) {
  const numericId = employeeId?.replace(/\D/g, '') ?? ''
  const normalizedName = name?.trim() ?? ''

  if (numericId && normalizedName) {
    return `${numericId}${separator}${normalizedName}`
  }

  return normalizedName || numericId || 'Agent'
}
