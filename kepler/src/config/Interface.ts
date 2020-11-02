import { SamplingTypesEnum } from './Enum'

export interface samplingInfoInterface {
  statisticType: SamplingTypesEnum
  timeType?: string
  sampleInterval?: number
}
