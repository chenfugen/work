import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import request from '../../../request/request'
import FormLabel from '../../../components/FormLabel'
import api from '../../../api'
import { modelCodeRules, modelNameRules } from './rules'
import { useSelector, shallowEqual } from 'react-redux'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const ModelEdit = (props: any) => {
  const [form] = Form.useForm()
  const userInfo = useSelector((state: any) => state.userInfo, shallowEqual)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [method, setMethod] = useState([])
  const [model, setModel] = useState([])
  const [accounts, setAccounts] = useState([])
  const [title, setTitle] = useState('新增型号')
  const queryMethods = () => {
    request.get(api.common.select_communication).then((res) => {
      setMethod(res.data)
    })
  }
  const queryModelSelect = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setModel(res.data)
    })
  }
  const queryAccountSelect = () => {
    return request.get(api.common.select_account).then((res) => {
      setAccounts(res.data)
    })
  }
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑型号')
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, form])
  useEffect(() => {
    if (!props.detail) {
      queryAccountSelect().then(() => {
        // 不是root账号把自己设置为相关人员之一
        if (!userInfo.isRoot) {
          form.setFieldsValue({ accountIds: [userInfo.id] })
        }
      })
    }
  }, [props.detail, form, userInfo])
  useEffect(queryMethods, [])
  useEffect(() => {
    if (!props.detail) {
      queryModelSelect()
    }
  }, [props.detail])
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  const onFinish = (values: any) => {
    let params = {
      ...values
    }
    if (props.detail) {
      params.id = props.detail.id
    } else {
      params.seriesId = props.seriesId
    }
    let qapi = props.detail ? api.system.model_model_update : api.system.model_model_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '新增成功')
        props.queryModels(props.seriesId)
        onCancel()
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }
  return (
    <Modal
      visible={visible}
      title={title}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      destroyOnClose>
      <Form
        {...formLayout}
        autoComplete='off'
        onFinish={onFinish}
        form={form}
        scrollToFirstError
        preserve={false}>
        <Form.Item label={<FormLabel label='产品系列' />}>
          <span>{props.seriesName}</span>
        </Form.Item>
        {props.detail && (
          <Form.Item label={<FormLabel label='型号编码' />}>
            <span>{props.detail.code}</span>
          </Form.Item>
        )}
        {!props.detail && (
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
        )}
        <Form.Item
          label={
            <FormLabel
              label='型号名称'
              title='必填，支持中文、英文字母、数字和特殊字符_-@()，长度限制 3~30。'
            />
          }
          name='name'
          rules={modelNameRules}>
          <Input allowClear placeholder='请输入型号名称' />
        </Form.Item>
        <Form.Item
          label={<FormLabel label='通讯方式' />}
          name='communicationMethod'
          rules={[{ required: true, message: '请选择通讯方式' }]}>
          <Select placeholder='请选择通讯方式'>
            {method.map((el: any) => {
              return (
                <Select.Option value={el.code} key={el.code}>
                  {el.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        {!props.detail && (
          <Form.Item
            label={
              <FormLabel
                label='复用属性配置'
                title='新增时如选择型号，将复制该型号的属性配置到新型号。'
              />
            }
            name='reuseProperties'>
            <Select
              allowClear
              showArrow
              maxTagCount={3}
              maxTagTextLength={8}
              placeholder='复制对应型号的属性配置'>
              {model.map((el: any) => {
                if (el.children && el.children.length) {
                  return (
                    <Select.OptGroup label={el.name} key={el.id}>
                      {el.children.map((model: any) => {
                        return (
                          <Select.Option value={model.id} key={model.id}>
                            {model.name}
                          </Select.Option>
                        )
                      })}
                    </Select.OptGroup>
                  )
                }
                return null
              })}
            </Select>
          </Form.Item>
        )}
        {!props.detail && (
          <Form.Item label={<FormLabel label='相关人员' />} name='accountIds'>
            <Select
              allowClear
              showArrow
              maxTagCount={3}
              maxTagTextLength={8}
              mode='multiple'
              placeholder='可查看该型号数据的人员账号'>
              {accounts.map((el: any) => {
                return (
                  <Select.Option value={el.code} key={el.code}>
                    {el.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}
        {props.phases.length !== 0 && (
          <Form.Item label={<FormLabel label='产品阶段' />} name='phase'>
            <Select>
              {props.phases.map((el: any) => {
                return (
                  <Select.Option value={el.code} key={el.code}>
                    {el.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}
        <Form.Item label={<FormLabel label='备注' />} name='remark'>
          <Input.TextArea
            maxLength={100}
            rows={3}
            allowClear
            placeholder='请输入备注(最大字符数100)'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModelEdit
