import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, Spin, message } from 'antd'
import CardContainer from '../../components/CardContainer'
import { createMovtion } from '../../components/Download/Movtion'
import './DeviceDetail.less'
import { useParams, Link } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'
import { formatTime, formatDisplayTime } from '../../utils/utils'
import emptyImgUrl from '../../assets/blank_no_chart.png'
import style from './ExceptionDetail.module.css'
import exceptionStyle from './exceptionStyle.module.css'
import ExceptionAnalysisForm from './ExceptionAnalysisForm'
import Chart from '../Analysis/compontents/Chart'
import FChart from '../Analysis/compontents/FChart'
import DotChart from '../Analysis/compontents/DotChart'
import { samplingInfoInterface } from '../../config/Interface'
import { SamplingTypesEnum, DataTypeEnum } from '../../config/Enum'
import classnames from 'classnames'
import Big from 'big.js'

const Empty = () => {
  return (
    <div className={classnames([exceptionStyle.border, style.empty])}>
      <img src={emptyImgUrl} alt='' />
      <span className={style.emptyTips}>请在左侧选择数据进行分析</span>
    </div>
  )
}
const Loading = () => {
  return (
    <div className={classnames([exceptionStyle.border, style.empty])}>
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
const frequencyColumns = [
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

const ExceptionDetail = () => {
  const [detail, setDetail] = useState<any>({})
  const [tableData, setTableData] = useState<any>([])
  const [rawTableData, setRawTableData] = useState<any>([])
  const [rawColumns, setRawColumns] = useState<any>([])
  const [chartType, setChartType] = useState('')
  const [isEmpty, setIsEmpty] = useState(true)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<any>({})
  const [timechartLoading, setTimeChartLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [isTimeChange, setTimeChange] = useState(false)
  const [chartOption, setChartOption] = useState<any>(null)
  const [selectProperty, setSelectProperty] = useState<any>('')
  const [defaultSampleInterval, setDefaultSampleInterval] = useState<any>(null)
  let { code, id } = useParams<any>()
  const queryDetail = () => {
    let params = {
      id,
      deviceCode: code
    }
    request.get(api.device.device_detail_exception_detail, params).then((res) => {
      setDetail(res.data)
    })
  }
  const search = (params: any, type: string, property: any) => {
    setParams(params)
    setIsEmpty(false)
    setLoading(true)
    switch (type) {
      case 'dot':
        queryCorrelationChart(params, property)
          .then(() => {
            setChartType('dot')
          })
          .catch(() => {
            setIsEmpty(true)
          })
          .finally(() => {
            setLoading(false)
            setChartLoading(false)
          })
        break
      case 'time':
        queryChart(params, property)
          .then(() => {
            setChartType('time')
          })
          .catch(() => {
            setIsEmpty(true)
          })
          .finally(() => {
            setLoading(false)
            setChartLoading(false)
          })
        break
      case 'timeMuti':
        queryMutiChart(params, property)
          .then(() => {
            setChartType('timeMuti')
          })
          .catch(() => {
            setIsEmpty(true)
          })
          .finally(() => {
            setLoading(false)
            setChartLoading(false)
          })
        break
      case 'frequency':
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
        break
    }
  }
  const queryMutiChart = (params: any, property: any) => {
    return request.get(api.device.device_detail_exception_detail_time, params).then((res) => {
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
      let enum2: any = {}
      console.log('property', property)
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
  const queryChart = (params: any, property: any) => {
    return request.get(api.device.device_detail_exception_detail_time, params).then((res) => {
      if (!res.data || res.data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const data = res.data
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
    return request.get(api.device.device_detail_exception_detail_fre, params).then((res) => {
      const data = res.data
      if (!res.data || res.data.group.length === 0) {
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
    if (chartType === 'time') {
      queryChart(queryParams, selectProperty).finally(() => {
        setTimeChartLoading(false)
      })
    } else if (chartType === 'timeMuti') {
      queryMutiChart(queryParams, selectProperty).finally(() => {
        setTimeChartLoading(false)
      })
    }
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
  const queryCorrelationChart = (params: any, property: any) => {
    return request.get(api.device.device_detail_exception_detail_dot, params).then((res) => {
      if (!res.data) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      const [xKey, yKey] = params.propertyList
      const xData = res.data[xKey]
      const yData = res.data[yKey]
      if (xData.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      if (xData.length === 0) {
        message.warning(`${property[0].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      if (yData.length === 0) {
        message.warning(`${property[1].name}在当前查询条件下无数据,请更换属性进行分析`)
        return Promise.reject()
      }
      setDefaultSampleInterval(res.data.minSampleInterval)
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
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          min: (value: any) => {
            return value.min
          },
          max: (value: any) => {
            return value.max
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
          title: `${property[0].name}(${property[0].unit})`,
          dataIndex: xKey
        },
        {
          title: `${property[1].name}(${property[1].unit})`,
          dataIndex: yKey
        }
      ]
      setRawTableData(tableRawData)
      setRawColumns(columns)
      setTableData([
        {
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
  const searchDotWithOutLoading = (samplingInfo: samplingInfoInterface) => {
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
    request.get(api.device.device_detail_exception_detail_time_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const exportDotTable = (samplingInfo: samplingInfoInterface) => {
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
    request.get(api.device.device_detail_exception_detail_dot_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const exportFrequencyTable = (groupInfo: any) => {
    let queryParams = {
      ...params
    }
    if (groupInfo.groupInterval && groupInfo.groupInterval > 0) {
      queryParams.groupInterval = groupInfo.groupInterval
    }
    request.get(api.device.device_detail_exception_detail_fre_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  useEffect(queryDetail, [id, code])
  return (
    <div className='device-detail'>
      <PageHeader
        className='model-detail-header'
        onBack={() => window.history.back()}
        title='异常记录详情'
      />
      <CardContainer>
        <div className='gray-container'>
          <div className='part-one'>
            <h3 className='device-detail-title'>{detail.deviceCode}</h3>
            <Descriptions column={1}>
              <Descriptions.Item label='型号名称'>
                <span>{detail.modelName}</span>
              </Descriptions.Item>
              <Descriptions.Item label='型号编码'>
                <span>{detail.modelCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label='系列名称' className='no-padding'>
                <span>{detail.seriesName}</span>
              </Descriptions.Item>
            </Descriptions>
            <div></div>
          </div>
          <div className='line'></div>
          <div className='part-two'>
            <h3 className='device-detail-title'>异常信息</h3>
            <Descriptions column={1}>
              <Descriptions.Item label='属性名称'>
                <span>{detail.propertyName}</span>
              </Descriptions.Item>
              <Descriptions.Item label='属性标识符'>
                <span>{detail.propertyCode}</span>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions column={2}>
              <Descriptions.Item label='触发异常时间'>
                <span>{formatTime(detail.startTime)}</span>
              </Descriptions.Item>
              <Descriptions.Item label='触发异常的属性值'>
                <span>{detail.alarmValue}</span>
              </Descriptions.Item>
              <Descriptions.Item label='解除异常时间'>
                <span>{formatTime(detail.endTime)}</span>
              </Descriptions.Item>
              <Descriptions.Item label='解除异常的属性值'>
                <span>{detail.removeAlarmValue}</span>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions column={1}>
              <Descriptions.Item label='异常持续时间' className='no-padding'>
                <span>{formatDisplayTime(detail.alarmTime)}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className='line'></div>
          <div className='part-one'>
            <h3 className='device-detail-title'>关联缺陷</h3>
            <Descriptions column={1}>
              {detail.flaws &&
                detail.flaws.map((flaw: any) => {
                  return (
                    <Descriptions.Item key={flaw.id} label='缺陷编号'>
                      <Link
                        style={{ color: '#537ae6' }}
                        to={{
                          pathname: `/defects/detail/${flaw.id}/${detail.modelCode}`
                        }}>
                        {flaw.id}
                      </Link>
                      &nbsp;({flaw.statusName})
                    </Descriptions.Item>
                  )
                })}
            </Descriptions>
            {!!detail.flaws && detail.flaws.length === 0 && (
              <div style={{ color: '#bbb' }}>暂无关联缺陷</div>
            )}
          </div>
        </div>
        <div className={classnames([style.exceptionTips, isTimeChange ? style.hidden : ''])}>
          展示异常发生前后 <span style={{ color: '#537AE6' }}>10</span>{' '}
          分钟的图表。帮助您分析此次异常。
        </div>
        <div style={{ display: 'flex' }}>
          <ExceptionAnalysisForm
            modelId={detail.modelId}
            deviceCode={detail.deviceCode}
            modelName={detail.modelName}
            propertyCode={detail.propertyCode}
            propertyType={detail.propertyType}
            propertyName={`${detail.propertyName}${
              detail.propertyUnit ? `(${detail.propertyUnit})` : ''
            }`}
            search={(params: any, type: string, property: any) => search(params, type, property)}
            startTime={detail.startTime}
            modelCode={detail.modelCode}
            timeChange={setTimeChange}
            setSelectProperty={setSelectProperty}
          />
          {isEmpty ? (
            <Empty />
          ) : loading ? (
            <Loading />
          ) : chartType === 'time' || chartType === 'timeMuti' ? (
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
              option={chartOption}
              selectProperty={selectProperty}
            />
          ) : chartType === 'dot' ? (
            <DotChart
              exportTable={exportDotTable}
              searchWithOutLoading={searchDotWithOutLoading}
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
      </CardContainer>
    </div>
  )
}

export default ExceptionDetail
