export type CommonNumberRuntimeMode = 'api' | 'demo'

const configuredMode = String(
  import.meta.env.VITE_COMMON_NUMBER_MODE ?? '',
).toLowerCase()

export const commonNumberRuntimeMode: CommonNumberRuntimeMode =
  configuredMode === 'api' || configuredMode === 'demo'
    ? configuredMode
    : import.meta.env.DEV
      ? 'api'
      : 'demo'

export const isCommonNumberDemoMode = commonNumberRuntimeMode === 'demo'
