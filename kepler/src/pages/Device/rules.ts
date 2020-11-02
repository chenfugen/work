import { RuleObject, Rule } from 'antd/lib/form'
import { FormInstance } from 'rc-field-form'

//  设备唯一码 校验规则
export const deviceCodeRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持大小写字母、数字和下划线、长度限制 1~30。',
    pattern: /^[0-9a-zA-Z_]{1,30}$/
  }
]

// 手机校验规则
export const phoneRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '手机号只能包含数字、+、空格, 如带区号格式为 +区号 xxxxxx',
    pattern: /^(\+[0-9]{1,5}\s)?[0-9]{1,15}/
  }
]

// 邮箱校验规则
export const emailRules: RuleObject[] = [
  {
    type: 'email',
    required: false,
    message: '请输入正确的邮箱'
  }
]
//  string字节数 校验规则
export const stepRules: Rule[] = [
  {
    transform: (val: any) => Number(val),
    type: 'number',
    required: true,
    message: '请输入步长'
  },
  (form: FormInstance): RuleObject => {
    return {
      validator: (rule, val: any) => {
        console.log(val)
        if (val <= 0 && val) {
          return Promise.reject('步长大于0')
        }
        return Promise.resolve()
      }
    }
  }
]
