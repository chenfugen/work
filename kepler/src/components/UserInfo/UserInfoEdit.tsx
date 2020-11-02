import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import request from '../../request/request'
import api from '../../api'
import { phoneRules, emailRules } from '../../pages/Device/rules'
import FormLabel from '../../components/FormLabel'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const UserInfoEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  useEffect(() => {
    if (props.detail) {
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, form])
  const onFinish = (values: any) => {
    let params = {
      ...values
    }
    setConfirmLoading(true)
    request
      .post(api.common.userInfo_update, params)
      .then(() => {
        message.success('修改成功')
        props.queryUserInfo()
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      title='个人信息'
      visible={visible}
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='userinfo'
        initialValues={{ accountId: '' }}
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item label={<FormLabel label='账号' />}>
          <span>{props.detail.account}</span>
        </Form.Item>
        <Form.Item
          label={<FormLabel label='姓名' />}
          name='name'
          rules={[{ required: true, message: '请输入姓名' }]}>
          <Input allowClear placeholder='请输入姓名' />
        </Form.Item>
        <Form.Item name='phone' label={<FormLabel label='手机号' />} rules={phoneRules}>
          <Input allowClear placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item name='email' label={<FormLabel label='邮箱' />} rules={emailRules}>
          <Input allowClear placeholder='请输入邮箱' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserInfoEdit
