import { commonLinkRuntimeMode } from '../config/commonLinkMode'
import { commonLinkApi, type CommonLinkService } from './commonLinkApi'
import { commonLinkDemoApi } from './commonLinkDemoApi'

export const commonLinkDataSource: CommonLinkService =
  commonLinkRuntimeMode === 'demo' ? commonLinkDemoApi : commonLinkApi
