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
import Big from 'big.js'
const timeColumns = [
  {
    title: '对比对象',
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
  }
]
const frequencyColumns = [
  {
    title: '对比对象',
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
const Single = () => {
  let { modelId, deviceCode, modelCode } = useQuery()
  const [isEmpty, setIsEmpty] = useState(true)
  const [tableData, setTableData] = useState<any>([])
  const [rawTableData, setRawTableData] = useState<any>([])
  const [rawColumns, setRawColumns] = useState<any>([])
  const [params, setParams] = useState<any>({})
  const [chartOption, setChartOption] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timechartLoading, setTimeChartLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartType, setChartType] = useState('')
  const [selectProperty, setSelectProperty] = useState<any>('')
  const [defaultSampleInterval, setDefaultSampleInterval] = useState<any>(null)
  const queryChart = (params: any, property: any) => {
    return request.get(api.analysis.comparison_time, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const group = res.data.group
      const arr = res.data.oneDimensionAnalyse
      if (group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      if (arr[0].value.length === 0) {
        message.warning(`${property[0].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      if (arr[1].value.length === 0) {
        message.warning(`${property[1].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      setDefaultSampleInterval(res.data.minSampleInterval)
      // 布尔和枚举类型后面加上描述, 对应两个参数
      let enum1: any = {}
      if (property[0].type === DataTypeEnum.ENUM || property[0].type === DataTypeEnum.BOOLEAN) {
        try {
          enum1 = JSON.parse(property[0].enumJson)
        } catch (e) {}
      }
      setChartOption({
        xAxis: {
          type: 'category',
          data: group
        },
        legend: {
          data: property.deviceCodeList,
          show: true,
          selectedMode: false
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
              }`,
              `${params[1].marker} ${params[1].seriesName}: ${params[1].data}${
                property[0].type === DataTypeEnum.ENUM || property[0].type === DataTypeEnum.BOOLEAN
                  ? ` - ${enum1[params[1].data]}`
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
            end: group.length > 750 ? 7 : 60
          },
          {
            type: 'slider'
          }
        ],
        series: arr.map((el: any, index: number) => {
          return {
            data: el.value,
            type: 'line',
            smooth: true,
            name: el.deviceCode,
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
              data: [el.alarmMin, el.alarmMax].filter(Boolean).map((el: any, index: number) => {
                return {
                  yAxis: el,
                  valueIndex: index
                }
              })
            }
          }
        })
      })
      const tableRawData = group.map((time: string, i: number) => {
        return {
          time: time,
          [arr[0].deviceCode]: arr[0].value[i],
          [arr[1].deviceCode]: arr[1].value[i],
          unit: property[0].unit,
          _index: i
        }
      })
      const columns = [
        {
          title: '上报时间',
          dataIndex: 'time'
        },
        {
          title: property[0].name,
          dataIndex: 'unit'
        },
        ...arr.map((el: any) => {
          return {
            title: el.deviceCode,
            dataIndex: el.deviceCode
          }
        })
      ]
      setRawTableData(tableRawData)
      setRawColumns(columns)
      setTableData(
        arr.map((el: any, index: number) => {
          if (property[0].type === DataTypeEnum.BOOLEAN || property[0].type === DataTypeEnum.ENUM) {
            return {
              _index: index,
              field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
              min: '--',
              max: '--',
              median: '--',
              avg: '--',
              variance: '--',
              standardDeviation: '--',
              skewness: '--',
              deviceCode: el.deviceCode
            }
          }
          return {
            _index: index,
            field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
            min: el.min,
            max: el.max,
            median: el.median,
            avg: el.avg,
            variance: el.variance,
            standardDeviation: el.standardDeviation,
            skewness: el.skewness,
            deviceCode: el.deviceCode
          }
        })
      )
    })
  }
  const queryFrequencyChart = (params: any, property: any) => {
    return request.get(api.analysis.comparison_frequency, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const group = res.data.group
      const arr = res.data.oneDimensionAnalyse
      if (res.data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      setChartOption({
        xAxis: {
          type: 'category',
          name: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          data: group
        },
        legend: {
          show: true,
          selectedMode: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            if (
              property[0].type === DataTypeEnum.DOUBLE ||
              property[0].type === DataTypeEnum.FLOAT ||
              (property[0].type === DataTypeEnum.INTEGER && res.data.groupInterval)
            ) {
              let relVal =
                `[${params[0].axisValue}, ${new Big(params[0].axisValue).plus(
                  res.data.groupInterval
                )})` + '<br/>'
              relVal += params[0].marker + params[0].seriesName + ' : ' + params[0].value + '<br/>'
              relVal += params[1].marker + params[1].seriesName + ' : ' + -params[1].value + '<br/>'
              return relVal
            }
            let relVal = params[0].name + '<br/>'
            relVal += params[0].marker + params[0].seriesName + ' : ' + params[0].value + '<br/>'
            relVal += params[1].marker + params[1].seriesName + ' : ' + -params[1].value + '<br/>'
            return relVal
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
            },
            axisLabel: {
              formatter(value: number) {
                return Math.abs(value)
              }
            }
          }
        ],
        color: ['#7e9ae8', '#7dd6b3'],
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
        series: arr.map((el: any, index: number) => {
          return {
            data: index ? el.value.map((el: number) => -1 * el) : el.value,
            type: 'bar',
            name: el.deviceCode,
            stack: '0',
            barMaxWidth: '80'
          }
        })
      })
      const temData = group.map((val: string, i: number) => {
        return {
          val: val,
          [arr[0].deviceCode]: arr[0].value[i],
          [arr[1].deviceCode]: arr[1].value[i],
          groupInterval: res.data.groupInterval,
          _index: i
        }
      })
      const columns = [
        {
          title: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          dataIndex: 'val',
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
          title: arr[0].deviceCode,
          dataIndex: arr[0].deviceCode
        },
        {
          title: arr[1].deviceCode,
          dataIndex: arr[1].deviceCode
        }
      ]
      setRawTableData(temData)
      setRawColumns(columns)
      setTableData(
        arr.map((el: any, index: number) => {
          if (property[0].type === DataTypeEnum.BOOLEAN || property[0].type === DataTypeEnum.ENUM) {
            return {
              _index: index,
              field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
              min: '--',
              max: '--',
              median: '--',
              avg: '--',
              variance: '--',
              standardDeviation: '--',
              skewness: '--',
              deviceCode: el.deviceCode
            }
          }
          return {
            _index: index,
            field: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
            min: el.min,
            max: el.max,
            median: el.median,
            avg: el.avg,
            variance: el.variance,
            standardDeviation: el.standardDeviation,
            skewness: el.skewness,
            deviceCode: el.deviceCode
          }
        })
      )
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
    request.get(api.analysis.comparison_time_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
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
    request.get(api.analysis.comparison_frequency_export, queryParams).then((res) => {
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
  return (
    <div className={style.container}>
      <AnalysisForm
        initValues={{
          modelId: modelId,
          deviceCode: deviceCode,
          modelCode: modelCode
        }}
        type='contrast'
        timeSearch={timeSearch}
        frequencySearch={frequencySearch}
        chartLoading={chartLoading}
        timechartLoading={timechartLoading}
        setSelectProperty={setSelectProperty}
      />
      {isEmpty ? (
        <Empty />
      ) : loading ? (
        <Loading />
      ) : chartType === 'time' ? (
        <Chart
          searchWithOutLoading={searchWithOutLoading}
          exportTable={exportTable}
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
          searchWithOutLoading={searchFrequencyWithOutLoading}
          exportTable={exportFrequencyTable}
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
