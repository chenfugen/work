import React from 'react'
import { DataTypeEnum } from '../../config/Enum'
import styles from './index.module.css'

const Range = (min: string, max: string) => {
  return `取值范围: ${min}~${max}`
}
const Byte = (step: string) => {
  return `数据长度: ${step} 字节`
}

const Enum = (props: any) => {
  let keys: Array<string> = []
  let enumObj: any = {}
  try {
    enumObj = JSON.parse(props.enum)
    keys = Object.keys(enumObj)
  } catch (e) {
    console.log(e)
  }
  return (
    <>
      <span className={styles.enum}>{props.title}</span>
      {keys.map((key: string) => {
        return (
          <div className={styles.container} key={key}>
            <span className={styles.item}>
              {key} - {enumObj[key]}
            </span>
          </div>
        )
      })}
    </>
  )
}

const DataDefinition = (props: any) => {
  switch (props.type) {
    case DataTypeEnum.INTEGER:
    case DataTypeEnum.FLOAT:
    case DataTypeEnum.DOUBLE:
      return (
        <>
          <span>{Range(props.min, props.max)}</span>
          <br></br>
          <span>单位: {props.unit || '--'}</span>
        </>
      )
    case DataTypeEnum.STRING:
      return Byte(props.step)
    case DataTypeEnum.BOOLEAN:
      return <Enum title='布尔值:' enum={props.enumJson} />
    case DataTypeEnum.ENUM:
      return <Enum title='枚举值:' enum={props.enumJson} />
    default:
      return '-'
  }
}

export default DataDefinition
