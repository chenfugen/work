import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, message } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import FormLabel from '../../../components/FormLabel'
import { serieNameRules, serieCodeRules } from './rules'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const SeriesEdit = (props: any) => {
  console.log(props)
  const [visible, setVisible] = useState(props.visible)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [title, setTitle] = useState('新增系列')
  const [form] = Form.useForm()
  const [series] = useState(props.row)
  useEffect(() => {
    if (props.row.id) {
      setTitle('编辑系列')
    }
  }, [props.row])
  const onFinish = (values: any) => {
    let params = {
      ...values
    }
    if (series.id) {
      params.id = series.id
    }
    const qapi = series.id ? api.system.model_series_update : api.system.model_series_add
    request
      .post(qapi, params)
      .then((res) => {
        const tips = series.id ? '更新成功' : '创建成功'
        message.success(tips)
        props.querySeries(res.data || series.id)
      })
      .finally(() => {
        setConfirmLoading(false)
        props.setVisible(false)
      })
  }
  const handleOk = () => {
    form.submit()
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      centered
      visible={visible}
      title={title}
      onCancel={onCancel}
      maskClosable={false}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <Form
        onFinish={onFinish}
        form={form}
        scrollToFirstError
        {...formLayout}
        autoComplete='off'
        initialValues={series}
        preserve={false}>
        <Form.Item
          label={
            <FormLabel
              label='系列名称'
              title='必填，支持中文、英文字母、数字和特殊字符_-@()，长度限制 2~30。'
            />
          }
          name='name'
          rules={serieNameRules}>
          <Input allowClear placeholder='请输入系列名称' />
        </Form.Item>
        <Form.Item
          label={
            <FormLabel
              label='系列编码'
              title='必填，支持大小写字母、数字和下划线，不超过 50 个字符。'
            />
          }
          name='code'
          rules={serieCodeRules}>
          <Input allowClear placeholder='请输入系列编码' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SeriesEdit
