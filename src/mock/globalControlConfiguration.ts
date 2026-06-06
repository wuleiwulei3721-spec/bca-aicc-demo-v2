import type { GlobalControlConfiguration } from '../types'

export const defaultGlobalControlConfiguration: GlobalControlConfiguration = {
  answerMode: 'auto',
  autoAnswerSeconds: 3,
  autoCancelAcwSeconds: 5,
  idleAutoSignOutMinutes: 30,
  idleWarningMinutes: 10,
  maxTextMediaServices: 3,
  signInDefaultStatus: 'ready',
}
