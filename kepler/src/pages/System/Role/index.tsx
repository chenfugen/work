import React, { useState, useEffect, useReducer } from 'react'
import { Table, Button, Modal, message, Breadcrumb } from 'antd'
import CardContainer from '../../../components/CardContainer'
import FormForSearch from '../../../components/FormForSearch'
import request from '../../../request/request'
import api from '../../../api'
import RoleEdit from './RoleEdit'
import RoleDetail from './RoleDetail'
import { useRole } from '../Model/hooks'
const format = (arr: any) => {
  arr.forEach((el: any) => {
    if (el.accessType === 'menu') {
      el.disabled = true
    }
  })
  let queue = [...arr]
  while (queue.length) {
    let node = queue.shift()
    node.key = node.id
    for (let i = 0; i < node.children.length; i++) {
      queue.push(node.children[i])
    }
  }
  return arr
}
const jsonArr = [
  {
    type: 'input',
    filed: 'name',
    placeholder: '角色名称'
  }
]
const initalParams = {
  pageSize: 10,
  pageNum: 1
}
const Role = () => {
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
        console.log(state)
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
  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  const [data, setData] = useState([])
  const [treeData, setTreeData] = useState<any>([])
  const [visible, setVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [roleDetail, setRoleDetail] = useState('')
  const queryRole = () => {
    setTableLoading(true)
    request
      .get(api.system.role_list, { ...params })
      .then((res: any) => {
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
  useEffect(queryRole, [params])
  const handleDelete = (e: any, record: any) => {
    let params = {
      id: record.id
    }
    request.post(api.system.role_delete_pre, params).then((res) => {
      Modal.confirm({
        content: `确认删除${record.name}?`,
        centered: true,
        onOk(close) {
          return request
            .post(api.system.role_delete, params)
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
    })
  }

  // 编辑角色
  const handleEdit = (e: any, row: any) => {
    queryPermission(row.id).then(() => {
      setRoleDetail(row)
      setVisible(true)
    })
  }
  // 角色详情
  const handleDetail = (e: any, row: any) => {
    queryPermission(row.id).then(() => {
      setRoleDetail(row)
      setDetailVisible(true)
    })
  }
  // 设置权限
  const queryPermission = (id?: string) => {
    const params = {
      roleId: id
    }
    return request.get(api.system.role_menu_tree, params).then((res) => {
      setTreeData(format(res.data))
      console.log(format(res.data))
    })
  }
  const addRole = () => {
    queryPermission().then(() => {
      setRoleDetail('')
      setVisible(true)
    })
  }
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
  // 表格列配置
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    // {
    //   title: '状态',
    //   dataIndex: 'statusName'
    // },
    {
      title: '备注',
      dataIndex: 'description'
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '150',
      render(text: any, record: any) {
        if (role.editRole) {
          return (
            <>
              <Button type='text' size='small' onClick={(e) => handleEdit(e, record)}>
                编辑
              </Button>
              <Button type='text' size='small' onClick={(e) => handleDetail(e, record)}>
                详情
              </Button>
              <Button type='text' size='small' onClick={(e) => handleDelete(e, record)}>
                删除
              </Button>
            </>
          )
        }
        return null
      }
    }
  ]
  return (
    <>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        <Breadcrumb.Item>角色管理</Breadcrumb.Item>
      </Breadcrumb>
      <CardContainer>
        <FormForSearch jsonArr={jsonArr} search={search} />
        {role.editRole ? (
          <Button type='primary' onClick={addRole} style={{ marginBottom: '8px' }}>
            新增
          </Button>
        ) : null}
        <Table
          rowKey='id'
          onChange={pageChange}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          size='middle'
          loading={tableLoading}></Table>
        {visible && (
          <RoleEdit
            visible={visible}
            setVisible={setVisible}
            detail={roleDetail}
            queryRole={queryRole}
            treeData={treeData}
          />
        )}
        {detailVisible && (
          <RoleDetail
            visible={detailVisible}
            setVisible={setDetailVisible}
            detail={roleDetail}
            treeData={treeData}
          />
        )}
      </CardContainer>
    </>
  )
}

export default Role
