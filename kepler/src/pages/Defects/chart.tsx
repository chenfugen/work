import React, { useState, useEffect, useReducer } from 'react'
import { Cascader, Col, PageHeader, Row, Popover } from 'antd'
import request from '../../request/request'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import LineCharts from './chartCompontent/lineChart'
import PieChart from './chartCompontent/pieChart'
import style from './css/index.module.css'
import './index.less'
interface options {
  code: string
  name: string
  children?: Array<options>
}

const DefectChart = () => {
  let history = useHistory()
  const [options, setOptions] = useState<Array<options>>([])
  const [modelCode, setModelCode] = useState<string>('')
  const [cascaderWidth, setCascaderWidth] = useState('121px')
  const [selectValue, setSelectValue] = useState<Array<number | string>>([])
  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'model':
        setSelectValue([action.payload[0], action.payload[1]])
        setModelCode(action.payload[1])
        return {
          ...state
        }
      default:
        throw new Error()
    }
  }
  const selectChange = (value: any, options: any) => {
    let arr = value
    arr.push(options[1].id)
    localStorage.setItem('options', JSON.stringify(arr))
    localStorage.setItem('selectOption', JSON.stringify(options[1]))
    dispatch({
      type: 'model',
      payload: value
    })
  }
  const back = () => {
    history.push('/defects')
  }
  const queryModel = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setOptions(res.data)
      let arr: Array<any> = []
      let id: string = ''
      if (localStorage.getItem('options') && localStorage.getItem('selectOption')) {
        let option = localStorage.getItem('options') || ''
        arr = JSON.parse(option)
      } else {
        let arr = [res.data[0].code, res.data[0].children[0].code]
        localStorage.setItem('selectOption', JSON.stringify(res.data[0].children[0]))
        localStorage.setItem('options', JSON.stringify(arr))
      }
      dispatch({
        type: 'model',
        payload: arr
      })
    })
  }
  useEffect(queryModel, [])
  const [state, dispatch] = useReducer(paramsReducer, { modelCode })
  //设备模型下拉设置
  const dropdownRender = (menus: any) => {
    let width = cascaderWidth
    return (
      <div>
        <div className={style.cascaderContainer}>
          <span className={style.series} style={{ width }}>
            选择系列
          </span>
          <span className={style.model}>选择型号</span>
        </div>
        {menus}
      </div>
    )
  }
  const getWidth = (times: number) => {
    if (times === 0) return
    setTimeout(() => {
      let dom = document.querySelector('.ant-cascader-menus.model_cascader  .ant-cascader-menu')
      if (dom) {
        let width = window.getComputedStyle(dom).width
        setCascaderWidth(width)
      } else {
        getWidth(times - 1)
      }
    }, 100)
  }
  const onPopupVisibleChange = (value: boolean) => {
    if (value) {
      getWidth(3)
    }
  }
  return (
    <div className='defectChart'>
      <PageHeader className='model-detail-header' onBack={back} title='缺陷统计' />
      <Cascader
        style={{ marginBottom: '16px' }}
        className='model'
        allowClear={false}
        options={options}
        fieldNames={{ label: 'name', value: 'code' }}
        value={selectValue}
        onChange={selectChange}
        displayRender={(label: any) => <span title={label.join('/')}>{label.join('/')}</span>}
        dropdownRender={dropdownRender}
        onPopupVisibleChange={onPopupVisibleChange}
      />
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <LineCharts
            title='缺陷趋势'
            modelCode={modelCode}
            api={api.flaw.flaw_line_statistic_overall_day}
          />
        </Col>
        <Col span={12}>
          <LineCharts
            title='未关闭缺陷趋势'
            modelCode={modelCode}
            api={api.flaw.flaw_line_statistic_remain_day}
          />
        </Col>
        <Col span={12}>
          <PieChart
            title='缺陷状态统计'
            modelCode={modelCode}
            api={api.flaw.flaw_pie_statistic_status}
          />
        </Col>
        <Col span={12}>
          <PieChart
            title='待处理缺陷指派情况'
            modelCode={modelCode}
            api={api.flaw.flaw_pie_statistic_assign}
          />
        </Col>
      </Row>
    </div>
  )
}

export default DefectChart
