export type GlobalControlAnswerMode = 'auto' | 'manual'

export type GlobalControlSignInStatus = 'ready' | 'not-ready'

export interface GlobalControlConfiguration {
  answerMode: GlobalControlAnswerMode
  autoAnswerSeconds: number
  autoCancelAcwSeconds: number
  idleAutoSignOutMinutes: number
  idleWarningMinutes: number
  maxTextMediaServices: number
  defaultSkillQueueCode: string
  signInDefaultStatus: GlobalControlSignInStatus
}
