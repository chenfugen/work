import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Space, Table } from 'antd'
import style from './css/Chart.module.css'
import echart from 'echarts'
import ChartButtonGroup from './ChartButtonGroup'
import { ChartTypes, SamplingTypesEnum, SamplingTypesDisplayEnum } from '../../../config/Enum'
import classnames from 'classnames'
import SamplingDialog from './SamplingDialog'
import { samplingInfoInterface } from '../../../config/Interface'

const Chart = (props: any) => {
  const [samplingVisible, setSamplingVisible] = useState(false)
  const [chartType, setChartType] = useState(ChartTypes.DOT)
  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [samplingName, setSamplingName] = useState(
    props.defaultSampleInterval
      ? `采样方式：每${
          !(props.defaultSampleInterval % 60)
            ? props.defaultSampleInterval / 60
            : props.defaultSampleInterval
        }${!(props.defaultSampleInterval % 60) ? '分' : '秒'}取随机值`
      : '采样方式：原始数据'
  )
  const [samplingInfo, setSamplingInfo] = useState<samplingInfoInterface>({
    timeType: props.defaultSampleInterval && !(props.defaultSampleInterval % 60) ? 'm' : 's',
    statisticType: props.defaultSampleInterval ? SamplingTypesEnum.ANY : SamplingTypesEnum.RAW,
    sampleInterval: props.defaultSampleInterval
      ? !(props.defaultSampleInterval % 60)
        ? props.defaultSampleInterval / 60
        : props.defaultSampleInterval
      : 1
  })
  const echartIntance: any = useRef(null)
  const dom = useRef(null)
  const handleResize = useCallback(() => {
    if (echartIntance.current) {
      echartIntance.current.resize()
    }
  }, [])
  const handleSamplingInfo = (samplingInfo: samplingInfoInterface) => {
    setSamplingInfo(samplingInfo)
    if (samplingInfo.statisticType === SamplingTypesEnum.RAW) {
      setSamplingName('采样方式：原始数据')
    } else {
      let name = `采样方式: 每${samplingInfo.sampleInterval}${
        samplingInfo.timeType === 's' ? '秒' : '分钟'
      }取${SamplingTypesDisplayEnum[samplingInfo.statisticType]}`
      setSamplingName(name)
    }
    props.searchWithOutLoading(samplingInfo)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    if (!echartIntance.current && dom.current) {
      echartIntance.current = echart.init((dom.current as unknown) as HTMLDivElement)
    }
    echartIntance.current.setOption(props.option)
  }, [props.option])
  useEffect(() => {
    if (props.chartLoading) {
      echartIntance.current.showLoading({
        color: '#7E9AE8'
      })
    } else {
      echartIntance.current && echartIntance.current.hideLoading()
    }
  }, [props.chartLoading])
  useEffect(() => {
    setDataSource(props.rawTableData)
    console.log(props.rawTableData)
  }, [props.rawTableData])
  useEffect(() => {
    setColumns(props.rawColumns)
  }, [props.rawColumns])
  const typeChange = (type: ChartTypes) => {
    switch (type) {
      case ChartTypes.DOT:
        setChartType(type)
        break
      case ChartTypes.TABLE:
        setChartType(type)
        return
    }
    echartIntance.current.setOption(props.option)
  }
  const tableColumns = [
    {
      title: 'X轴',
      dataIndex: 'x'
    },
    {
      title: 'Y轴',
      dataIndex: 'y'
    },
    {
      title: '协方差',
      dataIndex: 'covariance'
    },
    {
      title: '相关系数',
      dataIndex: 'correlationCoefficient'
    },
    {
      title: '线性回归方程',
      dataIndex: 'linearRegressionA',
      render(val: number, row: any) {
        if (row.linearRegressionA || row.linearRegressionB) {
          return `y = ${row.linearRegressionA ? `${row.linearRegressionA}x` : ''} ${
            row.linearRegressionB < 0 ? '-' : '+'
          } ${row.linearRegressionB < 0 ? -row.linearRegressionB : row.linearRegressionB || ''}`
        }
        return null
      }
    }
  ]
  const exportTable = () => {
    props.exportTable && props.exportTable(samplingInfo)
  }
  return (
    <div className={classnames([style.chartContainer, props.border ? style.border : ''])}>
      <div className={style.chartHeader}>
        <h3>相关性分析</h3>
        <ChartButtonGroup
          chartType='scatter'
          typeChange={typeChange}
          defalutActive={ChartTypes.DOT}
        />
        <Space>
          <Button size='middle' onClick={() => setSamplingVisible(true)}>
            {samplingName}
          </Button>
          <Button size='middle' onClick={exportTable} id='export_movtion_start'>
            导出数据表
          </Button>
        </Space>
      </div>
      <div className={style.tabs}>
        <div
          ref={dom}
          className={classnames([
            style.chartSize,
            chartType === ChartTypes.TABLE ? style.hidden : ''
          ])}></div>
        <div
          className={classnames([
            style.chartSize,
            chartType === ChartTypes.TABLE ? '' : style.hidden
          ])}>
          <Table
            scroll={{ y: '515px' }}
            size='small'
            rowKey='_index'
            dataSource={dataSource}
            pagination={{
              defaultPageSize: 100,
              pageSizeOptions: ['100', '200'],
              showTotal(total: number) {
                return `共 ${total} 条`
              }
            }}
            columns={columns}></Table>
        </div>
      </div>
      <h3 className={style.tiny}>基本统计量</h3>
      <Table
        rowKey='_index'
        dataSource={props.tableData}
        columns={tableColumns}
        size='middle'
        pagination={false}
      />
      <SamplingDialog
        visible={samplingVisible}
        {...samplingInfo}
        defaultSampleInterval={props.defaultSampleInterval}
        selectProperty={props.selectProperty}
        setVisible={(visible: boolean) => setSamplingVisible(visible)}
        setSamplingInfo={handleSamplingInfo}
      />
    </div>
  )
}

export default Chart
