import React, { useRef, useEffect, useState, useCallback } from 'react'
import CardContainer from '../../../components/CardContainer'
import echart from 'echarts'
import request from '../../../request/request'
import style from './index.module.css'
import { Empty } from 'antd'
import { getPercentValue } from '../../../utils/getPercentValue'

const PieChart = (props: any) => {
  const [isEmpty, setIsEmpty] = useState(false)
  const echartIntance: any = useRef(null)
  const dom = useRef(null)
  const [data, setData] = useState([])
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
      setData([])
      let params = {
        model: props.modelCode
      }
      echartIntance.current.showLoading({
        color: '#7E9AE8'
      })
      request
        .get(props.api, params)
        .then((res) => {
          if (!res.data) {
            setIsEmpty(true)
            echartIntance.current.clear()
            return
          }
          setIsEmpty(false)
          const paramsSum = res.data.totalCount
          let data = res.data.data.map((el: any) => {
            return {
              value: el.count,
              // name: `${el.propertyName}${el.propertyUnit ? `(${el.propertyUnit})` : ''} ${
              //   el.count
              // }  ${((el.count * 100) / paramsSum).toFixed(2)}%`,
              name: `${el.propertyName}${el.propertyUnit ? `(${el.propertyUnit})` : ''}`,
              realName: `${el.propertyName}${el.propertyUnit ? `(${el.propertyUnit})` : ''}: ${
                el.count
              }(${((el.count * 100) / paramsSum).toFixed(2)}%)`
            }
          })
          setData(res.data.data)
          const options = {
            backgroundColor: '#ffffff',
            tooltip: {
              trigger: 'item',
              // formatter: '{a} <br/>{b}'
              formatter: function (params: any) {
                console.log(params)
                return `${params.seriesName} <br/> ${params.data.realName}`
              }
            },
            color: [
              '#7E9AE8',
              '#7ECEEE',
              '#7DD6B3',
              '#9FE286',
              '#F2D06E',
              '#EAA18F',
              '#BEA3EA',
              '#B0BFF3'
            ],
            grid: {
              top: 0,
              bottom: 0,
              left: 0
            },
            legend: {
              type: 'scroll',
              right: '30%',
              top: '80',
              // bottom: 0,
              orient: 'vertical',
              data: data.map((el: any) => el.name),
              formatter: function (name: string) {
                return name
              }
            },
            graphic: [
              {
                //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 160,
                top: '45%',
                style: {
                  text: '报异常属性总数',
                  textAlign: 'center',
                  fill: '#999', //文字的颜色
                  width: 30,
                  height: 20,
                  fontSize: 12,
                  fontFamily: 'Microsoft YaHei'
                }
              },
              {
                //环形图中间添加文字
                type: 'text', //通过不同top值可以设置上下显示
                left: 180,
                top: '52%',
                style: {
                  text: paramsSum,
                  textAlign: 'center',
                  fill: '#333', //文字的颜色
                  width: 30,
                  height: 28,
                  fontSize: 20,
                  fontFamily: 'Microsoft YaHei'
                }
              }
            ],
            series: [
              {
                name: '近24小时异常占比',
                type: 'pie',
                // hoverAnimation: false,
                top: 0,
                bottom: 0,
                center: [200, '50%'],
                radius: ['53%', '73%'],
                data: data,
                // roseType: "radius",
                label: {
                  normal: {
                    textStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                    }
                  }
                },
                itemStyle: {
                  borderWidth: 1,
                  borderColor: '#fff'
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                  return Math.random() * 200
                }
              }
            ]
          }
          echartIntance.current.setOption(options)
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
      <h3 className={style.title}>近{props.title}异常占比</h3>
      <div style={{ width: '100%', height: '280px', position: 'relative' }}>
        <ul className={style.pieDate}>
          {data.map((item: any, index: number) => {
            return (
              <li key={index}>
                <span>
                  {getPercentValue(
                    data.map((el: any) => el.count),
                    index,
                    2
                  ) + '%'}
                </span>
                {/* <span>{item.count}</span> */}
              </li>
            )
          })}
        </ul>
        <div ref={dom} style={{ width: '100%', height: '280px' }}></div>
      </div>
      {isEmpty && <Empty className={style.emptyChart} />}
    </CardContainer>
  )
}

export default PieChart
