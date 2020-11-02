import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import request from '../../request/request'
import FormLabel from '../../components/FormLabel'
import api from '../../api'
import classnames from 'classnames'
import './DeviceEdit.less'
import { deviceCodeRules, phoneRules, emailRules } from './rules'
const { Option } = Select

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const DeviceEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isOuter, setIsOuter] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [title, setTitle] = useState('添加设备')
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑设备')
      if (props.detail.accountName && !props.detail.accountId) {
        props.detail.accountId = 'outer'
        setIsOuter(true)
      }
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, form])
  const onFinish = (values: any) => {
    let params = {
      ...values,
      accountId: values.accountId === 'outer' ? '' : values.accountId
    }
    if (props.detail) {
      params.id = props.detail.id
    } else {
      params.modelId = props.row.modelId
    }
    let qapi = props.detail ? api.device.device_update : api.device.device_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '创建成功')
        props.queryDevice()
        props.queryDeviceCount()
        if (!props.detail) {
          props.queryModelDetail()
        }
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onSelectChange = (value: string) => {
    value === 'outer' ? setIsOuter(true) : setIsOuter(false)
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      wrapClassName='device-edit'
      title={title}
      visible={visible}
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='device'
        initialValues={{ accountId: '' }}
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item label={<FormLabel label='产品型号' />}>
          <span>{props.row.modelName}</span>
        </Form.Item>
        <Form.Item
          label={
            <FormLabel label='唯一码' title='必填，支持大小写字母、数字和下划线，长度限制 1~30。' />
          }
          name='code'
          rules={deviceCodeRules}>
          <Input disabled={!!props.detail} allowClear placeholder='请输入设备唯一码' />
        </Form.Item>
        <Form.Item label={<FormLabel label='所属用户' />} name='accountId'>
          <Select onChange={onSelectChange}>
            {props.belongAccount.map((account: any, index: number) => {
              return (
                <Option value={account.code} key={index}>
                  <span className={classnames([account.native ? 'native' : ''])}>
                    {account.name}
                  </span>
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        {isOuter ? (
          <div className='device-connect'>
            <Form.Item
              name='accountName'
              label={<FormLabel label='姓名' />}
              rules={[{ required: true, message: '请输入姓名' }]}>
              <Input allowClear placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item name='accountPhone' label={<FormLabel label='手机号' />} rules={phoneRules}>
              <Input allowClear placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item name='accountEmail' label={<FormLabel label='邮箱' />} rules={emailRules}>
              <Input allowClear placeholder='请输入邮箱' />
            </Form.Item>
          </div>
        ) : null}
      </Form>
    </Modal>
  )
}

export default DeviceEdit
