import React, { useState, useRef, useEffect } from 'react'
import { Divider, Radio, Empty } from 'antd'
import CardContainer from '../../../components/CardContainer'
import echart from 'echarts'
import api from '../../../api'
import { formatTime } from '../../../utils/utils'
import './chart.less'

import request from '../../../request/request'

const options = [
  { label: '近1月', value: '1' },
  { label: '近1年', value: '2' }
]

const LineCharts = (props: any) => {
  const [tab, setTab] = useState<any>('1')
  const [url, setUrl] = useState<string>(props.api)
  const [isShow, setIsShow] = useState<boolean>(true)
  const echartIntance: any = useRef(null)
  const dom = useRef(null)

  const tabChange = (e: any) => {
    setTab(e.target.value)
    let url
    if (props.title == '缺陷趋势') {
      url =
        e.target.value == '1'
          ? api.flaw.flaw_line_statistic_overall_day
          : api.flaw.flaw_line_statistic_overall_month
    } else {
      url =
        e.target.value == '1'
          ? api.flaw.flaw_line_statistic_remain_day
          : api.flaw.flaw_line_statistic_remain_month
    }
    setUrl(url)
  }

  const echartInstll = () => {
    if (!echartIntance.current) {
      echartIntance.current = echart.init((dom.current as unknown) as HTMLDivElement)
    }
    if (props.modelCode) {
      let params = {
        modelCode: props.modelCode
      }
      //loading样式
      echartIntance.current.showLoading({
        color: '#7E9AE8'
      })
      request
        .get(url, params)
        .then((res) => {
          if (!res.data) return false
          if (res.data.dateTime == undefined || res.data.dateTime.length == 0) {
            setIsShow(false)
          } else {
            setIsShow(true)
          }
          let data = res.data
          const dataDay: Array<string> = []
          ;(data.dateTime || []).map((ele: number) => {
            if (tab == '1') {
              dataDay.push(formatTime(ele, 'YYYY-MM-DD'))
            } else {
              dataDay.push(formatTime(ele, 'YYYY-MM'))
            }
          })
          let series =
            props.title == '缺陷趋势'
              ? [
                  // {
                  //   name: '完成',
                  //   type: 'line',
                  //   stack: '总量',
                  //   data: data.FINISH
                  // },
                  {
                    name: '新增',
                    type: 'line',
                    data: data.INCREASE
                  },
                  {
                    name: '处理',
                    type: 'line',
                    data: data.FINISH
                  },
                  {
                    name: '关闭',
                    type: 'line',
                    data: data.CLOSE
                  }
                ]
              : [
                  {
                    type: 'line',
                    data: data.count
                  }
                ]
          const option = {
            title: {
              text: props.title
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '22%',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(42,47,61,0.8)', //背景颜色（此时为默认色）
              padding: 8 // [5, 10, 15, 20] 内边距
            },
            legend: {
              data: props.title == '缺陷趋势' ? ['新增', '处理', '关闭'] : null
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: dataDay
            },
            yAxis: {
              type: 'value',
              name: '缺陷数',
              splitNumber: 5,
              minInterval: 1
            },
            color: ['#DA5567', '#42B789', '#537AE6', '#999999'],
            series: series
          }
          echartIntance.current.setOption(option)
        })
        .finally(() => {
          echartIntance.current.hideLoading()
        })
    }
  }

  useEffect(echartInstll, [url, props.modelCode])

  return (
    <CardContainer>
      <div style={{ display: isShow ? 'block' : 'none' }}>
        <div className='tabButton'>
          <Radio.Group
            options={options}
            onChange={tabChange}
            value={tab}
            optionType='button'
            buttonStyle='solid'
          />
        </div>
        <div ref={dom} style={{ width: '100%', height: '300px' }}></div>
      </div>
      <p style={{ display: isShow ? 'none' : 'block' }} className='title'>
        {props.title}
      </p>
      <Empty style={{ display: isShow ? 'none' : 'block', height: '255px' }} />
    </CardContainer>
  )
}

export default LineCharts
