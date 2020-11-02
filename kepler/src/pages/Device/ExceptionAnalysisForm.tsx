import React, { useState, useEffect } from 'react'
import Filter from '../Analysis/compontents/Filter'
import { Form, Button, Select, DatePicker } from 'antd'
import style from '../Analysis/compontents/css/AnalysisForm.module.css'
import request from '../../request/request'
import api from '../../api'
import classnames from 'classnames'
import exceptionStyle from './exceptionStyle.module.css'
import moment from 'moment'
import { DataTypeEnum } from '../../config/Enum'
const { RangePicker } = DatePicker

const DisabledProperty = [DataTypeEnum.STRING, DataTypeEnum.DATE]

const BoldSpan = (props: any) => <span style={{ fontWeight: 'bold' }}>{props.label}</span>

// 组件 AnalysisForm
const ExceptionAnalysisForm = (props: any) => {
  let [form] = Form.useForm()
  const [propertyOptions, setPropertyOptions] = useState([])
  const [filterCondition, setFilterCondition] = useState({})
  const [selectProperty, setSelectProperty] = useState('')
  const [rawProperty, setRawProperty] = useState('')
  useEffect(() => {
    if (props.startTime && form) {
      form.setFieldsValue({
        time: [moment(props.startTime).add(-10, 'm'), moment(props.startTime).add(10, 'm')]
      })
    }
  }, [props.startTime, form])
  const queryPropertyOptions = () => {
    if (!props.modelCode) {
      setPropertyOptions([])
    } else {
      let params = {
        modelCode: props.modelCode,
        deviceCode: props.deviceCode,
        times: [
          moment(props.startTime).add(-10, 'm').format('YYYY-MM-DD HH:mm:ss'),
          moment(props.startTime).add(10, 'm').format('YYYY-MM-DD HH:mm:ss')
        ]
      }
      request.get(api.common.select_property_exception, params).then((res) => {
        const filteredOptions = res.data.filter((option: any) => option.code !== props.propertyCode)
        setPropertyOptions(filteredOptions)
        setRawProperty(res.data)
        analysis('time', res.data)
      })
    }
  }
  const onValuesChange = (oldValues: any, values: any) => {
    console.log(oldValues, values)
  }
  const handleFilterCondition = (value: any) => {
    setFilterCondition(value)
  }
  const analysis = (type: string, parentRawProperty?: any) => {
    form.validateFields().then((res) => {
      if (res) {
        let property = form.getFieldValue('property')
        let time = form.getFieldValue('time')
        let params: any = {
          model: props.modelCode,
          deviceCode: props.deviceCode,
          propertyList: [props.propertyCode, property].filter(Boolean),
          startTime: time[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: time[1].format('YYYY-MM-DD HH:mm:ss'),
          ...filterCondition
        }
        let selectParams
        let arr1 = (parentRawProperty || rawProperty).filter((el: any) => {
          return el.code === props.propertyCode
        })
        let arr2 = (parentRawProperty || rawProperty).filter((el: any) => {
          return el.code === selectProperty
        })
        selectParams = [...arr1, ...arr2]
        props.setSelectProperty && props.setSelectProperty(selectParams)
        console.log(parentRawProperty, selectParams, props.propertyCode, selectProperty)
        props.search(params, type, selectParams)
      }
    })
  }
  // 开始时间和结束时间一样的话结束时间+1分钟
  const handleRangeChange = (dates: any) => {
    if (dates) {
      if (dates[0].isSame(dates[1])) {
        console.log(dates[0], dates[1])
        let start = moment(dates[0])
        let end = moment(dates[1]).add(1, 'minutes')
        form.setFieldsValue({
          time: [start, end]
        })
      }
    }
    props.timeChange(true)
  }
  useEffect(queryPropertyOptions, [props.modelId, props.deviceCode])
  return (
    <div className={classnames([style.analysis, exceptionStyle.border])}>
      <h3 className={style.title}>数据分析设置</h3>
      <Form layout='vertical' form={form} onValuesChange={onValuesChange}>
        <Form.Item noStyle>
          <div style={{ marginBottom: '16px' }}>
            <span className={exceptionStyle.label}>产品型号</span>
            <span className={exceptionStyle.content}>{props.modelName}</span>
          </div>
        </Form.Item>
        <Form.Item noStyle>
          <div style={{ marginBottom: '16px' }}>
            <span className={exceptionStyle.label}>分析对象</span>
            <span className={exceptionStyle.content}>{props.deviceCode}</span>
          </div>
        </Form.Item>
        <Form.Item noStyle>
          <div style={{ marginBottom: '16px' }}>
            <span className={exceptionStyle.label}>异常属性</span>
            <span className={exceptionStyle.content}>{props.propertyName}</span>
          </div>
        </Form.Item>
        <Form.Item
          name='property'
          label={<BoldSpan label='对比属性' />}
          style={{ marginBottom: '16px' }}>
          <Select
            maxTagTextLength={18}
            placeholder='请选择对比属性'
            allowClear
            onChange={(val: any) => setSelectProperty(val)}>
            {propertyOptions.map((property: any) => {
              return (
                <Select.Option
                  value={property.code}
                  key={property.code}
                  disabled={
                    DisabledProperty.indexOf(property.type) > -1 ||
                    ((props.propertyType === DataTypeEnum.BOOLEAN ||
                      props.propertyType === DataTypeEnum.ENUM) &&
                      (property.type === DataTypeEnum.BOOLEAN ||
                        property.type === DataTypeEnum.ENUM))
                  }>
                  {!!property.num ? (
                    <span
                      style={{
                        color:
                          (props.propertyType === DataTypeEnum.BOOLEAN ||
                            props.propertyType === DataTypeEnum.ENUM) &&
                          (property.type === DataTypeEnum.BOOLEAN ||
                            property.type === DataTypeEnum.ENUM)
                            ? 'rgba(0,0,0,0.25)'
                            : '#DA5567'
                      }}>
                      {property.name}
                      {property.unit ? `(${property.unit})` : ''} (前后10分钟内出现 {property.num}{' '}
                      次异常)
                    </span>
                  ) : (
                    <span>
                      {property.name}
                      {property.unit ? `(${property.unit})` : ''}
                    </span>
                  )}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name='time'
          label={<BoldSpan label='统计时间' />}
          rules={[{ required: true, message: '请选择统计时间' }]}>
          <RangePicker
            onChange={handleRangeChange}
            picker='date'
            disabledDate={(date: any) => {
              return date && date > moment()
            }}
            format='YYYY-MM-DD HH:mm'
            showTime={{
              format: 'HH:mm'
            }}
          />
        </Form.Item>
      </Form>
      <Filter modelId={props.modelId} handleFilterCondition={handleFilterCondition} />
      <div className={style.button}>
        <Button
          size='large'
          type='primary'
          className={style.buttonCommon}
          onClick={() => analysis(selectProperty ? 'timeMuti' : 'time')}>
          时序分析
        </Button>
        {selectProperty ? (
          <Button
            size='large'
            type='primary'
            className={style.buttonCommon}
            onClick={() => analysis('dot')}>
            相关性分析
          </Button>
        ) : (
          <Button
            size='large'
            type='primary'
            className={style.buttonCommon}
            onClick={() => analysis('frequency')}>
            频率分布
          </Button>
        )}
      </div>
    </div>
  )
}

export default ExceptionAnalysisForm
