import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Select } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import { formatTime } from '../../../utils/utils'
import style from './css/ParamsTable.module.css'
const { Option } = Select
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const AccountTable = (props: any) => {
  const [data, setData] = useState([])
  const [total, seTtotal] = useState(0)
  const [accountIds, setAccountIds] = useState([])
  const [visible, setVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const queryAccount = () => {
    let params = {
      modelId: props.id
    }
    setTableLoading(true)
    request
      .get(api.system.model_detail_account, params)
      .then((res) => {
        setData(res.data)
        seTtotal(res.data.length)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  const queryAccountIds = () => {
    if (visible === false) return
    let params = {
      modelId: props.id
    }
    request.get(api.common.select_account, params).then((res) => {
      setAccountIds(res.data)
    })
  }
  useEffect(queryAccount, [])
  useEffect(queryAccountIds, [visible])
  const handleDelete = (e: any, row: any) => {
    Modal.confirm({
      content: `确认删除${row.name}?`,
      centered: true,
      onOk() {
        let params = {
          id: row.id
        }
        return request.post(api.system.model_detail_account_delete, params).then((res) => {
          queryAccount()
        })
      }
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
      title: '角色',
      dataIndex: 'roleNames'
    },
    {
      title: '关联时间',
      dataIndex: 'bindTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '最后上线时间',
      dataIndex: 'lastLoginTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(text: any, record: any) {
        if (props.role.editRole) {
          return (
            <>
              <Button type='text' onClick={(e) => handleDelete(e, record)} size='small'>
                删除
              </Button>
            </>
          )
        }
        return null
      }
    }
  ]
  const uploadScript = () => {
    setVisible(true)
  }
  const handleOk = () => {
    form.submit()
  }
  const onCancel = () => {
    setVisible(false)
  }
  const onFinish = (values: any) => {
    let params = {
      modelId: props.id,
      ...values
    }
    setConfirmLoading(true)
    request
      .post(api.system.model_detail_account_add, params)
      .then(() => {
        queryAccount()
        setVisible(false)
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }
  return (
    <>
      {props.role.editRole ? (
        <Button type='primary' onClick={uploadScript} style={{ marginBottom: '16px' }}>
          新增相关人员
        </Button>
      ) : null}
      <Table
        rowKey='id'
        dataSource={data}
        columns={columns}
        size='middle'
        pagination={false}
        loading={tableLoading}></Table>
      <div className={style.total}>共 {total} 条</div>
      <Modal
        visible={visible}
        title='新增相关人员'
        maskClosable={false}
        onCancel={onCancel}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        destroyOnClose>
        <Form
          {...formLayout}
          autoComplete='off'
          onFinish={onFinish}
          form={form}
          scrollToFirstError
          preserve={false}>
          <Form.Item
            label='相关人员'
            name='accountIds'
            rules={[{ required: true, message: '请选择相关人员' }]}>
            <Select allowClear showArrow mode='multiple' placeholder='请选择相关人员'>
              {accountIds.map((el: any) => {
                return <Option value={el.code}>{el.name}</Option>
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AccountTable
