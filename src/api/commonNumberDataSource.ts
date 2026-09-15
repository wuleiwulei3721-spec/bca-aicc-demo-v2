import { commonNumberRuntimeMode } from '../config/commonNumberMode'
import { commonNumberApi, type CommonNumberService } from './commonNumberApi'
import { commonNumberDemoApi } from './commonNumberDemoApi'

export const commonNumberDataSource: CommonNumberService =
  commonNumberRuntimeMode === 'demo' ? commonNumberDemoApi : commonNumberApi
