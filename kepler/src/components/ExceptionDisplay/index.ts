import { DataTypeEnum } from '../../config/Enum'

const ExceptionDisplay = (props: any) => {
  switch (props.type) {
    case DataTypeEnum.BOOLEAN:
    case DataTypeEnum.ENUM:
      return props.alarmCodes
    case DataTypeEnum.INTEGER:
    case DataTypeEnum.FLOAT:
    case DataTypeEnum.DOUBLE:
      let string = ''
      if (props.alarmMin || props.alarmMin === 0) {
        string += `小于${props.alarmMin} `
      }
      if (props.alarmMax || props.alarmMax === 0) {
        string += `${string ? '或' : ''} 大于${props.alarmMax}`
      }
      return string
  }
}

export default ExceptionDisplay
