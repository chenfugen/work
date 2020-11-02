import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import request from '../../request/request'

interface option {
  code: string
  name: string
}
const CommonSelect = (props: any) => {
  const [label, setLabel] = useState({ value: 'code', name: 'name' })
  const [options, setOptions] = useState(props.options || [])
  const [selectValue, setSelectValue] = useState<string | undefined>()
  useEffect(() => {
    if (props.query) {
      request.get(props.query).then((res) => {
        setOptions(res.data)
      })
    }
  }, [props.query])
  useEffect(() => {
    if (props.label) {
      setLabel(props.label)
    }
  }, [props.label])
  const handleChange = (value: string) => {
    setSelectValue(value)
    props.onChange(value)
  }
  return (
    <Select
      allowClear={true}
      onChange={handleChange}
      value={props.value || selectValue}
      style={{ width: props.width || '174px' }}
      placeholder={props.placeholder}>
      {options.map((option: any, i: number) => {
        return (
          <Select.Option key={i} value={option[label.value]}>
            {option[label.name]}
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default CommonSelect
