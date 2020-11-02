import React, { useState } from 'react'
import AnalysisForm from '../compontents/AnalysisForm'
import Chart from '../compontents/Chart'
import DotChart from '../compontents/DotChart'
import style from './index.module.css'
import request from '../../../request/request'
import { createMovtion } from '../../../components/Download/Movtion'
import api from '../../../api'
import emptyImgUrl from '../../../assets/blank_no_chart.png'
import { samplingInfoInterface } from '../../../config/Interface'
import { SamplingTypesEnum, DataTypeEnum } from '../../../config/Enum'
import { Spin, message } from 'antd'
import { useQuery } from '../../../hooks/common'
const Empty = () => {
  return (
    <div className={style.empty}>
      <img src={emptyImgUrl} alt='' />
      <span className={style.emptyTips}>请在左侧选择数据进行分析</span>
    </div>
  )
}
const Loading = () => {
  return (
    <div className={style.empty}>
      <Spin size='large' />
      <span className={style.emptyTips}>正在生成图表，请稍候…</span>
    </div>
  )
}
const timeColumns = [
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
const Multiple = () => {
  let { modelId, deviceCode, modelCode } = useQuery()
  const [isEmpty, setIsEmpty] = useState(true)
  const [tableData, setTableData] = useState<any>([])
  const [rawTableData, setRawTableData] = useState<any>([])
  const [rawColumns, setRawColumns] = useState<any>([])
  const [params, setParams] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [chartOption, setChartOption] = useState<any>(null)
  const [timechartLoading, setTimeChartLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartType, setChartType] = useState('')
  const [selectProperty, setSelectProperty] = useState<any>('')
  const [defaultSampleInterval, setDefaultSampleInterval] = useState<any>(null)
  const queryChart = (params: any, property: any) => {
    return request.get(api.analysis.multiple_time, params).then((res) => {
      if (!res.data || res.data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const group = res.data.group
      const arr = res.data.oneDimensionAnalyse
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
      let enum2: any = {}
      if (property[0].type === DataTypeEnum.ENUM || property[0].type === DataTypeEnum.BOOLEAN) {
        try {
          enum1 = JSON.parse(property[0].enumJson)
        } catch (e) {}
      }
      if (property[1].type === DataTypeEnum.ENUM || property[1].type === DataTypeEnum.BOOLEAN) {
        try {
          enum2 = JSON.parse(property[1].enumJson)
        } catch (e) {}
      }
      setChartOption({
        xAxis: {
          type: 'category',
          data: group
        },
        legend: {
          data: [property[0].name, property[1].name],
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
                property[1].type === DataTypeEnum.ENUM || property[1].type === DataTypeEnum.BOOLEAN
                  ? ` - ${enum2[params[1].data]}`
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
          },
          {
            type: property[1].type === DataTypeEnum.ENUM ? 'category' : 'value',
            name: `${property[1].name}${property[1].unit ? `(${property[1].unit})` : ''}`,
            minInterval: property[1].type === DataTypeEnum.BOOLEAN ? 1 : 0,
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
            yAxisIndex: index,
            name: property[index].name,
            markLine: {
              silent: true,
              lineStyle: {
                color: '#f07373'
              },
              label: {
                position: index === 0 ? 'start' : 'end',
                distance: [20, 0]
              },
              symbol: ['none', 'none'],
              data: [el.alarmMin, el.alarmMax].filter(Boolean).map((el: any, index: number) => {
                return {
                  yAxis: el
                }
              })
            }
          }
        })
      })
      const tableRawData = group.map((time: string, i: number) => {
        return {
          time: time,
          [arr[0].field]: arr[0].value[i],
          [arr[1].field]: arr[1].value[i],
          _index: i
        }
      })
      const columns = [
        {
          title: '上报时间',
          dataIndex: 'time'
        },
        ...arr.map((el: any, index: number) => {
          return {
            title: `${property[index].name}${
              property[index].unit ? `(${property[index].unit})` : ''
            }`,
            dataIndex: el.field
          }
        })
      ]
      setRawTableData(tableRawData)
      setRawColumns(columns)
      setTableData(
        arr.map((el: any, index: number) => {
          if (
            property[index].type === DataTypeEnum.BOOLEAN ||
            property[index].type === DataTypeEnum.ENUM
          ) {
            return {
              _index: index,
              field: `${property[index].name}${
                property[index].unit ? `(${property[index].unit})` : ''
              }`,
              min: '--',
              max: '--',
              median: '--',
              avg: '--',
              variance: '--',
              standardDeviation: '--',
              skewness: '--'
            }
          }
          return {
            _index: index,
            field: `${property[index].name}${
              property[index].unit ? `(${property[index].unit})` : ''
            }`,
            min: el.min,
            max: el.max,
            median: el.median,
            avg: el.avg,
            variance: el.variance,
            standardDeviation: el.standardDeviation,
            skewness: el.skewness
          }
        })
      )
    })
  }
  const queryCorrelationChart = (params: any, property: any) => {
    return request.get(api.analysis.multiple_correlation, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      setDefaultSampleInterval(res.data.minSampleInterval)
      const [xKey, yKey] = params.propertyList
      const xData = res.data[xKey]
      const yData = res.data[yKey]
      if (xData.length === 0) {
        message.warning(`${property[0].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      if (yData.length === 0) {
        message.warning(`${property[1].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      let markLine = {}
      let calcMinY: any = ''
      let calcMaxY: any = ''
      if (res.data.correlationCoefficient && res.data.correlationCoefficient > 0.6) {
        if (res.data.linearRegressionA || res.data.linearRegressionB) {
          let expression = `y = ${
            res.data.linearRegressionA ? `${res.data.linearRegressionA}x` : ''
          } ${res.data.linearRegressionB < 0 ? '-' : '+'} ${
            res.data.linearRegressionB < 0
              ? -res.data.linearRegressionB
              : res.data.linearRegressionB || ''
          }`
          let minX = Math.min(...xData)
          let maxX = Math.max(...xData)
          calcMinY = minX * res.data.linearRegressionA + res.data.linearRegressionB
          calcMaxY = maxX * res.data.linearRegressionA + res.data.linearRegressionB
          console.log(minX, maxX, calcMinY, calcMaxY)
          markLine = {
            animation: false,
            label: {
              formatter: expression,
              align: 'right'
            },
            lineStyle: {
              type: 'solid'
            },
            tooltip: {
              formatter: expression
            },
            data: [
              [
                {
                  coord: [minX, calcMinY],
                  symbol: 'none'
                },
                {
                  coord: [maxX, calcMaxY],
                  symbol: 'none'
                }
              ]
            ]
          }
        }
      }
      setChartOption({
        xAxis: {
          type: property[0].type === DataTypeEnum.ENUM ? 'category' : 'value',
          name: `${property[0].name}${property[0].unit ? `(${property[0].unit})` : ''}`,
          minInterval: property[0].type === DataTypeEnum.BOOLEAN ? 1 : 0,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        grid: {
          left: '7%',
          right: '8%',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: ({c})'
        },
        yAxis: {
          type: property[1].type === DataTypeEnum.ENUM ? 'category' : 'value',
          name: `${property[1].name}${property[1].unit ? `(${property[1].unit})` : ''}`,
          minInterval: property[1].type === DataTypeEnum.BOOLEAN ? 1 : 0,
          splitLine: {
            lineStyle: {
              color: 'rgba(51,51,51,0.2)'
            }
          },
          min: (value: any) => {
            let min = value.min
            if (calcMinY || calcMinY === 0) {
              min = Math.min(min, calcMinY)
            }
            if (calcMaxY || calcMaxY === 0) {
              min = Math.min(min, calcMaxY)
            }
            return Math.floor(min)
          },
          max: (value: any) => {
            let max = value.max
            if (calcMinY || calcMinY === 0) {
              max = Math.max(max, calcMinY)
            }
            if (calcMaxY || calcMaxY === 0) {
              max = Math.max(max, calcMaxY)
            }
            return Math.ceil(max)
          }
        },
        color: ['#537AE6', '#42B789'],
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
            data: xData.map((el: number, i: number) => {
              return [el, yData[i]]
            }),
            name: `(${property[0].name}, ${property[1].name})`,
            type: 'scatter',
            symbolSize: 3,
            markLine: markLine
          }
        ]
      })
      const tableRawData = xData.map((val: string, i: number) => {
        return {
          time: res.data.timePoints[i],
          [xKey]: val,
          [yKey]: yData[i],
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
          dataIndex: xKey
        },
        {
          title: `${property[1].name}${property[1].unit ? `(${property[1].unit})` : ''}`,
          dataIndex: yKey
        }
      ]
      setRawTableData(tableRawData)
      setRawColumns(columns)
      setTableData([
        {
          _index: '0',
          x: property[0].name,
          y: property[1].name,
          covariance: res.data.covariance,
          correlationCoefficient: res.data.correlationCoefficient,
          linearRegressionA: res.data.linearRegressionA,
          linearRegressionB: res.data.linearRegressionB
        }
      ])
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
  const searchFrequencyWithOutLoading = (samplingInfo: any) => {
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
    setChartLoading(true)
    queryCorrelationChart(queryParams, selectProperty).finally(() => {
      setChartLoading(false)
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
    queryCorrelationChart(params, property)
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
    request.get(api.analysis.multiple_time_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const exportCorrelationTable = (samplingInfo: samplingInfoInterface) => {
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
    request.get(api.analysis.multiple_correlation_export, queryParams).then((res) => {
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
        type='multiple'
        timeSearch={timeSearch}
        frequencySearch={frequencySearch}
        setSelectProperty={setSelectProperty}
        chartLoading={chartLoading}
        timechartLoading={timechartLoading}
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
        <DotChart
          searchWithOutLoading={searchFrequencyWithOutLoading}
          exportTable={exportCorrelationTable}
          chartLoading={chartLoading}
          tableData={tableData}
          selectProperty={selectProperty}
          rawTableData={rawTableData}
          rawColumns={rawColumns}
          option={chartOption}
          defaultSampleInterval={defaultSampleInterval}
        />
      ) : null}
    </div>
  )
}

export default Multiple
