import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message, Button, Space, Radio } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import FormLabel from '../../../components/FormLabel'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { commandRules, commandNameRules } from './rules'
import style from './css/ParamsEdit.module.css'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const formatJson = (commands: object | Array<any>) => {
  let temp: any = {}
  console.log('commands', commands)
  if (Array.isArray(commands)) {
    console.log(true)
    commands.forEach((el) => {
      temp[el.name] = el.value
    })
  }
  return JSON.stringify(temp)
}

const CommandEdit = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [title, setTitle] = useState('新增指令配置')
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑指令配置')
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, form])
  useEffect(() => {
    setVisible(props.visible)
  }, [props.visible])
  const onFinish = (values: any) => {
    let params = {
      ...values,
      commands: values.commands ? formatJson(values.commands) : ''
    }
    if (props.detail) {
      params.id = props.detail.id
    } else {
      params.modelId = props.row.modelId
    }
    let qapi = props.detail
      ? api.system.model_detail_command_update
      : api.system.model_detail_command_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '创建成功')
        props.queryCommand()
        props.queryDetail()
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
      wrapClassName='params-edit'
      title={title}
      maskClosable={false}
      visible={visible}
      confirmLoading={confirmLoading}
      destroyOnClose
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='model_params'
        initialValues={{ status: 'Y' }}
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item
          label={
            <FormLabel
              label='指令编码'
              title='必填，支持大小写字母、数字和下划线，不超过 50 个字符。'
            />
          }
          name='param'
          rules={commandRules}>
          <Input placeholder='请输入指令编码' allowClear />
        </Form.Item>
        <Form.Item
          label={
            <FormLabel
              label='指令名称'
              title='必填，支持中文、大小写字母、数字、短划线、下划线和小数点，必须以中文、英文或数字开头，不超过 30 个字符。'
            />
          }
          name='name'
          rules={commandNameRules}>
          <Input placeholder='请输入指令名称' allowClear />
        </Form.Item>
        <Form.Item label={<FormLabel label='指令组' />} name='type'>
          <Form.List name='commands'>
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <Space key={index} align='start'>
                        <Form.Item
                          name={[field.name, 'name']}
                          rules={[{ required: true, message: '请输入枚举项' }]}>
                          <Input placeholder='枚举项' />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'value']}
                          rules={[{ required: true, message: '请输入枚举项描述' }]}>
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
        </Form.Item>
        <Form.Item name='status' label={<FormLabel label='状态' />} rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value='Y'>启用</Radio>
            <Radio value='N'>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name='remark' label={<FormLabel label='备注' />}>
          <Input.TextArea maxLength={100} rows={3} placeholder='请输入备注(限100字)' allowClear />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CommandEdit
