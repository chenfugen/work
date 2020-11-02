import React, { useRef, useEffect, useCallback } from 'react'
import CardContainer from '../../../components/CardContainer'
import echart from 'echarts'
import request from '../../../request/request'
import style from './index.module.css'

const LineChart = (props: any) => {
  const echartIntance: any = useRef(null)
  const dom = useRef(null)
  const handleResize = useCallback(() => {
    if (echartIntance.current) {
      echartIntance.current.resize()
    }
  }, [])
  useEffect(() => {
    if (!echartIntance.current) {
      echartIntance.current = echart.init((dom.current as unknown) as HTMLDivElement)
    }
    if (props.modelCode) {
      let params = {
        model: props.modelCode
      }
      echartIntance.current.showLoading({
        color: '#7E9AE8'
      })
      request
        .get(props.api, params)
        .then((res) => {
          if (!res.data) return
          let xData: any = res.data.timeList
          if (props.type === 'day') {
            xData = xData.map((date: string) => date + ':00')
          }
          const yData: any = res.data.countList
          const option = {
            xAxis: {
              type: 'category',
              data: xData,
              axisLabel: {
                formatter(value: string) {
                  if (props.type === 'day') {
                    return value.split(' ')[1]
                  }
                  return value
                }
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '10%',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params: any) {
                let res = [params[0].name, `${params[0].marker} 异常数: ${params[0].data}`]
                return res.join('<br/>')
              }
            },
            color: '#DA5567',
            yAxis: {
              type: 'value',
              minInterval: 1,
              name: '次'
            },
            series: [
              {
                data: yData,
                type: 'line'
              }
            ]
          }
          echartIntance.current.setOption(option)
        })
        .finally(() => {
          echartIntance.current.hideLoading()
        })
    }
  }, [props.modelCode, props.api])
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <CardContainer>
      <h3 className={style.title}>近{props.title}异常趋势</h3>
      <div ref={dom} style={{ width: '100%', height: '280px' }}></div>
    </CardContainer>
  )
}

export default LineChart
