import React, { useState, useEffect, useReducer } from 'react'
import { Button, Table, Form, Modal, Input, Select, message, Breadcrumb, Radio } from 'antd'
import CardContainer from '../../../components/CardContainer'
import FormForSearch from '../../../components/FormForSearch'
import FormLabel from '../../../components/FormLabel'
import request from '../../../request/request'
import api from '../../../api'
import { useForm, FormInstance } from 'antd/lib/form/Form'
import { formatTime } from '../../../utils/utils'
import style from './index.module.css'
import { accountRules, emailRules, passwordRules, phoneRules } from './rules'
import { useRole } from '../Model/hooks'
const { Option, OptGroup } = Select

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const formJson = [
  {
    type: 'input',
    filed: 'account',
    placeholder: '账号'
  },
  {
    type: 'input',
    filed: 'name',
    placeholder: '姓名'
  },
  {
    type: 'select',
    filed: 'roleId',
    query: api.common.select_role,
    placeholder: '角色'
  }
]

const initalParams = {
  pageSize: 10,
  pageNum: 1
}
const Account = () => {
  const role = useRole()
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal(total: number) {
      return `共 ${total} 条`
    }
  })
  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'page':
        setPagination(action.payload)
        return {
          ...state,
          pageSize: action.payload.pageSize,
          pageNum: action.payload.current
        }
      case 'params':
        setPagination({
          current: 1,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: pagination.showTotal
        })
        return {
          ...state,
          ...action.payload,
          pageNum: 1
        }
      default:
        throw new Error()
    }
  }
  const [data, setData] = useState([])
  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  const [roles, setRoles] = useState([])
  const [model, setModel] = useState([])
  const [initialValues, setInitialValues] = useState<any>({ status: 'Y' })
  const [visible, setVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [title, setTitle] = useState('新增账号')
  const [form] = useForm()
  const addAccount = () => {
    setTitle('新增账号')
    setInitialValues({ status: 'Y' })
    setVisible(true)
  }
  const queryAccount = () => {
    setTableLoading(true)
    request
      .get(api.system.account_list, { ...params })
      .then((res) => {
        setData(res.data.list)
        setPagination({
          ...pagination,
          total: res.data.total
        })
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  const queryRoleSelect = () => {
    request.get(api.common.select_role).then((res) => {
      setRoles(res.data)
    })
  }
  const queryModelSelect = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setModel(res.data)
    })
  }
  useEffect(queryAccount, [params])
  useEffect(queryRoleSelect, [])
  useEffect(queryModelSelect, [])
  const onCancel = () => {
    setConfirmLoading(false)
    setVisible(false)
  }
  const onFinish = (values: any) => {
    let params = {
      ...values
    }
    if (initialValues.id) {
      params.id = initialValues.id
    } else {
      params.pwd = '123456'
    }
    let qapi = initialValues.id ? api.system.account_update : api.system.account_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(initialValues.id ? '修改成功' : '创建成功')
        setVisible(false)
        dispatch({
          type: 'page',
          payload: {
            ...pagination
          }
        })
      })
      .finally(() => {
        setConfirmLoading(false)
      })
    console.log(values)
  }
  const handleDelete = (e: any, record: any) => {
    Modal.confirm({
      content: `确认删除${record.name}?`,
      centered: true,
      onOk(close) {
        let params = {
          id: record.id
        }
        return request
          .post(api.system.account_delete, params)
          .then((res) => {
            message.success('删除成功')
            dispatch({
              type: 'page',
              payload: {
                ...pagination,
                current: 1
              }
            })
          })
          .finally(() => {
            close()
          })
      }
    })
  }
  const handleReset = (e: any, row: any) => {
    const formRef = React.createRef<FormInstance>()
    const Reset = () => {
      return (
        <>
          <p>如未输入密码，则密码重置为 123456</p>
          <Form ref={formRef} autoComplete='off'>
            <Form.Item name='pwd' rules={passwordRules}>
              <Input placeholder='请输入重置密码' />
            </Form.Item>
          </Form>
        </>
      )
    }
    Modal.confirm({
      centered: true,
      onOk(close) {
        if (formRef.current) {
          formRef.current.validateFields().then(() => {
            let params = {
              id: row.id,
              pwd: formRef.current && (formRef.current.getFieldValue('pwd') || '123456')
            }
            setConfirmLoading(true)
            request
              .post(api.system.account_changePwd, params)
              .then(() => {
                message.success('重置密码成功')
                close()
              })
              .finally(() => {
                setConfirmLoading(false)
              })
          })
        }
      },
      okButtonProps: {
        htmlType: 'submit',
        loading: confirmLoading
      },
      content: <Reset />
    })
  }
  const handleEdit = (e: any, row: any) => {
    let params = {
      id: row.id
    }
    request.get(api.system.account_update, params).then((res) => {
      setTitle('编辑账号')
      setInitialValues(res.data)
      setVisible(true)
      form.resetFields()
    })
  }
  const columns = [
    {
      title: '账号',
      dataIndex: 'account'
    },
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '联系电话',
      dataIndex: 'phone'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '状态',
      dataIndex: 'statusName'
    },
    {
      title: '所属角色',
      dataIndex: 'roleNames'
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(text: any, record: any) {
        if (role.editRole) {
          return (
            <>
              <Button type='text' onClick={(e) => handleEdit(e, record)} size='small'>
                编辑
              </Button>
              <Button type='text' onClick={(e) => handleReset(e, record)} size='small'>
                重置密码
              </Button>
              {/* <Button type='text' onClick={(e) => handleDelete(e, record)} size='small'>
                删除
              </Button> */}
            </>
          )
        }
        return null
      }
    }
  ]
  const search = (params: any) => {
    dispatch({
      type: 'params',
      payload: params
    })
  }
  const pageChange = (page: any) => {
    dispatch({
      type: 'page',
      payload: page
    })
  }
  return (
    <>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        <Breadcrumb.Item>账号管理</Breadcrumb.Item>
      </Breadcrumb>
      <CardContainer>
        <FormForSearch jsonArr={formJson} search={search}></FormForSearch>
        {role.editRole ? (
          <Button type='primary' onClick={addAccount} style={{ marginBottom: '8px' }}>
            新增
          </Button>
        ) : null}
        <Table
          pagination={pagination}
          onChange={pageChange}
          rowKey='id'
          dataSource={data}
          columns={columns}
          size='middle'
          loading={tableLoading}></Table>
      </CardContainer>
      {visible ? (
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
            {!!initialValues.id ? (
              <Form.Item label={<FormLabel label='账号' />}>
                <span>{initialValues.account}</span>
              </Form.Item>
            ) : (
              <Form.Item label={<FormLabel label='账号' />} name='account' rules={accountRules}>
                <Input allowClear maxLength={30} placeholder='请输入账号' />
              </Form.Item>
            )}
            <Form.Item label={<FormLabel label='姓名' />} name='name' rules={[{ required: true }]}>
              <Input allowClear maxLength={30} placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label={<FormLabel label='电话' />} name='phone' rules={phoneRules}>
              <Input allowClear maxLength={30} placeholder='请输入电话' />
            </Form.Item>
            <Form.Item label={<FormLabel label='邮箱' />} name='email' rules={emailRules}>
              <Input allowClear maxLength={50} placeholder='请输入邮箱' />
            </Form.Item>
            <Form.Item
              label={<FormLabel label='角色' />}
              name='roleIds'
              rules={[{ required: true, message: '请选择角色' }]}>
              <Select placeholder='请选择角色'>
                {roles.map((el: any) => {
                  return (
                    <Option value={el.code} key={el.code}>
                      <div className={style.option}>
                        <span>{el.name}</span>
                        {/* <Tag
                          color={el.value === 'N' ? '#f50' : '#2db7f5'}
                          style={{ height: '22px' }}>
                          {el.value === 'N' ? '禁用' : '启用'}
                        </Tag> */}
                      </div>
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label={<FormLabel label='账号状态' />}
              name='status'
              rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value='Y'>启用</Radio>
                <Radio value='N'>禁用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={<FormLabel label='产品型号' />} name='modelIds'>
              <Select
                allowClear
                showArrow
                maxTagCount={3}
                maxTagTextLength={8}
                mode='multiple'
                placeholder='请选择该账号可操作的产品型号'>
                {model.map((el: any) => {
                  if (el.children && el.children.length) {
                    return (
                      <OptGroup label={el.name} key={el.id}>
                        {el.children.map((model: any) => {
                          return (
                            <Option value={model.id} key={model.id}>
                              {model.name}
                            </Option>
                          )
                        })}
                      </OptGroup>
                    )
                  }
                  return null
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  )
}

export default Account
