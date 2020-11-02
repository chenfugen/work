import React, { useState, useEffect } from 'react'
import Filter from './Filter'
import { Form, Button, Select, DatePicker } from 'antd'
import style from './css/AnalysisForm.module.css'
import request from '../../../request/request'
import api from '../../../api'
import { DataTypeEnum } from '../../../config/Enum'
import moment from 'moment'
const { RangePicker } = DatePicker

const DisabledProperty = [DataTypeEnum.STRING, DataTypeEnum.DATE]

const BoldSpan = (props: any) => <span style={{ fontWeight: 'bold' }}>{props.label}</span>
// 组件 AnalysisForm
const AnalysisForm = (props: any) => {
  let [form] = Form.useForm()
  const [modelOptions, setModelOptions] = useState([])
  const [deviceOptions, setdeviceOptions] = useState([])
  const [propertyOptions, setPropertyOptions] = useState([])
  const [filterCondition, setFilterCondition] = useState({})
  const [selectModel, setSelectModel] = useState('')
  const [param1, setParam1] = useState('')
  const [param2, setParam2] = useState('')
  const [device1, setDevice1] = useState('')
  const [device2, setDevice2] = useState('')
  const [property1, setProperty1] = useState('')
  const [property2, setProperty2] = useState('')
  useEffect(() => {
    if (param1) {
      let arr1: any = propertyOptions.filter((el: any) => {
        return el.param === param1
      })
      setProperty1(arr1[0].type)
    }
  }, [param1, propertyOptions])
  useEffect(() => {
    if (param2) {
      let arr2: any = propertyOptions.filter((el: any) => {
        return el.param === param2
      })
      setProperty2(arr2[0].type)
    }
  }, [param2, propertyOptions])
  // 型号下拉框选项
  const queryModelSelect = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setModelOptions(res.data)
      if (props.initValues) {
        console.log(props.initValues)
        let modelId = props.initValues.modelId
        let modelCode = props.initValues.modelCode
        let deviceCode = props.initValues.deviceCode
        modelId && setSelectModel(modelId)
        deviceCode && form.setFieldsValue({ deviceCode })
        modelCode && form.setFieldsValue({ model: modelCode })
      }
    })
  }
  // 设备下拉框选项
  const queryDeviceOptions = () => {
    if (!selectModel) {
      setdeviceOptions([])
    } else {
      let params = {
        modelId: selectModel
      }
      request.get(api.common.select_device, params).then((res) => {
        setdeviceOptions(res.data)
      })
    }
  }
  // 属性下拉框选项
  const queryPropertyOptions = () => {
    if (!selectModel) {
      setPropertyOptions([])
    } else {
      let params = {
        modelId: selectModel
      }
      request.get(api.common.select_property, params).then((res) => {
        setPropertyOptions(res.data)
      })
    }
  }
  // 选择型号变化回调函数
  const handleModelChange = (model: string, option: any) => {
    setSelectModel(option.key)
    if (props.type === 'multiple') {
      setParam1('')
      setParam2('')
      setProperty1('')
      setProperty2('')
    }
    if (props.type === 'contrast') {
      setDevice1('')
      setDevice2('')
    }
    form.setFieldsValue({
      deviceCode: undefined,
      property: undefined,
      deviceCodeList: undefined,
      propertyList: undefined
    })
  }
  const onValuesChange = (oldValues: any, values: any) => {
    console.log(oldValues, values)
  }
  const handleFilterCondition = (value: any) => {
    setFilterCondition(value)
  }
  // 时序分析
  const timeAnalysis = () => {
    form.validateFields().then((res) => {
      if (res) {
        let params: any = { ...form.getFieldsValue(), ...filterCondition }
        params.startTime = params.time[0].format('YYYY-MM-DD HH:mm:ss')
        params.endTime = params.time[1].format('YYYY-MM-DD HH:mm:ss')
        delete params.time
        if (params.queryInfo) {
          params.queryInfo = JSON.stringify(params.queryInfo)
        }
        let selectParams
        if (props.type === 'multiple') {
          let arr1 = propertyOptions.filter((el: any) => {
            return el.param === param1
          })
          let arr2 = propertyOptions.filter((el: any) => {
            return el.param === param2
          })
          selectParams = [...arr1, ...arr2]
        } else {
          selectParams = propertyOptions.filter((el: any) => {
            return el.param === params.property
          })
        }
        props.setSelectProperty && props.setSelectProperty(selectParams)
        props.timeSearch(params, selectParams)
      }
    })
  }
  // 频率分布、相关性分析
  const frequencyAnalysis = () => {
    form.validateFields().then((res) => {
      if (res) {
        let params: any = { ...form.getFieldsValue(), ...filterCondition }
        params.startTime = params.time[0].format('YYYY-MM-DD HH:mm:ss')
        params.endTime = params.time[1].format('YYYY-MM-DD HH:mm:ss')
        if (params.queryInfo) {
          params.queryInfo = JSON.stringify(params.queryInfo)
        }
        delete params.time
        let selectParams
        if (props.type === 'multiple') {
          let arr1 = propertyOptions.filter((el: any) => {
            return el.param === param1
          })
          let arr2 = propertyOptions.filter((el: any) => {
            return el.param === param2
          })
          selectParams = [...arr1, ...arr2]
        } else {
          selectParams = propertyOptions.filter((el: any) => {
            return el.param === params.property
          })
        }
        props.setSelectProperty && props.setSelectProperty(selectParams)
        props.frequencySearch(params, selectParams)
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
        console.log(start.format(), end.format())
        form.setFieldsValue({
          time: [start, end]
        })
      }
    }
  }
  useEffect(queryModelSelect, [])
  useEffect(queryDeviceOptions, [selectModel])
  useEffect(queryPropertyOptions, [selectModel])
  return (
    <div className={style.analysis}>
      <h3 className={style.title}>数据分析设置</h3>
      <Form layout='vertical' form={form} onValuesChange={onValuesChange}>
        <Form.Item
          name='model'
          label={<BoldSpan label='产品型号' />}
          rules={[{ required: true, message: '请选择产品型号' }]}>
          <Select
            showArrow
            onChange={handleModelChange}
            maxTagTextLength={18}
            placeholder='需要分析的型号'>
            {modelOptions.map((el: any) => {
              if (el.children && el.children.length) {
                return (
                  <Select.OptGroup label={el.name} key={el.id}>
                    {el.children.map((model: any) => {
                      return (
                        <Select.Option value={model.code} key={model.id}>
                          {model.name}
                        </Select.Option>
                      )
                    })}
                  </Select.OptGroup>
                )
              }
              return null
            })}
          </Select>
        </Form.Item>
        {props.type === 'contrast' && (
          <>
            <Form.Item label={<BoldSpan label='对比对象' />} required>
              <Form.Item
                name={['deviceCodeList', 0]}
                rules={[{ required: true, message: '请选择对比对象' }]}
                style={{ marginBottom: '8px' }}>
                <Select
                  maxTagTextLength={18}
                  placeholder='请选择对比设备'
                  onChange={(device: string) => setDevice1(device)}>
                  {deviceOptions.map((device: any) => {
                    return (
                      <Select.Option
                        value={device.code}
                        key={device.code}
                        disabled={device.code === device2}>
                        {device.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name={['deviceCodeList', 1]}
                rules={[{ required: true, message: '请选择对比对象' }]}
                noStyle>
                <Select
                  maxTagTextLength={18}
                  placeholder='请选择对比设备'
                  onChange={(device: string) => setDevice2(device)}>
                  {deviceOptions.map((device: any) => {
                    return (
                      <Select.Option
                        value={device.code}
                        key={device.code}
                        disabled={device.code === device1}>
                        {device.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Form.Item>
          </>
        )}
        {props.type !== 'contrast' && (
          <Form.Item
            name='deviceCode'
            label={<BoldSpan label='分析对象' />}
            rules={[{ required: true, message: '请选择分析对象' }]}>
            <Select maxTagTextLength={18} placeholder='请选择分析对象'>
              {deviceOptions.map((device: any) => {
                return (
                  <Select.Option value={device.code} key={device.code}>
                    {device.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}
        {props.type !== 'multiple' && (
          <Form.Item
            name='property'
            label={<BoldSpan label='分析属性' />}
            rules={[{ required: true, message: '请选择分析属性' }]}>
            <Select maxTagTextLength={18} placeholder='请选择分析属性'>
              {propertyOptions.map((property: any) => {
                return (
                  <Select.Option
                    value={property.param}
                    key={property.id}
                    disabled={DisabledProperty.indexOf(property.type) > -1}>
                    {property.name}
                    {property.unit ? `(${property.unit})` : ''}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}
        {props.type === 'multiple' && (
          <>
            <Form.Item
              name={['propertyList', 0]}
              label={<BoldSpan label='分析属性1' />}
              rules={[{ required: true, message: '请选择分析属性1' }]}>
              <Select
                maxTagTextLength={18}
                placeholder='请选择分析属性'
                onChange={(param: string) => setParam1(param)}>
                {propertyOptions.map((property: any) => {
                  return (
                    <Select.Option
                      value={property.param}
                      key={property.id}
                      disabled={
                        ((property2 === DataTypeEnum.BOOLEAN || property2 === DataTypeEnum.ENUM) &&
                          (property.type === DataTypeEnum.BOOLEAN ||
                            property.type === DataTypeEnum.ENUM)) ||
                        property.param === param2 ||
                        DisabledProperty.indexOf(property.type) > -1
                      }>
                      {property.name}
                      {property.unit ? `(${property.unit})` : ''}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={['propertyList', 1]}
              label={<BoldSpan label='分析属性2' />}
              rules={[{ required: true, message: '请选择分析属性2' }]}>
              <Select
                maxTagTextLength={18}
                placeholder='请选择分析属性'
                onChange={(param: string) => setParam2(param)}>
                {propertyOptions.map((property: any) => {
                  return (
                    <Select.Option
                      value={property.param}
                      key={property.id}
                      disabled={
                        ((property1 === DataTypeEnum.BOOLEAN || property1 === DataTypeEnum.ENUM) &&
                          (property.type === DataTypeEnum.BOOLEAN ||
                            property.type === DataTypeEnum.ENUM)) ||
                        property.param === param1 ||
                        DisabledProperty.indexOf(property.type) > -1
                      }>
                      {property.name}
                      {property.unit ? `(${property.unit})` : ''}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item
          name='time'
          label={<BoldSpan label='统计时间' />}
          rules={[{ required: true, message: '请选择统计时间' }]}>
          <RangePicker
            onChange={handleRangeChange}
            disabledDate={(date: any) => {
              return date && date > moment()
            }}
            picker='date'
            format='YYYY-MM-DD HH:mm'
            showTime={{
              format: 'HH:mm',
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')]
            }}
          />
        </Form.Item>
      </Form>
      <Filter modelId={selectModel} handleFilterCondition={handleFilterCondition} />
      <div className={style.button}>
        <Button
          loading={props.timechartLoading}
          size='large'
          type='primary'
          className={style.buttonCommon}
          onClick={timeAnalysis}>
          时序分析
        </Button>
        <Button
          loading={props.chartLoading}
          size='large'
          type='primary'
          className={style.buttonCommon}
          onClick={frequencyAnalysis}>
          {props.type === 'multiple' ? '相关性分析' : '频率分布'}
        </Button>
      </div>
    </div>
  )
}

export default AnalysisForm
