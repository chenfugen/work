import React, { useState, useEffect, ChangeEvent } from 'react'
import { Modal, Form, Input, Select, message, Alert, Button, Space } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import FormLabel from '../../../components/FormLabel'
import { DataTypeEnum } from '../../../config/Enum'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import style from './css/ParamsEdit.module.css'
import { paramNameRules, paramCodeRules, stepRules, minRules, maxRules } from './rules'

const integerRegexp = /^(-)?[0-9]*$/
const stringRegexp = /^[1-9]+$/
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const formatJson = (enumJson: object | Array<any>, type: DataTypeEnum) => {
  if (type === DataTypeEnum.BOOLEAN) {
    return JSON.stringify(enumJson)
  } else if (type === DataTypeEnum.ENUM) {
    let temp: any = {}
    console.log('enumJson', enumJson)
    if (Array.isArray(enumJson)) {
      console.log(true)
      enumJson.forEach((el) => {
        temp[el.name] = el.value
      })
    }
    return JSON.stringify(temp)
  }
  return ''
}

const ParamsEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [title, setTitle] = useState('新增属性配置')
  const [selectDataType, setSelectDataType] = useState(DataTypeEnum.INTEGER)
  useEffect(() => {
    if (!props.detail) {
      form.setFieldsValue({ type: DataTypeEnum.INTEGER })
    }
  }, [])
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑属性配置')
      form.setFieldsValue(props.detail)
      setSelectDataType(props.detail.type)
    }
  }, [props.detail, form])
  useEffect(() => {
    setVisible(props.visible)
  }, [props.visible])
  const onFinish = (values: any) => {
    console.log(values)
    // return

    let params = {
      ...values,
      enumJson: values.enumJson ? formatJson(values.enumJson, selectDataType) : ''
    }
    if (props.detail) {
      params.id = props.detail.id
    } else {
      params.modelId = props.row.modelId
    }
    let qapi = props.detail
      ? api.system.model_detail_params_update
      : api.system.model_detail_params_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '创建成功')
        props.queryParams()
        props.queryDetail()
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onSelectChange = (value: DataTypeEnum) => {
    setSelectDataType(value)
    form.resetFields(['step', 'enumJson', 'min', 'max'])
    if (value === DataTypeEnum.ENUM) {
      form.setFieldsValue({
        enumJson: [
          {
            value: '',
            name: ''
          },
          {
            value: '',
            name: ''
          }
        ]
      })
    }
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      wrapClassName='params-edit'
      title={title}
      visible={visible}
      confirmLoading={confirmLoading}
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='model_params'
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item
          label={
            <FormLabel
              label='属性名称'
              title='必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文开头，不超过 30 个字符。'
            />
          }
          name='name'
          rules={paramNameRules}>
          <Input placeholder='请输入属性名称' allowClear />
        </Form.Item>
        <Form.Item
          label={
            <FormLabel
              label='属性标识符'
              title='必填，支持大小写字母、数字和下划线，必须以英文开头，不超过 50 个字符。'
            />
          }
          name='param'
          rules={paramCodeRules}>
          <Input placeholder='请输入属性标识符' allowClear />
        </Form.Item>
        <Form.Item label={<FormLabel label='数据类型' />} name='type' rules={[{ required: true }]}>
          <Select onChange={onSelectChange}>
            {props.dataTypes.map((type: any, index: number) => {
              return (
                <Select.Option value={type.code} key={index}>
                  {type.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        {(selectDataType === DataTypeEnum.INTEGER ||
          selectDataType === DataTypeEnum.FLOAT ||
          selectDataType === DataTypeEnum.DOUBLE) && (
          <>
            <Form.Item
              label={<FormLabel label='取值范围' />}
              required
              style={{ marginBottom: '0' }}>
              <Space align='start'>
                <Form.Item name='min' rules={minRules}>
                  <Input placeholder='最小值' />
                </Form.Item>
                <span className={style.startIcon}>~</span>
                <Form.Item name='max' rules={maxRules}>
                  <Input placeholder='最大值' />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              name='step'
              label={<FormLabel label='步长' />}
              rules={[{ required: true, message: '请输入步长' }]}>
              <Input placeholder='请输入步长' allowClear />
            </Form.Item>
            <Form.Item name='unit' label={<FormLabel label='单位' />}>
              <Input placeholder='请输入单位' allowClear maxLength={15} />
            </Form.Item>
          </>
        )}
        {selectDataType === DataTypeEnum.STRING && (
          <Form.Item
            name='step'
            label={<FormLabel label='字节数' />}
            rules={stepRules}
            validateFirst={true}>
            <Input
              addonAfter='字节'
              type='number'
              placeholder='请输入字节数'
              className={style.inputAppearance}
            />
          </Form.Item>
        )}
        {selectDataType === DataTypeEnum.BOOLEAN && (
          <Form.Item label={<FormLabel label='布尔值' />} style={{ marginBottom: '0' }}>
            <Space align='start'>
              <span className={style.startIcon}>0 -</span>
              <Form.Item
                name={['enumJson', '0']}
                rules={[{ required: true, message: '请输入描述' }]}>
                <Input style={{ width: '180px' }} placeholder='如: 开' />
              </Form.Item>
            </Space>
            <Space align='start'>
              <span className={style.startIcon}>1 -</span>
              <Form.Item
                name={['enumJson', '1']}
                rules={[{ required: true, message: '请输入描述' }]}>
                <Input style={{ width: '180px' }} placeholder='如: 关' />
              </Form.Item>
            </Space>
          </Form.Item>
        )}
        {selectDataType === DataTypeEnum.DATE && (
          <Form.Item label={<FormLabel label=' ' />} colon={false}>
            <Alert
              message='String类型的UTC时间戳(毫秒)'
              type='info'
              style={{ padding: '3px 10px' }}
            />
          </Form.Item>
        )}
        {selectDataType === DataTypeEnum.ENUM && (
          <Form.List name='enumJson'>
            {(fields, { add, remove }) => {
              return (
                <div className={style.enumStyle}>
                  <h3>枚举项</h3>
                  {fields.map((field, index) => {
                    return (
                      <Space key={index} align='start'>
                        <Form.Item
                          wrapperCol={{ span: 24 }}
                          name={[field.name, 'name']}
                          rules={[{ required: true, message: '请输入编号' }]}>
                          <Input placeholder='枚举值' />
                        </Form.Item>
                        <Form.Item
                          wrapperCol={{ span: 24 }}
                          name={[field.name, 'value']}
                          rules={[{ required: true, message: '请输入描述' }]}>
                          <Input placeholder='枚举项描述' />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(index)}
                          className={style.startIcon}
                        />
                      </Space>
                    )
                  })}
                  <Form.Item noStyle>
                    <Button
                      style={{ marginBottom: '16px' }}
                      onClick={() => {
                        add()
                      }}
                      block
                      type='dashed'>
                      <PlusOutlined /> 新增枚举值
                    </Button>
                  </Form.Item>
                </div>
              )
            }}
          </Form.List>
        )}
        <Form.Item name='remark' label={<FormLabel label='备注' />}>
          <Input.TextArea maxLength={100} rows={3} placeholder='请输入备注（100字以内）' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ParamsEdit
