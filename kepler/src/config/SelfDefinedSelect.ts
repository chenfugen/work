import { SamplingTypesEnum } from './Enum'
export const ConditionOptions = [
  {
    value: 'AND',
    label: '与'
  },
  {
    value: 'OR',
    label: '或'
  }
]

export const SamplingTypes = [
  {
    code: SamplingTypesEnum.RAW,
    name: '原始数据'
  },
  {
    code: SamplingTypesEnum.ANY,
    name: '随机值'
  },
  {
    code: SamplingTypesEnum.MIN,
    name: '最小值'
  },
  {
    code: SamplingTypesEnum.MAX,
    name: '最大值'
  },
  {
    code: SamplingTypesEnum.AVG,
    name: '平均值'
  }
]

export const timeTypes = [
  {
    code: 's',
    name: '秒'
  },
  {
    code: 'm',
    name: '分钟'
  }
]
