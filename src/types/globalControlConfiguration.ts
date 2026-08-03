export type GlobalControlAnswerMode = 'auto' | 'manual'

export type GlobalControlSignInStatus = 'ready' | 'not-ready'

export interface GlobalControlConfiguration {
  answerMode: GlobalControlAnswerMode
  autoAnswerSeconds: number
  autoCancelAcwSeconds: number
  idleAutoLogOutMinutes: number
  idleWarningMinutes: number
  maxDigitalMediaServices: number
  maxLiveChatEndedSessionRetention: number
  defaultSkillQueueCode: string
  signInDefaultStatus: GlobalControlSignInStatus
}
