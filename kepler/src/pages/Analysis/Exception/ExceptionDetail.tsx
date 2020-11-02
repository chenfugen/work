import React, { useState, useEffect } from 'react'
import { Cascader, Select, Space, PageHeader, DatePicker, Button, message, Spin } from 'antd'
import request from '../../../request/request'
import { createMovtion } from '../../../components/Download/Movtion'
import api from '../../../api'
import style from './index.module.css'
import emptyImgUrl from '../../../assets/blank_no_chart.png'
import CardContainer from '../../../components/CardContainer'
import FChart from '../compontents/FChart'
import { useQuery } from '../../../hooks/common'
import { DataTypeEnum } from '../../../config/Enum'
import cascaderStyle from '../../Device/css/index.module.css'
import Big from 'big.js'
const { RangePicker } = DatePicker
const DisabledProperty = [DataTypeEnum.STRING, DataTypeEnum.DATE]
const Empty = () => {
  return (
    <div className={style.empty}>
      <img src={emptyImgUrl} alt='' />
      <span className={style.emptyTips}>请在上方选择数据进行分析</span>
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
const frequencyColumns = [
  {
    title: '属性',
    dataIndex: 'field'
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

interface options {
  code: string
  name: string
  children?: Array<options>
}
const ExceptionDetail = () => {
  const { select: selectQuery } = useQuery()
  const [isEmpty, setIsEmpty] = useState(true)
  const [loading, setLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartOption, setChartOption] = useState<any>(null)
  const [options, setOptions] = useState<Array<options>>([])
  const [selectValue, setSelectValue] = useState<any>([])
  const [property, setProperty] = useState([])
  const [rawColumns, setRawColumns] = useState<any>([])
  const [date, setDate] = useState<any>([])
  const [rawTableData, setRawTableData] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [params, setParams] = useState<any>({})
  const [cascaderWidth, setCascaderWidth] = useState('121px')
  const [selectProperty, setSelectProperty] = useState(undefined)
  const [selectPropertyDetail, setSelectPropertyDetail] = useState<any>({})
  const selectChange = (value: any) => {
    setSelectValue(value)
    setSelectProperty(undefined)
  }
  const propertyChange = (value: any) => {
    setSelectProperty(value)
    let selectParams = property.filter((el: any) => {
      return el.id === value
    })
    setSelectPropertyDetail(selectParams)
  }
  const queryModel = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setOptions(res.data)
      console.log(selectQuery)
      if (selectQuery && selectQuery) {
        setSelectValue(selectQuery)
        setSelectProperty(undefined)
        return
      }
      if (res.data && res.data.length) {
        let arr = [res.data[0].id, res.data[0].children[0].id]
        setSelectValue(arr)
        setSelectProperty(undefined)
      }
    })
  }
  useEffect(queryModel, [])
  useEffect(() => {
    if (selectValue[1]) {
      let params = {
        modelCode: selectValue[1]
      }
      request.get(api.common.select_property, params).then((res) => {
        setProperty(res.data)
      })
    }
  }, [selectValue])
  const onDateChange = (dates: any) => {
    if (dates) {
      setDate(dates)
    } else {
      setDate([])
    }
  }
  const draw = () => {
    if (!selectProperty) {
      return message.warning('请选择属性')
    }
    if (date.length === 0) {
      return message.warning('请选择时间段')
    }
    let params = {
      propertyId: selectProperty,
      startTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss')
    }
    setParams(params)
    setIsEmpty(false)
    setLoading(true)
    setChartLoading(true)
    queryData(params, selectPropertyDetail)
      .catch(() => {
        setIsEmpty(true)
      })
      .finally(() => {
        setLoading(false)
        setChartLoading(false)
      })
  }
  const queryData = (params: any, property: any) => {
    let queryParams = {
      ...params
    }
    return request.get(api.analysis.exception_detail, queryParams).then((res) => {
      const data = res.data
      if (!data || data.group.length === 0) {
        message.warning('暂无数据')
        return Promise.reject()
      }
      console.log(property)
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
  const searchFrequencyWithOutLoading = (groupInfo: any) => {
    let queryParams = {
      ...params
    }
    if (groupInfo.groupInterval && groupInfo.groupInterval > 0) {
      queryParams.groupInterval = groupInfo.groupInterval
    }
    setChartLoading(true)
    queryData(queryParams, selectPropertyDetail).finally(() => {
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
    request.get(api.analysis.exception_detail_export, queryParams).then((res) => {
      createMovtion('export_movtion_start', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const dropdownRender = (menus: any) => {
    let width = cascaderWidth
    return (
      <div>
        <div className={cascaderStyle.cascaderContainer}>
          <span className={cascaderStyle.series} style={{ width }}>
            选择系列
          </span>
          <span className={cascaderStyle.model}>选择型号</span>
        </div>
        {menus}
      </div>
    )
  }
  const onPopupVisibleChange = (value: boolean) => {
    if (value) {
      setTimeout(() => {
        let dom = document.querySelector('.ant-cascader-menus.model_cascader  .ant-cascader-menu')
        if (dom) {
          let width = window.getComputedStyle(dom).width
          setCascaderWidth(width)
        }
      }, 100)
    }
  }
  return (
    <div className={style.ExceptionDetailContainer}>
      <PageHeader
        onBack={() => window.history.back()}
        title={
          <Space>
            <Cascader
              allowClear={false}
              style={{ fontWeight: 'normal' }}
              options={options}
              fieldNames={{ label: 'name', value: 'code' }}
              value={selectValue}
              displayRender={(label: any) => <span title={label.join('/')}>{label.join('/')}</span>}
              onChange={selectChange}
              popupClassName='model_cascader'
              dropdownRender={dropdownRender}
              onPopupVisibleChange={onPopupVisibleChange}
            />
            <Select
              value={selectProperty}
              onChange={propertyChange}
              style={{ width: '180px', fontWeight: 'normal' }}
              placeholder='请选择属性'>
              {property.map((item: any) => {
                return (
                  <Select.Option
                    value={item.id}
                    key={item.id}
                    disabled={DisabledProperty.indexOf(item.type) > -1}>
                    {item.name}
                    {item.unit ? `(${item.unit})` : ''}
                  </Select.Option>
                )
              })}
            </Select>
            <RangePicker
              onChange={onDateChange}
              size='middle'
              picker='date'
              format='YYYY-MM-DD HH:mm'
              showTime={{
                format: 'HH:mm'
              }}
            />
            <Button type='primary' onClick={draw}>
              分析
            </Button>
          </Space>
        }
      />
      {isEmpty ? (
        <Empty />
      ) : loading ? (
        <Loading />
      ) : (
        <CardContainer>
          <h3>
            <span style={{ fontWeight: 'bold' }}>
              {`${selectPropertyDetail[0].name}${
                selectPropertyDetail[0].unit ? `(${selectPropertyDetail[0].unit})` : ''
              }`}
              的异常分布
            </span>
          </h3>
          <FChart
            exportTable={exportFrequencyTable}
            searchWithOutLoading={searchFrequencyWithOutLoading}
            chartLoading={chartLoading}
            tableData={tableData}
            columns={frequencyColumns}
            rawTableData={rawTableData}
            rawColumns={rawColumns}
            option={chartOption}
            noNeedTitle={true}
          />
        </CardContainer>
      )}
    </div>
  )
}

export default ExceptionDetail
