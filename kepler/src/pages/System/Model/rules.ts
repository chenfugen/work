import { RuleObject, Rule } from 'antd/lib/form'
import { FormInstance } from 'rc-field-form'
import { DataTypeEnum } from '../../../config/Enum'
//  系列名称 校验规则
export const serieNameRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持中文、英文字母、数字和特殊字符_-@()，长度限制 2~30。',
    pattern: /^[a-zA-Z0-9-_@()\u4e00-\u9fff]{2,30}$/
  }
]

//  系列编码 校验规则
export const serieCodeRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持大小写字母、数字和下划线、长度限制 4~50。',
    pattern: /^[a-zA-Z0-9-]{4,50}$/
  }
]

//  型号编码 校验规则
export const modelCodeRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持大小写字母、数字和下划线，不能以数字开头，长度限制 4~30。',
    pattern: /^[a-zA-Z_][0-9a-zA-Z_]{3,30}$/
  }
]

//  型号名称 校验规则
export const modelNameRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持中文、英文字母、数字和特殊字符_-@()，长度限制 3~30。',
    pattern: /^[a-zA-Z0-9-_@()\u4e00-\u9fff]{3,30}$/
  }
]

//  属性名称 校验规则
export const paramNameRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message:
      '支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文开头，不超过 30 个字符。',
    pattern: /^[a-zA-Z\u4e00-\u9fff][a-zA-Z0-9\u4e00-\u9fff-_.]{0,29}$/
  }
]

//  属性标识符 校验规则
export const paramCodeRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持大小写字母、数字和下划线，必须以英文开头，不超过 50 个字符。',
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{1,49}$/
  }
]

//  指令编码 校验规则
export const commandRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message: '支持大小写字母、数字和下划线，不超过 50 个字符。',
    pattern: /^[a-zA-Z0-9_]{0,50}$/
  }
]

//  指令名称 校验规则
export const commandNameRules: RuleObject[] = [
  {
    type: 'string',
    required: true,
    message:
      '支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过 30 个字符。',
    pattern: /^[a-zA-Z0-9\u4e00-\u9fff][a-zA-Z0-9\u4e00-\u9fff-_.]{0,29}$/
  }
]

//  string字节数 校验规则
export const stepRules: Rule[] = [
  {
    required: true,
    message: '请输入字节数'
  },
  {
    type: 'string',
    pattern: /^[0-9]+$/,
    required: true,
    message: '字节数为整数型'
  },
  (form: FormInstance): RuleObject => {
    return {
      validator: (rule, val: any) => {
        console.log(val)
        if (val <= 0 && val) {
          return Promise.reject('字节长度 1 ~ 1024')
        }
        if (val > 1024) {
          return Promise.reject('字节长度 1 ~ 1024')
        }
        return Promise.resolve()
      }
    }
  }
]

const int32Validator = (rule: Rule, val: any) => {
  let minBorder = -2147483648
  let maxBorder = 2147483647
  if (val < minBorder || val > maxBorder) {
    return Promise.reject(`取值范围：${minBorder} ~ ${maxBorder}`)
  } else {
    return Promise.resolve()
  }
}
const floatValidator = (rule: Rule, val: any) => {
  return Promise.resolve()
}
const doubleValidator = (rule: Rule, val: any) => {
  return Promise.resolve()
}

//  最小值 校验规则
export const minRules: Rule[] = [
  {
    transform: (val: any) => Number(val),
    type: 'number',
    required: true,
    message: '请输入最小值'
  },
  (form: FormInstance): RuleObject => {
    let type = form.getFieldValue('type')
    switch (type) {
      case DataTypeEnum.INTEGER:
        return { validator: int32Validator }
      case DataTypeEnum.FLOAT:
        return { validator: floatValidator }
      case DataTypeEnum.DOUBLE:
        return { validator: doubleValidator }
      default:
        return { validator: doubleValidator }
    }
  }
]

//  最大值 校验规则
export const maxRules: Rule[] = [
  {
    transform: (val: any) => Number(val),
    type: 'number',
    required: true,
    message: '请输入最大值'
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
