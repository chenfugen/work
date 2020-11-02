import React, { useState } from 'react'
import { Modal, Form, Input, message, Alert } from 'antd'
import request from '../../../request/request'
import FormLabel from '../../../components/FormLabel'
import api from '../../../api'
import { modelCodeRules, modelNameRules } from './rules'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const ModelCopy = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  const onFinish = (values: any) => {
    let params = {
      id: props.modelId,
      ...values
    }
    setConfirmLoading(true)
    request
      .post(api.system.model_model_copy, params)
      .then(() => {
        props.queryModels(props.seriesId)
        message.success('复制型号成功')
        onCancel()
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }
  return (
    <Modal
      visible={visible}
      title='复制型号'
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <Alert
        style={{ marginBottom: '24px' }}
        type='warning'
        message='将复制型号信息、型号的属性配置、相关人员、指令配置、异常配置、脚本配置到新型号。'
      />
      <Form
        {...formLayout}
        autoComplete='off'
        onFinish={onFinish}
        form={form}
        scrollToFirstError
        preserve={false}>
        <Form.Item
          label={
            <FormLabel
              label='型号编码'
              title='必填，支持大小写字母、数字和下划线，不能以数字开头，长度限制 4~30。'
            />
          }
          name='code'
          rules={modelCodeRules}>
          <Input allowClear placeholder='请输入型号编码' />
        </Form.Item>
        <Form.Item
          label={
            <FormLabel
              label='型号名称'
              title='必填，支持中文、英文字母、数字和特殊字符_-@()，长度限制 4~30。'
            />
          }
          name='name'
          rules={modelNameRules}>
          <Input allowClear placeholder='请输入型号名称' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModelCopy
