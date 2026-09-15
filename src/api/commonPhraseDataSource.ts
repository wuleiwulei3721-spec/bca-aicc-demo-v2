import { commonPhraseRuntimeMode } from '../config/commonPhraseMode'
import { commonPhraseDemoApi } from './commonPhraseDemoApi'
import {
  commonPhraseApi,
  type CommonPhraseService,
} from './commonPhraseApi'

export const commonPhraseDataSource: CommonPhraseService =
  commonPhraseRuntimeMode === 'demo' ? commonPhraseDemoApi : commonPhraseApi
