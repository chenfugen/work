import React, { useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import request from '../../request/request'
import api from '../../api'
import FormLabel from '../../components/FormLabel'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const PasswordEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const onFinish = (values: any) => {
    let params = {
      ...values
    }
    setConfirmLoading(true)
    request
      .post(api.common.userInfo_password_update, params)
      .then(() => {
        message.success('修改成功')
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
      wrapClassName='device-edit'
      title='修改密码'
      visible={visible}
      confirmLoading={confirmLoading}
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='user_password'
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item
          label={<FormLabel label='旧密码' />}
          name='oldPwd'
          rules={[{ required: true, message: '请输入旧密码' }]}>
          <Input type='text' allowClear placeholder='请输入旧密码' />
        </Form.Item>
        <Form.Item
          name='newPwd'
          label={<FormLabel label='新密码' />}
          rules={[
            {
              required: true,
              message: '请输入新密码'
            }
          ]}>
          <Input placeholder='新密码' />
        </Form.Item>
        <Form.Item
          name='confirm'
          label={<FormLabel label='重复新密码' />}
          dependencies={['newPwd']}
          rules={[
            {
              required: true,
              message: '请输入新密码'
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPwd') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('两次输入新密码不一致')
              }
            })
          ]}>
          <Input placeholder='重复新密码' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PasswordEdit
