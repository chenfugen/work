import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, message, Space } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import CommandEdit from './CommandEdit'
import { formatTime } from '../../../utils/utils'
import style from './css/ParamsTable.module.css'

const CommandTable = (props: any) => {
  const [data, setData] = useState([])
  const [total, seTtotal] = useState(0)
  const [commandDetail, setCommandDetail] = useState('')
  const [visible, setVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const queryCommand = () => {
    let params = {
      modelId: props.id
    }
    setTableLoading(true)
    request
      .get(api.system.model_detail_command, params)
      .then((res) => {
        setData(res.data)
        seTtotal(res.data.length)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  const queryCommandDetail = (id: string) => {
    let params = {
      id: id
    }
    return request.get(api.system.model_detail_command_update, params).then((res) => {
      try {
        const obj = JSON.parse(res.data.commands)
        const arr = []
        for (const key in obj) {
          const tem = {
            name: key,
            value: obj[key]
          }
          arr.push(tem)
        }
        res.data.commands = arr
      } catch (e) {
        res.data.commands = []
      }
      setCommandDetail(res.data)
    })
  }
  useEffect(queryCommand, [])
  const handleClick = () => {
    setCommandDetail('')
    setVisible(true)
  }
  const handleDelete = (e: any, row: any) => {
    Modal.confirm({
      content: `确认删除${row.name}?`,
      centered: true,
      onOk() {
        let params = {
          id: row.id
        }
        return request.post(api.system.model_detail_command_delete, params).then(() => {
          queryCommand()
          props.queryDetail()
          message.success('删除成功')
        })
      }
    })
  }
  const handleEdit = (e: any, row: any) => {
    Promise.all([queryCommandDetail(row.id)]).then(() => {
      setVisible(true)
    })
  }
  const columns = [
    {
      title: '指令编码',
      dataIndex: 'param'
    },
    {
      title: '指令名称',
      dataIndex: 'name'
    },
    {
      title: '指令组',
      dataIndex: 'commands',
      render(val: string) {
        if (val === '{}') {
          return null
        }
        return val
      }
    },
    {
      title: '状态',
      dataIndex: 'statusName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render(_: any, row: any) {
        if (props.role.editRole) {
          return (
            <>
              <Button type='text' onClick={(e) => handleEdit(e, row)} size='small'>
                编辑
              </Button>
              <Button type='text' onClick={(e) => handleDelete(e, row)} size='small'>
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
      {props.role.editRole ? (
        <Space style={{ marginBottom: '16px' }}>
          <Button type='primary' onClick={handleClick}>
            新增指令
          </Button>
        </Space>
      ) : null}
      <Table
        pagination={false}
        dataSource={data}
        columns={columns}
        rowKey='id'
        size='middle'
        loading={tableLoading}
      />
      <div className={style.total}>共 {total} 条</div>
      {visible && (
        <CommandEdit
          visible={visible}
          setVisible={setVisible}
          row={{ modelId: props.id }}
          detail={commandDetail}
          queryCommand={queryCommand}
          queryDetail={() => props.queryDetail()}
        />
      )}
    </>
  )
}

export default CommandTable
