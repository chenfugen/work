import React, { useState, useRef, useEffect } from 'react'
import { Divider, Radio, Empty } from 'antd'
import CardContainer from '../../../components/CardContainer'
import echart from 'echarts'
import './chart.less'
import { useHistory } from 'react-router-dom'
import request from '../../../request/request'
import { getPercentValue } from '../../../utils/getPercentValue'

const LineCharts = (props: any) => {
  let history = useHistory()
  const [totalCount, setTotalCount] = useState<number>(1)
  const [data, setDate] = useState<any>([])
  const [counts, setCounts] = useState<any>([])
  const echartIntance: any = useRef(null)
  const dom = useRef(null)

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
        .get(props.api, params)
        .then((res) => {
          if (!res.data) return
          setTotalCount(res.data.totalCount)
          setDate(res.data.data)
          let arr: Array<any> = []
          let counts: Array<any> = []
          res.data.data.map((item: any, index: number) => {
            counts.push(item.count)
            if (item.status) {
              arr.push({
                name:
                  item.status === 'WAIT'
                    ? '待处理'
                    : item.status === 'FINISH'
                    ? '已处理'
                    : item.status === 'DELAY'
                    ? '暂不处理'
                    : '已关闭',
                value: item.count
              })
            }
            if (item.assignedAdminName) {
              arr.push({
                name: item.assignedAdminName,
                value: item.count
              })
            }
          })
          setCounts(counts)
          const option = {
            title: {
              text: props.title
            },
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(42,47,61,0.8)', //背景颜色（此时为默认色）
              padding: 8, // [5, 10, 15, 20] 内边距
              formatter:
                (props.title !== '缺陷状态统计' ? '待处理缺陷指派情况' : '缺陷状态统计') +
                '<br/>{b}: <strong>{c} ({d}%</strong>)'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: '30%',
              top: 80,
              formatter: function (name: any) {
                return ' ' + name
              },
              data: arr
            },
            graphic: [
              {
                type: 'text',
                left:
                  props.title === '缺陷状态统计'
                    ? window.innerWidth > 1900
                      ? '26%'
                      : window.innerWidth > 1600
                      ? '25.4%'
                      : '24.7%'
                    : window.innerWidth > 1900
                    ? '25.3%'
                    : window.innerWidth > 1600
                    ? '24.5%'
                    : '23.7%',
                top: '45%',
                style: {
                  text: props.title == '缺陷状态统计' ? '累计缺陷总数' : '待处理缺陷总数',
                  textAlign: 'center',
                  fill: '#999999',
                  width: 212,
                  font: '12px "Microsoft YaHei"',
                  height: 30
                }
              },
              {
                type: 'text',
                left:
                  props.title === '缺陷状态统计'
                    ? window.innerWidth > 1900
                      ? '28.7%'
                      : window.innerWidth > 1600
                      ? '28.3%'
                      : '28%'
                    : window.innerWidth > 1900
                    ? '29.2%'
                    : window.innerWidth > 1600
                    ? '29%'
                    : '28.7%',
                top: '53%',
                style: {
                  text: res.data.totalCount,
                  textAlign: 'center',
                  fill: '#000',
                  font: 'bolder 20px "PingFangSC-Semibold"',
                  height: 30
                }
              }
            ],
            color: ['#7DD6B3', '#7E9AE8', '#EAA18F', '#F2D06E', '#7ECEEE', '#9FE286', '#537AE6'],
            series: [
              {
                name: '缺陷状态统计',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  name: '累计缺陷总数',
                  position: 'center'
                },
                itemStyle: {
                  borderWidth: 1,
                  borderColor: '#fff'
                },
                labelLine: {
                  show: false
                },
                data: arr
              }
            ]
          }
          echartIntance.current.setOption(option)
        })
        .finally(() => {
          echartIntance.current.hideLoading()
        })
    }
  }
  const handleDetail = (val: any) => {
    if (val.status) {
      history.push(`/defects?status=` + val.status)
    } else {
      history.push(`/defects?assignedAdmin=` + val.assignedAdmin)
    }
  }
  useEffect(echartInstll, [props.api, props.modelCode])

  return (
    <CardContainer>
      {/*<div className="total">*/}
      {/*<p className="title">累计缺陷总数</p>*/}
      {/*<p className="value">126</p>*/}
      {/*</div>*/}
      {/*{*/}
      {/*totalCount>0?(*/}
      {/*<>*/}
      {/**/}
      {/*</>*/}
      {/*):(*/}
      {/*<Empty />*/}
      {/*)*/}
      {/*}*/}
      <div style={{ display: totalCount > 0 ? 'block' : 'none' }}>
        <ul className='pieDate'>
          {data.map((item: any, index: number) => {
            return (
              <li key={index}>
                <span>{getPercentValue(counts, index, 2) + '%'}</span>
                {item.assignedAdminName == undefined ? (
                  <span></span>
                ) : item.assignedAdminName == '未指派' || item.assignedAdminName == '其他' ? (
                  <span>{item.count}</span>
                ) : (
                  <a className='info' onClick={() => handleDetail(item)}>
                    {' '}
                    {item.count}{' '}
                  </a>
                )}
              </li>
            )
          })}
        </ul>

        <div ref={dom} style={{ width: '100%', height: '300px' }}>
          {' '}
        </div>
      </div>
      <p style={{ display: totalCount > 0 ? 'none' : 'block' }} className='title'>
        {props.title}
      </p>
      <Empty style={{ display: totalCount > 0 ? 'none' : 'block', height: '255px' }} />
    </CardContainer>
  )
}

export default LineCharts
