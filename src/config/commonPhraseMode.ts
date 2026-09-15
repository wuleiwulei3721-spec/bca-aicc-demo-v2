export type CommonPhraseRuntimeMode = 'api' | 'demo'

const configuredMode = String(
  import.meta.env.VITE_COMMON_PHRASE_MODE ?? '',
).toLowerCase()

export const commonPhraseRuntimeMode: CommonPhraseRuntimeMode =
  configuredMode === 'api' || configuredMode === 'demo'
    ? configuredMode
    : import.meta.env.DEV
      ? 'api'
      : 'demo'

export const isCommonPhraseDemoMode = commonPhraseRuntimeMode === 'demo'
