export type CommonLinkRuntimeMode = 'api' | 'demo'

const configuredMode = String(
  import.meta.env.VITE_COMMON_LINK_MODE ?? '',
).toLowerCase()

export const commonLinkRuntimeMode: CommonLinkRuntimeMode =
  configuredMode === 'api' || configuredMode === 'demo'
    ? configuredMode
    : import.meta.env.DEV
      ? 'api'
      : 'demo'

export const isCommonLinkDemoMode = commonLinkRuntimeMode === 'demo'
