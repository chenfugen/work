import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { SamplingTypes, timeTypes } from '../../../config/SelfDefinedSelect'
import { SamplingTypesEnum, DataTypeEnum } from '../../../config/Enum'
import FormLabel from '../../../components/FormLabel'
import { timeRules } from './rules'
interface props {
  selectProperty: any
  statisticType: SamplingTypesEnum
  sampleInterval?: number
  defaultSampleInterval: number | null
  timeType?: string
  visible: boolean
  setVisible: (visible: boolean) => void
  setSamplingInfo: (SamplingInfo: any) => void
}

const SamplingDialog = (props: props) => {
  const [form] = Form.useForm()
  const [statisticType, setStatisticType] = useState<SamplingTypesEnum>(props.statisticType)
  const [samplingTypesFilter, setSamplingTypesFilter] = useState<any>(SamplingTypes)
  const [visible, setVisible] = useState(props.visible)
  useEffect(() => {
    setVisible(props.visible)
    if (props.visible) {
      form.setFieldsValue({
        statisticType: props.statisticType,
        sampleInterval: props.sampleInterval,
        timeType: props.timeType || 's'
      })
    }
  }, [props.visible])
  const onFinish = (values: any) => {
    if (values.statisticType !== SamplingTypesEnum.RAW) {
      let sampleInterval = values.sampleInterval
      let defaultSampleInterval = props.defaultSampleInterval
      let timeType = values.timeType
      if (timeType === 'm') {
        sampleInterval = sampleInterval * 60
      }
      if (defaultSampleInterval && sampleInterval < defaultSampleInterval) {
        Modal.info({
          centered: true,
          content: (
            <div>
              采样间隔过小会导致数据量较大。
              <br />
              建议您修改统计时间范围，或修改采样间隔。
            </div>
          )
        })
        return
      }
    } else {
      if (props.defaultSampleInterval) {
        Modal.info({
          centered: true,
          content: (
            <div>
              采样间隔过小会导致数据量较大。
              <br />
              建议您修改统计时间范围，或修改采样间隔。
            </div>
          )
        })
        return
      }
    }
    props.setSamplingInfo(values)
    setVisible(false)
    props.setVisible(false)
  }
  useEffect(() => {
    if (props.selectProperty) {
      let hasEmunOrBoolean = props.selectProperty.some((el: any) => {
        return el.type === DataTypeEnum.BOOLEAN || el.type === DataTypeEnum.ENUM
      })
      if (hasEmunOrBoolean) {
        setSamplingTypesFilter([
          {
            code: SamplingTypesEnum.RAW,
            name: '原始数据'
          },
          {
            code: SamplingTypesEnum.ANY,
            name: '随机值'
          }
        ])
      }
    }
  }, [props.selectProperty])
  const onCancel = () => {
    setVisible(false)
    setStatisticType(props.statisticType)
    form.setFieldsValue({
      statisticType: props.statisticType,
      sampleInterval: props.sampleInterval,
      timeType: props.timeType
    })
    props.setVisible(false)
  }
  return (
    <Modal
      wrapClassName='sampling-edit'
      title='设置采样间隔'
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='sampling'
        initialValues={{ statisticType: 'raw', timeType: 's' }}
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        layout='inline'
        autoComplete='off'>
        <Form.Item name='statisticType'>
          <Select onChange={(type: SamplingTypesEnum) => setStatisticType(type)}>
            {samplingTypesFilter.map((type: any) => {
              return (
                <Select.Option key={type.code} value={type.code}>
                  {type.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        {statisticType !== 'raw' ? (
          <>
            <Form.Item
              label={<FormLabel label='采样间隔' />}
              name='sampleInterval'
              rules={timeRules}
              style={{ marginRight: '8px' }}>
              <Input type='number' style={{ width: '100px' }} placeholder='间隔时间'></Input>
            </Form.Item>
            <Form.Item name='timeType'>
              <Select style={{ width: '70px' }} placeholder='单位'>
                {timeTypes.map((type: any) => {
                  return (
                    <Select.Option key={type.code} value={type.code}>
                      {type.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </>
        ) : (
          <span style={{ lineHeight: '32px' }}>不采样</span>
        )}
      </Form>
    </Modal>
  )
}

export default SamplingDialog
