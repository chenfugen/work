import React, { useState } from 'react'
import AnalysisForm from '../compontents/AnalysisForm'
import Chart from '../compontents/Chart'
import FChart from '../compontents/FChart'
import style from './index.module.css'
import request from '../../../request/request'
import { createMovtion } from '../../../components/Download/Movtion'
import api from '../../../api'
import { samplingInfoInterface } from '../../../config/Interface'
import { SamplingTypesEnum, DataTypeEnum } from '../../../config/Enum'
import { message } from 'antd'
import { useQuery } from '../../../hooks/common'
import Empty from '../compontents/Empty'
import Loading from '../compontents/Loading'
import { timeColumns, frequencyColumns } from './tableColumns'
import Big from 'big.js'

const Single = () => {
  let { modelId, deviceCode, modelCode } = useQuery()
  const [isEmpty, setIsEmpty] = useState(true)
  const [tableData, setTableData] = useState<any>([])
  const [rawTableData, setRawTableData] = useState<any>([])
  const [rawColumns, setRawColumns] = useState<any>([])
  const [chartOption, setChartOption] = useState<any>(null)
  const [params, setParams] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [timechartLoading, setTimeChartLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartType, setChartType] = useState('')
  const [selectProperty, setSelectProperty] = useState<any>('')
  const [defaultSampleInterval, setDefaultSampleInterval] = useState<any>(null)
  const queryChart = (params: any, property: any) => {
    return request.get(api.analysis.single_time, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const data = res.data
      if (data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      setDefaultSampleInterval(res.data.minSampleInterval)
      // 布尔和枚举类型后面加上描述,
      let enum1: any = {}
      if (property[0].type === DataTypeEnum.ENUM || property[0].type === DataTypeEnum.BOOLEAN) {
        try {
          enum1 = JSON.parse(property[0].enumJson)
        } catch (e) {}
      }
      setChartOption({
        xAxis: {
          type: 'category',
          data: data.group
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          // 为了在枚举类型或者布尔类型属性是显示描述
          formatter: function (params: any) {
            let res = [
              params[0].name,
              `${params[0].marker} ${params[0].seriesName}: ${params[0].data}${
                property[0].type === DataTypeEnum.ENUM || property[0].type === DataTypeEnum.BOOLEAN
                  ? ` - ${enum1[params[0].data]}`
                  : ''
              }`
            ]
            return res.join('<br/>')
          }
        },
        yAxis: [
          {
            type: property[0].type === DataTypeEnum.ENUM ? 'category' : 'value',
            name: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
            minInterval: property[0].type === DataTypeEnum.BOOLEAN ? 1 : 0,
            min: (value: any) => {
              return value.min
            },
            max: (value: any) => {
              return value.max
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(51,51,51,0.2)'
              }
            }
          }
        ],
        color: ['#537AE6', '#42B789'],
        grid: {
          left: '7%',
          right: '8%',
          bottom: '15%'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: data.group.length > 750 ? 7 : 60
          },
          {
            type: 'slider'
          }
        ],
        series: [
          {
            data: data.value,
            type: 'line',
            smooth: true,
            name: property[0].name,
            markLine: {
              silent: true,
              lineStyle: {
                color: '#f07373'
              },
              label: {
                position: 'start',
                distance: [20, 0]
              },
              symbol: ['none', 'none'],
              data: [data.alarmMin, data.alarmMax].filter(Boolean).map((el) => {
                return {
                  yAxis: el
                }
              })
            }
          }
        ]
      })
      const temData = data.group.map((time: string, i: number) => {
        return {
          time: time,
          [data.field]: data.value[i],
          _index: i
        }
      })
      const columns = [
        {
          title: '上报时间',
          dataIndex: 'time'
        },
        {
          title: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          dataIndex: data.field
        }
      ]
      setRawTableData(temData)
      setRawColumns(columns)
      let arr = [
        {
          _index: '0',
          field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          min: data.min,
          max: data.max,
          median: data.median,
          avg: data.avg,
          variance: data.variance,
          standardDeviation: data.standardDeviation,
          skewness: data.skewness
        }
      ]
      if (property[0].type === DataTypeEnum.BOOLEAN || property[0].type === DataTypeEnum.ENUM) {
        arr = [
          {
            _index: '0',
            field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
            min: '--',
            max: '--',
            median: '--',
            avg: '--',
            variance: '--',
            standardDeviation: '--',
            skewness: '--'
          }
        ]
      }
      setTableData(arr)
    })
  }
  const queryFrequencyChart = (params: any, property: any) => {
    return request.get(api.analysis.single_frequency, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const data = res.data
      if (data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      setChartOption({
        xAxis: {
          type: 'category',
          name: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          data: data.group
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter(params: any) {
            let obj = params[0]
            console.log(obj)
            if (
              property[0].type === DataTypeEnum.DOUBLE ||
              property[0].type === DataTypeEnum.FLOAT ||
              (property[0].type === DataTypeEnum.INTEGER && data.groupInterval)
            ) {
              return `[${obj.axisValue}, ${new Big(obj.axisValue).plus(data.groupInterval)}) <br> ${
                obj.value
              }`
            }
            return obj.axisValue + '<br/>' + obj.value
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '频率',
            splitLine: {
              lineStyle: {
                color: 'rgba(51,51,51,0.2)'
              }
            }
          }
        ],
        // color: ['#537AE6', '#42B789'],
        color: ['#7e9ae8'],
        grid: {
          left: '7%',
          right: '8%',
          bottom: '15%'
        },
        dataZoom: [
          {
            type: 'inside'
          },
          {
            type: 'slider'
          }
        ],
        series: [
          {
            data: data.value,
            type: 'bar',
            barMaxWidth: '80'
          }
        ]
      })
      const temData = data.value.map((probability: string, i: number) => {
        return {
          probability: probability,
          [data.field]: data.group[i],
          groupInterval: data.groupInterval,
          _index: i
        }
      })
      const columns = [
        {
          title: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          dataIndex: data.field,
          render(val: number, row: any) {
            if (
              property[0].type === DataTypeEnum.DOUBLE ||
              property[0].type === DataTypeEnum.FLOAT ||
              (property[0].type === DataTypeEnum.INTEGER && row.groupInterval)
            ) {
              return `[${val}, ${new Big(val).plus(row.groupInterval)})`
            }
            return val
          }
        },
        {
          title: '频率',
          dataIndex: 'probability'
        }
      ]
      setRawTableData(temData)
      setRawColumns(columns)
      let arr = [
        {
          _index: '0',
          field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          min: data.min,
          max: data.max,
          median: data.median,
          avg: data.avg,
          variance: data.variance,
          standardDeviation: data.standardDeviation,
          skewness: data.skewness
        }
      ]
      if (property[0].type === DataTypeEnum.BOOLEAN || property[0].type === DataTypeEnum.ENUM) {
        arr = [
          {
            _index: '0',
            field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
            min: '--',
            max: '--',
            median: '--',
            avg: '--',
            variance: '--',
            standardDeviation: '--',
            skewness: '--'
          }
        ]
      }
      setTableData(arr)
    })
  }
  const searchWithOutLoading = (samplingInfo: samplingInfoInterface) => {
    let queryParams = {
      ...params
    }
    if (samplingInfo.statisticType !== SamplingTypesEnum.RAW) {
      queryParams = {
        ...queryParams,
        statisticType: samplingInfo.statisticType,
        sampleInterval:
          samplingInfo.timeType === 's'
            ? samplingInfo.sampleInterval
            : (samplingInfo.sampleInterval || 0) * 60
      }
    }
    setTimeChartLoading(true)
    queryChart(queryParams, selectProperty).finally(() => {
      setTimeChartLoading(false)
    })
  }
  const searchFrequencyWithOutLoading = (groupInfo: any) => {
    let queryParams = {
      ...params
    }
    if (groupInfo.groupInterval && groupInfo.groupInterval > 0) {
      queryParams.groupInterval = groupInfo.groupInterval
    }
    setChartLoading(true)
    queryFrequencyChart(queryParams, selectProperty).finally(() => {
      setChartLoading(false)
    })
  }
  const exportFrequencyTable = (groupInfo: any) => {
    let queryParams = {
      ...params
    }
    if (groupInfo.groupInterval && groupInfo.groupInterval > 0) {
      queryParams.groupInterval = groupInfo.groupInterval
    }
    request.get(api.analysis.single_frequency_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const timeSearch = (params: any, property: any) => {
    setParams(params)
    setIsEmpty(false)
    setLoading(true)
    setTimeChartLoading(true)
    queryChart(params, property)
      .then(() => {
        setChartType('time')
      })
      .catch(() => {
        setIsEmpty(true)
      })
      .finally(() => {
        setTimeChartLoading(false)
        setLoading(false)
      })
  }
  const frequencySearch = (params: any, property: any) => {
    setParams(params)
    setIsEmpty(false)
    setLoading(true)
    setChartLoading(true)
    queryFrequencyChart(params, property)
      .then(() => {
        setChartType('frequency')
      })
      .catch(() => {
        setIsEmpty(true)
      })
      .finally(() => {
        setLoading(false)
        setChartLoading(false)
      })
  }
  const exportTable = (samplingInfo: samplingInfoInterface) => {
    let queryParams = {
      ...params
    }
    if (samplingInfo.statisticType !== SamplingTypesEnum.RAW) {
      queryParams = {
        ...queryParams,
        statisticType: samplingInfo.statisticType,
        sampleInterval:
          samplingInfo.timeType === 's'
            ? samplingInfo.sampleInterval
            : (samplingInfo.sampleInterval || 0) * 60
      }
    }
    request.get(api.analysis.single_time_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  return (
    <div className={style.container}>
      <AnalysisForm
        initValues={{
          modelId: modelId,
          deviceCode: deviceCode,
          modelCode: modelCode
        }}
        type='single'
        timeSearch={timeSearch}
        frequencySearch={frequencySearch}
        chartLoading={chartLoading}
        setSelectProperty={setSelectProperty}
        timechartLoading={timechartLoading}
      />
      {isEmpty ? (
        <Empty />
      ) : loading ? (
        <Loading />
      ) : chartType === 'time' ? (
        <Chart
          exportTable={exportTable}
          searchWithOutLoading={searchWithOutLoading}
          chartLoading={timechartLoading}
          tableData={tableData}
          columns={timeColumns}
          rawTableData={rawTableData}
          rawColumns={rawColumns}
          option={chartOption}
          selectProperty={selectProperty}
          defaultSampleInterval={defaultSampleInterval}
        />
      ) : chartType === 'frequency' ? (
        <FChart
          exportTable={exportFrequencyTable}
          searchWithOutLoading={searchFrequencyWithOutLoading}
          chartLoading={chartLoading}
          tableData={tableData}
          columns={frequencyColumns}
          rawTableData={rawTableData}
          rawColumns={rawColumns}
          selectProperty={selectProperty}
          option={chartOption}
        />
      ) : null}
    </div>
  )
}

export default Single
