export type GlobalControlAnswerMode = 'auto' | 'manual'

export type GlobalControlSignInStatus = 'ready' | 'not-ready'

export type GlobalControlIdleLogoutMinutes =
  | 15
  | 30
  | 45
  | 60
  | 75
  | 90
  | 105
  | 120
  | 135
  | 150
  | 165
  | 180
  | 195
  | 210
  | 225
  | 240

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
