import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, Tooltip, Breadcrumb } from 'antd'
import CardContainer from '../../../components/CardContainer'
import FormForSearch from '../../../components/FormForSearch'
import request from '../../../request/request'
import api from '../../../api'
import MenuEdit from './MenuEdit'
const jsonArr = [
  {
    type: 'input',
    filed: 'name',
    placeholder: '菜单名称'
  }
]

const Menu = () => {
  const [data, setData] = useState([])
  const [type, setType] = useState('add')
  const [visible, setVisible] = useState(false)
  const [menuDetail, setMenuDetail] = useState('')
  const [tableLoading, setTableLoading] = useState(false)
  const queryMenu = () => {
    let params = {
      pageSize: 9999
    }
    setTableLoading(true)
    request
      .get(api.system.menu_list, params)
      .then((res: any) => {
        setData(res.data.list)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  useEffect(queryMenu, [])
  const handleDelete = (e: any, row: any) => {
    Modal.confirm({
      content: `确认删除${row.name}?`,
      centered: true,
      onOk() {
        let params = {
          id: row.id
        }
        return request.post(api.system.menu_delete, params).then((res) => {
          queryMenu()
        })
      }
    })
  }
  // 改变菜单排序
  const handleSort = (e: any, row: any, sort: number) => {
    let params = {
      id: row.id,
      num: sort
    }
    request.post(api.system.menu_sort, params).then(() => {
      message.success('调整成功')
      queryMenu()
    })
  }
  // 编辑菜单
  const handleEdit = (e: any, row: any) => {
    setType('edit')
    setMenuDetail(row)
    setVisible(true)
  }
  // 新增子菜单
  const handleAddSub = (e: any, row: any) => {
    setType('sub')
    setMenuDetail(row)
    setVisible(true)
  }
  const addMenu = () => {
    setType('add')
    setMenuDetail('')
    setVisible(true)
  }
  // 表格列配置
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: '200px'
    },
    {
      title: 'url',
      dataIndex: 'url',
      ellipsis: {
        showTitle: false
      },
      render: (url: string) => (
        <Tooltip placement='topLeft' title={url}>
          <span>{url}</span>
        </Tooltip>
      )
    },
    {
      title: '排序号',
      dataIndex: 'sort',
      width: '100px'
    },
    {
      title: '访问类型',
      dataIndex: 'accessType',
      width: '100px'
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      width: '100px'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '150',
      render(text: any, row: any) {
        return (
          <>
            <Button type='text' size='small' onClick={(e) => handleSort(e, row, -1)}>
              上移
            </Button>
            <Button type='text' size='small' onClick={(e) => handleSort(e, row, 1)}>
              下移
            </Button>
            <Button type='text' size='small' onClick={(e) => handleDelete(e, row)}>
              删除
            </Button>
            <Button type='text' size='small' onClick={(e) => handleEdit(e, row)}>
              编辑
            </Button>
            <Button type='text' size='small' onClick={(e) => handleAddSub(e, row)}>
              添加子菜单
            </Button>
          </>
        )
      }
    }
  ]
  return (
    <>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        <Breadcrumb.Item>菜单管理</Breadcrumb.Item>
      </Breadcrumb>
      <CardContainer>
        <FormForSearch jsonArr={jsonArr} search={queryMenu} />
        <Button type='primary' onClick={addMenu} style={{ marginBottom: '8px' }}>
          新增
        </Button>
        <Table
          rowKey='id'
          columns={columns}
          dataSource={data}
          size='middle'
          loading={tableLoading}
          pagination={false}
        />
        {visible && (
          <MenuEdit
            type={type}
            visible={visible}
            setVisible={setVisible}
            detail={menuDetail}
            queryMenu={queryMenu}
          />
        )}
      </CardContainer>
    </>
  )
}

export default Menu
