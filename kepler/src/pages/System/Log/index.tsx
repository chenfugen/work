import React, { useState, useEffect } from 'react'
import { Table, Breadcrumb } from 'antd'
import CardContainer from '../../../components/CardContainer'
import FormForSearch from '../../../components/FormForSearch'
import request from '../../../request/request'
import api from '../../../api'
import { TablePaginationConfig } from 'antd/lib/table'
import dayjs from 'dayjs'
const jsonArr = [
  {
    type: 'input',
    filed: 'userName',
    placeholder: '用户'
  },
  {
    type: 'datepicker',
    filed: 'time',
    placeholder: '时间',
    picker: 'date',
    props: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: {
        format: 'HH:mm'
      }
    }
  }
]
const Log = () => {
  const [data, setData] = useState([])
  const [queryParams, setParams] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    position: ['bottomRight'],
    current: 1,
    pageSize: 10,
    total: 100
  })
  const queryLog = () => {
    console.log('pagination', pagination)
    setTableLoading(true)
    let page = pagination
    let params = {
      ...queryParams,
      pageSize: page.pageSize,
      pageNum: page.current
    }
    request
      .get(api.system.log_list, params)
      .then((res) => {
        setData(res.data.list)
        setPagination({
          ...page,
          total: res.data.total
        })
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  useEffect(queryLog, [pagination.current, pagination.pageSize, queryParams])
  const columns = [
    {
      title: '操作用户',
      dataIndex: 'accountName',
      width: 150
    },
    {
      title: 'IP',
      dataIndex: 'ipAddr',
      width: 150
    },
    {
      title: '接口地址',
      dataIndex: 'uri'
    },
    {
      title: '请求类型',
      dataIndex: 'methodType',
      width: 150
    },
    {
      title: '操作模块',
      dataIndex: 'model',
      width: 150
    },
    {
      title: '操作时间',
      dataIndex: 'eventTime',
      width: 150,
      render(time: number) {
        return dayjs(time).format('YYYY-MM-DD HH:mm')
      }
    }
  ]
  const search = (params: any) => {
    if (params.time) {
      params.time = [
        params.time[0].format('YYYY-MM-DD HH:mm:ss'),
        params.time[1].format('YYYY-MM-DD HH:mm:ss')
      ]
    }
    setParams(params)
    // queryLog()
  }
  const handlePageChange = (pageObj: TablePaginationConfig) => {
    setPagination(pageObj)
    // queryLog(pageObj)
    // console.log(pageObj)
  }
  return (
    <>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        <Breadcrumb.Item>操作日志</Breadcrumb.Item>
      </Breadcrumb>
      <CardContainer>
        <FormForSearch jsonArr={jsonArr} search={search} />
        <Table
          scroll={{ scrollToFirstRowOnChange: true, y: 600 }}
          pagination={pagination}
          columns={columns}
          dataSource={data}
          size='middle'
          loading={tableLoading}
          rowKey='id'
          onChange={handlePageChange}
        />
      </CardContainer>
    </>
  )
}

export default Log
