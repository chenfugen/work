import { RuleObject } from 'antd/lib/form'

// 账号校验规则
export const accountRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持包含大小写字母、数字、下划线，不能以数字下划线开头，字符限制 6~30',
    pattern: /^[a-zA-Z][a-zA-Z0-9-]{5,30}$/
  }
]

// 手机校验规则
export const phoneRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '手机号只能包含数字、+、空格, 如带区号格式为 +区号 xxxxxx',
    pattern: /^(\+[0-9]{1,5}\s)?[0-9]{1,15}$/
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

// 密码校验规则
export const passwordRules: RuleObject[] = [
  {
    type: 'string',
    required: false,
    message: '密码长度 6~30',
    pattern: /^\w{6,30}$/
  }
]
