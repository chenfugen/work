import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message, Radio, Space } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import FormLabel from '../../../components/FormLabel'
import { DataTypeEnum } from '../../../config/Enum'
import { DataTypeNameDisplayEnum } from '../../../config/Enum'
import style from './css/ExceptionEdit.module.css'
// import './ParamsEdit.less'
const { Option } = Select

type propertyParams = {
  id: string
  name: string
  param: string
  type: DataTypeEnum
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const CanConfigException: Array<DataTypeEnum> = [
  DataTypeEnum.BOOLEAN,
  DataTypeEnum.INTEGER,
  DataTypeEnum.FLOAT,
  DataTypeEnum.DOUBLE,
  DataTypeEnum.ENUM
]

const ExceptionEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [title, setTitle] = useState('新增异常配置')
  const [selectDataType, setSelectDataType] = useState('')
  const [selectProperty, setSelectProperty] = useState<any>({})
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑异常配置')
      onSelectChange(props.detail.propertyId).then(() => {
        if (props.type === DataTypeEnum.ENUM) {
          props.detail.alarmCodes = props.detail.alarmCodes.split(',')
        }
        form.setFieldsValue(props.detail)
      })
    }
  }, [props.detail, props.type, form])
  useEffect(() => {
    setVisible(props.visible)
  }, [props.visible])
  const onFinish = (values: any) => {
    console.log(values)
    let params = {
      ...values,
      modelId: props.row.modelId
    }
    if (values.alarmCodes) {
      params.alarmCodes = Array.isArray(values.alarmCodes)
        ? values.alarmCodes.join(',')
        : values.alarmCodes
    }
    let qapi = props.detail
      ? api.system.model_detail_exception_update
      : api.system.model_detail_exception_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '创建成功')
        props.queryException()
        props.queryDetail()
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onSelectChange = (id: propertyParams['id']) => {
    let params = {
      id
    }
    return request.get(api.system.model_detail_params_update, params).then((res) => {
      try {
        res.data.enumJson = JSON.parse(res.data.enumJson)
      } catch (e) {
        res.data.enumJson = {}
      }
      setSelectProperty(res.data)
      let type = props.property.filter((item: propertyParams) => {
        return item.id === id
      })[0].type
      setSelectDataType(type)
      form.resetFields(['step'])
    })
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      wrapClassName='exception-edit'
      title={title}
      maskClosable={false}
      visible={visible}
      confirmLoading={confirmLoading}
      destroyOnClose
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='model_exception'
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item
          label={
            <FormLabel
              label='属性'
              title='只能选择可配置异常的属性(可选择数据类型：enum, int32, float, double, bool)'
            />
          }
          name='propertyId'
          rules={[{ required: true, message: '请选择属性' }]}>
          <Select onChange={onSelectChange} placeholder='请选择属性' disabled={props.detail}>
            {props.property.map((propertyParams: propertyParams, index: number) => {
              return (
                <Option
                  value={propertyParams.id}
                  key={propertyParams.id}
                  disabled={CanConfigException.indexOf(propertyParams.type) === -1}>
                  {propertyParams.name + '(' + DataTypeNameDisplayEnum[propertyParams.type] + ')'}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        {(selectDataType === DataTypeEnum.INTEGER ||
          selectDataType === DataTypeEnum.FLOAT ||
          selectDataType === DataTypeEnum.DOUBLE) && (
          <>
            <Form.Item label={<FormLabel label='取值范围' />}>
              <span>
                {selectProperty.min} - {selectProperty.max}
              </span>
            </Form.Item>
            <Form.Item label={<FormLabel label='步长' />}>
              <span>{selectProperty.step}</span>
            </Form.Item>
            <Form.Item label={<FormLabel label='单位' />}>
              <span>{selectProperty.unit}</span>
            </Form.Item>
          </>
        )}
        {selectDataType === DataTypeEnum.BOOLEAN && (
          <Form.Item label={<FormLabel label='布尔值' />} style={{ marginBottom: 0 }}>
            <p>0 - {selectProperty.enumJson[0]}</p>
            <p>1 - {selectProperty.enumJson[1]}</p>
          </Form.Item>
        )}
        {selectDataType === DataTypeEnum.ENUM && (
          <Form.Item label={<FormLabel label='枚举值' />} style={{ marginBottom: 0 }}>
            {Object.keys(selectProperty.enumJson).map((key) => {
              return (
                <p key={key}>
                  {key} - {selectProperty.enumJson[key]}
                </p>
              )
            })}
          </Form.Item>
        )}
        <Form.Item label={<FormLabel label='异常值' />}>
          {selectDataType === DataTypeEnum.BOOLEAN && (
            <Form.Item name='alarmCodes'>
              <Radio.Group>
                <Radio value='0'>0</Radio>
                <Radio value='1'>1</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {selectDataType === DataTypeEnum.ENUM && (
            <Form.Item name='alarmCodes'>
              <Select
                mode='multiple'
                maxTagCount={3}
                maxTagTextLength={8}
                showArrow
                placeholder='请选择异常枚举值'>
                {Object.keys(selectProperty.enumJson).map((key) => {
                  return (
                    <Select.Option key={key} value={key}>
                      {key} - {selectProperty.enumJson[key]}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          )}
          {(selectDataType === DataTypeEnum.INTEGER ||
            selectDataType === DataTypeEnum.FLOAT ||
            selectDataType === DataTypeEnum.DOUBLE) && (
            <Form.Item>
              <Space align='start'>
                <span className={style.startIcon}>大于</span>
                <Form.Item name='alarmMax'>
                  <Input />
                </Form.Item>
              </Space>
              <Space align='start'>
                <span className={style.startIcon}>或</span>
                <span className={style.startIcon}>小于</span>
                <Form.Item name='alarmMin'>
                  <Input />
                </Form.Item>
              </Space>
            </Form.Item>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExceptionEdit
