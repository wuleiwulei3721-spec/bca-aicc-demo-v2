import type { GlobalControlConfiguration } from '../types'

export const defaultGlobalControlConfiguration: GlobalControlConfiguration = {
  answerMode: 'auto',
  autoAnswerSeconds: 3,
  autoCancelAcwSeconds: 10,
  idleAutoLogOutMinutes: 30,
  idleWarningMinutes: 10,
  maxTextMediaServices: 3,
  defaultSkillQueueCode: 'SQ_GENERAL_ID',
  signInDefaultStatus: 'not-ready',
}
