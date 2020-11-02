import React from 'react'
import { Table } from 'antd'

const ChartTable = (props: any) => {
  const columns = [
    {
      title: '设备唯一码',
      dataIndex: 'deviceCode'
    },
    {
      title: '属性',
      dataIndex: 'field'
    },
    {
      title: '最小值',
      dataIndex: 'min'
    },
    {
      title: '最大值',
      dataIndex: 'max'
    },
    {
      title: '中位数',
      dataIndex: 'median'
    },
    {
      title: '平均值',
      dataIndex: 'avg'
    },
    {
      title: '方差',
      dataIndex: 'variance'
    },
    {
      title: '标准差',
      dataIndex: 'standardDeviation'
    },
    {
      title: '偏度',
      dataIndex: 'skewness'
    }
  ]
  return (
    <Table
      rowKey='_index'
      dataSource={props.tableData}
      columns={props.columns || columns}
      size='middle'
      pagination={false}
    />
  )
}

export default ChartTable
