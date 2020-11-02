import React, { useEffect, useState, useReducer } from 'react'
import { Button, message, Table } from 'antd'
import request from '../../request/request'
import api from '../../api'
import { formatTime } from '../../utils/utils'
import FormForSearch from '../../components/FormForSearch'
import style from './css/ExportBtn.module.css'
import { createMovtion } from '../../components/Download/Movtion'

const initalPage = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total: number) {
    return `共 ${total} 条`
  }
}

const initalParams = {
  pageSize: 10,
  pageNum: 1
}

const ParamsTable = (props: any) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState<any>(initalPage)
  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'model':
        setPagination(initalPage)
        return {
          code: action.payload.code,
          deviceCode: action.payload.deviceCode,
          ...initalParams
        }
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
  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const queryOlineRecord = () => {
    if (params.code && params.deviceCode) {
      let queryParams = {
        ...params
      }
      setTableLoading(true)
      request
        .get(api.device.device_detail_online_list, queryParams)
        .then((res) => {
          res.data.list.forEach((el: any, index: number) => {
            el._index = index
          })
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
  }
  useEffect(() => {
    if (props.code && props.deviceCode) {
      dispatch({
        type: 'model',
        payload: {
          code: props.code,
          deviceCode: props.deviceCode
        }
      })
    }
  }, [props])
  useEffect(queryOlineRecord, [params])
  const handleExport = () => {
    let queryParams = {
      ...params
    }
    request.get(api.device.device_detail_online_export, queryParams).then(() => {
      createMovtion('export_movtion_start_online', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const search = (params: any) => {
    if (params.time) {
      params.time = [
        params.time[0].format('YYYY-MM-DD HH:mm:ss'),
        params.time[1].format('YYYY-MM-DD HH:mm:ss')
      ]
    }
    dispatch({
      type: 'params',
      payload: params
    })
  }
  const handlePageChange = (page: any) => {
    dispatch({
      type: 'page',
      payload: page
    })
  }
  const formJson = [
    {
      type: 'select',
      filed: 'action',
      placeholder: '动作',
      options: [
        {
          code: 'online',
          name: '上线'
        },
        {
          code: 'offline',
          name: '下线'
        }
      ]
    },
    {
      type: 'datepicker',
      filed: 'time',
      picker: 'date',
      props: {
        format: 'YYYY-MM-DD HH:mm',
        showTime: {
          format: 'HH:mm'
        }
      }
    }
  ]
  const columns = [
    {
      title: '时间',
      dataIndex: 'uploadTime',
      render(time: number) {
        return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '动作',
      dataIndex: 'onlineEnum'
    }
  ]
  return (
    <>
      <div style={{ position: 'relative' }}>
        <FormForSearch jsonArr={formJson} search={search} />
        <Button
          type='primary'
          onClick={handleExport}
          className={style.exportBtn}
          id='export_movtion_start_online'>
          导出
        </Button>
      </div>
      <Table
        loading={tableLoading}
        rowKey='_index'
        dataSource={data}
        columns={columns}
        onChange={handlePageChange}
        size='middle'
        pagination={pagination}
      />
    </>
  )
}

export default ParamsTable
