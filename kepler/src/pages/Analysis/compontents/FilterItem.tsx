import React, { useState, useEffect } from 'react'
import { Input, Select, Space } from 'antd'
import { DataTypeEnum, OperationEnum } from '../../../config/Enum'

const operation = (type: DataTypeEnum | string) => {
  switch (type) {
    case DataTypeEnum.FLOAT:
    case DataTypeEnum.INTEGER:
    case DataTypeEnum.DOUBLE:
      return [
        {
          label: '大于',
          value: OperationEnum.gt
        },
        {
          label: '小于',
          value: OperationEnum.lt
        },
        {
          label: '等于',
          value: OperationEnum.is
        }
      ]
    case DataTypeEnum.ENUM:
      return [
        {
          label: '是',
          value: OperationEnum.is
        },
        {
          label: '不是',
          value: OperationEnum.ne
        },
        {
          label: '包含',
          value: OperationEnum.include
        },
        {
          label: '不包含',
          value: OperationEnum.exclude
        }
      ]
    case DataTypeEnum.STRING:
      return [
        {
          label: '是',
          value: OperationEnum.is
        },
        {
          label: '不是',
          value: OperationEnum.ne
        }
      ]
    case DataTypeEnum.DATE:
      return [
        {
          label: '早于',
          value: OperationEnum.lt
        },
        {
          label: '晚于',
          value: OperationEnum.gt
        }
      ]
    case DataTypeEnum.BOOLEAN:
      return [
        {
          label: '等于',
          value: OperationEnum.is
        }
      ]
    default:
      return []
  }
}

const CanSelectProperty = [
  DataTypeEnum.ENUM,
  DataTypeEnum.INTEGER,
  DataTypeEnum.BOOLEAN,
  DataTypeEnum.FLOAT,
  DataTypeEnum.DOUBLE
]
interface Props {
  propertyList: any
  value?: any
  selectFilter: any
  onChange?: (value: any) => void
  setSelectFilter: (preVal: any, newVal: any) => void
}

const FilterItem: React.FC<Props> = ({
  propertyList = [],
  value = {},
  onChange,
  selectFilter = [],
  setSelectFilter
}) => {
  console.log(value)
  const [propertyCode, setPropertyCode] = useState<any>(value.propertyCode)
  const [operateFlag, setOperateFlag] = useState(value.operateFlag)
  const [propertyValue, setPropertyValue] = useState(value.propertyValue)
  const [propertyType, setPropertyType] = useState(value.propertyDataType)
  const [operationType, setOperationType] = useState<any>(operation(value.propertyDataType))
  const [valueSelectOption, setValueSelectOption] = useState<any>([])
  useEffect(() => {
    console.log(propertyType)
    setOperationType(operation(propertyType))
  }, [propertyType])
  useEffect(() => {
    if (propertyCode) {
      let selcetProperty = propertyList.filter((property: any) => {
        return property.param === propertyCode
      })[0]
      if (selcetProperty) {
        setPropertyType(selcetProperty.type)
        if (
          selcetProperty.type === DataTypeEnum.BOOLEAN ||
          selcetProperty.type === DataTypeEnum.ENUM
        ) {
          let option: any = []
          try {
            let obj = JSON.parse(selcetProperty.enumJson)
            let keys = Object.keys(obj)
            option = keys.map((key: string) => {
              return {
                label: obj[key],
                value: key
              }
            })
          } catch (e) {}
          setValueSelectOption(option)
        }
      }
    }
  }, [propertyCode, propertyList])
  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ propertyCode, propertyDataType: propertyType, ...value, ...changedValue })
    }
  }
  const onPropertyChange = (param: string) => {
    console.log(param)
    setSelectFilter(propertyCode, param)
    setPropertyCode(param)
    setOperateFlag('')
    setPropertyValue('')
    let selcetProperty = propertyList.filter((property: any) => {
      return property.param === param
    })[0]
    triggerChange({
      propertyCode: param,
      propertyDataType: selcetProperty.type,
      propertyValue: '',
      operateFlag: ''
    })
  }
  const onOperateFlagChange = (operation: OperationEnum) => {
    setOperateFlag(operation)
    triggerChange({ operateFlag: operation })
  }
  const onValChange = (e: any) => {
    const val = e.target.value
    setPropertyValue(val)
    triggerChange({ propertyValue: val })
  }
  const selectValChange = (val: any) => {
    setPropertyValue(val)
    triggerChange({ propertyValue: val })
  }
  return (
    <Space>
      <Select
        value={value.propertyCode || propertyCode}
        style={{ width: '170px' }}
        placeholder='选择属性'
        onChange={onPropertyChange}>
        {propertyList.map((property: any) => {
          return (
            <Select.Option
              disabled={
                CanSelectProperty.indexOf(property.type) === -1 ||
                selectFilter.indexOf(property.param) > -1
              }
              key={property.id}
              value={property.param}>
              {property.name}
              {property.unit ? `(${property.unit})` : ''}
            </Select.Option>
          )
        })}
      </Select>
      <Select
        onChange={onOperateFlagChange}
        value={value.operateFlag || operateFlag}
        options={operationType}
        style={{ width: '100px' }}
        placeholder='比较符'
      />
      {(propertyType === DataTypeEnum.DOUBLE ||
        propertyType === DataTypeEnum.FLOAT ||
        propertyType === DataTypeEnum.INTEGER) && (
        <Input value={value.propertyValue || propertyValue} onChange={onValChange} type='number' />
      )}
      {(propertyType === DataTypeEnum.ENUM || propertyType === DataTypeEnum.BOOLEAN) && (
        <Select
          onChange={selectValChange}
          value={value.propertyValue || propertyValue}
          options={valueSelectOption}
          style={{ width: '158px', marginRight: '8px' }}
          placeholder='请选择'
        />
      )}
    </Space>
  )
}

export default FilterItem
