export type GlobalControlAnswerMode = 'auto' | 'manual'

export type GlobalControlSignInStatus = 'ready' | 'not-ready'

export type GlobalControlIdleLogoutMinutes = 30 | 60 | 120

export interface GlobalControlConfiguration {
  answerMode: GlobalControlAnswerMode
  autoAnswerSeconds: number
  autoCancelAcwSeconds: number
  idleAutoLogOutMinutes: GlobalControlIdleLogoutMinutes
  idleWarningMinutes: number
  maxDigitalMediaServices: number
  maxLiveChatEndedSessionRetention: number
  signInDefaultStatus: GlobalControlSignInStatus
}
