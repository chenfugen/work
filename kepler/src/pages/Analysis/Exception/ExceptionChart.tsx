import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Space, Table } from 'antd'
import style from './index.module.css'
import echart from 'echarts'
import ChartButtonGroup from '../compontents/ChartButtonGroup'
import { ChartTypes } from '../../../config/Enum'
const option: any = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  color: '#537AE6',
  dataZoom: [
    {
      start: 80,
      type: 'inside'
    },
    {
      start: 80
    }
  ],
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }
  ]
}
const Chart = (props: any) => {
  const echartIntance: any = useRef(null)
  const dom = useRef(null)
  const handleResize = useCallback(() => {
    if (echartIntance.current) {
      echartIntance.current.resize()
    }
  }, [])
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    if (!echartIntance.current && dom.current) {
      echartIntance.current = echart.init((dom.current as unknown) as HTMLDivElement)
    }
    if (props.chartData.time && props.chartData.data) {
      option.xAxis.data = props.chartData.time
      option.series[0].data = props.chartData.data
      echartIntance.current.setOption(option)
    }
  }, [props.chartData])
  const typeChange = (type: ChartTypes) => {
    switch (type) {
      case ChartTypes.BAR:
        option.series[0].type = 'bar'
        break
      case ChartTypes.TABLE:
        option.series[0].areaStyle = {}
        break
    }
    echartIntance.current.setOption(option)
  }
  const columns = [
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
    <div className={style.chartContainer}>
      <div className={style.chartHeader}>
        <ChartButtonGroup chartType='time' typeChange={typeChange} />
        <Space>
          <Button size='middle' id='export_movtion_start'>
            导出数据表
          </Button>
        </Space>
      </div>
      <div ref={dom} style={{ width: '100%', height: '390px' }}></div>
      <h3 className={style.tiny}>基本统计量</h3>
      <Table
        rowKey='id'
        dataSource={props.tableData}
        columns={columns}
        size='middle'
        pagination={false}
      />
    </div>
  )
}

export default Chart
