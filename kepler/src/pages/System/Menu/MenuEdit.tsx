import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Radio, message, Select, Divider, Button } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import { PlusOutlined } from '@ant-design/icons'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const ParentName = (props: any) => {
  switch (props.type) {
    case 'add':
      return null
    case 'edit':
      return (
        <Form.Item label='父级菜单'>
          <span>{props.detail.pname}</span>
        </Form.Item>
      )
    case 'sub':
      return (
        <Form.Item label='父级菜单'>
          <span>{props.detail.name}</span>
        </Form.Item>
      )
  }
  return null
}

const MenuEdit = (props: any) => {
  const [visible, setVisible] = useState(props.visible)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<any>({ accessType: 'module', status: 'Y' })
  const [title, setTitle] = useState('新增')
  const [inputValue, setAddValue] = useState()
  const [operationCodes, setOperationCodes] = useState<any>([])
  const [form] = Form.useForm()
  useEffect(() => {
    if (props.detail && props.type === 'edit') {
      setTitle('编辑')
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, props.type, form])
  useEffect(() => {
    request.get(api.common.select_operationCode).then((res) => {
      setOperationCodes(res.data)
    })
  }, [])
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  const onFinish = (values: any) => {
    console.log(values)
    let params = {
      ...values
    }
    if (props.detail && props.type === 'edit') {
      params.id = props.detail.id
    }
    if (props.type === 'sub') {
      params.pid = props.detail.id
    }
    let qapi = props.type === 'edit' ? api.system.menu_update : api.system.menu_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.type === 'edit' ? '修改成功' : '创建成功')
        props.queryMenu()
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onNameChange = (e: any) => {
    setAddValue(e.target.value)
  }
  const addItem = () => {
    setOperationCodes([
      ...operationCodes,
      {
        code: inputValue,
        name: inputValue
      }
    ])
    setAddValue(undefined)
  }
  return (
    <Modal
      visible={visible}
      title={title}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      destroyOnClose={true}>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <ParentName {...props} />
        <Form.Item label='菜单名称' name='name' rules={[{ required: true }]}>
          <Input allowClear maxLength={30} />
        </Form.Item>
        <Form.Item label='URL' name='url' rules={[{ required: true }]}>
          <Input.TextArea rows={3} allowClear maxLength={255} />
        </Form.Item>
        <Form.Item label='排序号' name='sort' rules={[{ required: true }]}>
          <Input allowClear maxLength={3} />
        </Form.Item>
        <Form.Item label='访问类型' name='accessType'>
          <Radio.Group>
            <Radio value='menu'>菜单</Radio>
            <Radio value='module'>模块</Radio>
            <Radio value='operation'>操作</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.accessType !== currentValues.accessType
          }>
          {({ getFieldValue }) => {
            return getFieldValue('accessType') === 'operation' ? (
              <Form.Item name='operationCode' label='操作类型' rules={[{ required: true }]}>
                <Select
                  placeholder='操作类型'
                  dropdownRender={(options) => (
                    <div>
                      {options}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ padding: 8 }}>
                        <Input
                          style={{ width: '190px', marginRight: '14px' }}
                          value={inputValue}
                          onChange={onNameChange}
                        />
                        <Button icon={<PlusOutlined />} onClick={addItem} disabled={!inputValue}>
                          新增
                        </Button>
                      </div>
                    </div>
                  )}>
                  {operationCodes.map((item: any) => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : null
          }}
        </Form.Item>
        <Form.Item label='状态' name='status'>
          <Radio.Group>
            <Radio value='Y'>启用</Radio>
            <Radio value='N'>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='icon' name='icon'>
          <Input allowClear maxLength={40} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuEdit
