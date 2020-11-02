import { RuleObject, Rule } from 'antd/lib/form'
import { FormInstance } from 'rc-field-form'

//  string字节数 校验规则
export const timeRules: Rule[] = [
  {
    transform: (val: any) => Number(val),
    type: 'number',
    required: true,
    message: '请输入间隔时间'
  },
  (form: FormInstance): RuleObject => {
    return {
      validator: (rule, val: any) => {
        if (val <= 0 && val) {
          return Promise.reject('间隔时间大于0')
        }
        return Promise.resolve()
      }
    }
  }
]

// 过滤 校验规则
export const filterRules: Rule[] = [
  {
    required: true,
    message: '请完善过滤条件'
  },
  (form: FormInstance): RuleObject => {
    return {
      validator(_, value: any) {
        if (!value) return Promise.reject('请完善过滤条件')
        for (let key in value) {
          if (!value[key] && value[key] !== 0) {
            return Promise.reject('请完善过滤条件')
          }
        }
        return Promise.resolve()
      }
    }
  }
]
