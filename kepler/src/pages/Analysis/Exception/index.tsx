import React, { useState, useEffect } from 'react'
import LineChart from './LineChart'
import PieChart from './PieChart'
import { Row, Col, Cascader, Button } from 'antd'
import cascaderStyle from '../../Device/css/index.module.css'
import style from './index.module.css'
import request from '../../../request/request'
import api from '../../../api'
import { useHistory, useRouteMatch } from 'react-router-dom'
import qs from 'qs'
interface options {
  code: string
  name: string
  children?: Array<options>
}
// 检验保存在localStorage中选择的型号是否还存在
const hasMatch = (path: Array<string>, tree: Array<any>): Boolean => {
  let first = tree.filter((el) => el.code === path[0])
  if (first.length) {
    let second = first[0]
    let model = second.children.filter((el: any) => el.code === path[1])
    if (model.length) {
      return true
    }
  }
  return false
}
const Single = () => {
  let { url } = useRouteMatch()
  let history = useHistory()
  const [cascaderWidth, setCascaderWidth] = useState('121px')
  const [options, setOptions] = useState<Array<options>>([])
  const [selectValue, setSelectValue] = useState<Array<number | string>>([])
  const [modelCode, setModelCode] = useState('')
  const queryModel = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setOptions(res.data)
      if (res.data && res.data.length) {
        let exception_select_model: any = ''
        try {
          exception_select_model = JSON.parse(localStorage.getItem('exception_select_model') || '')
        } catch (err) {}
        if (exception_select_model && Array.isArray(exception_select_model)) {
          if (!hasMatch(exception_select_model, res.data)) {
            localStorage.removeItem('exception_select_model')
            if (res.data && res.data.length) {
              exception_select_model = [res.data[0].code, res.data[0].children[0].code]
            }
          }
        } else {
          localStorage.removeItem('exception_select_model')
          if (res.data && res.data.length) {
            exception_select_model = [res.data[0].code, res.data[0].children[0].code]
          }
        }
        setSelectValue(exception_select_model)
        setModelCode(exception_select_model[1])
      }
    })
  }
  useEffect(queryModel, [])
  const selectChange = (value: any) => {
    localStorage.setItem('exception_select_model', JSON.stringify(value))
    setSelectValue(value)
    setModelCode(value[1])
  }
  const handelToException = () => {
    let select = qs.stringify({
      select: selectValue
    })
    history.push(`${url}/detail?${select}`)
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
    <div>
      <div className={style.top}>
        <Cascader
          allowClear={false}
          style={{ marginBottom: '16px' }}
          options={options}
          fieldNames={{ label: 'name', value: 'code' }}
          value={selectValue}
          displayRender={(label: any) => <span title={label.join('/')}>{label.join('/')}</span>}
          onChange={selectChange}
          popupClassName='model_cascader'
          dropdownRender={dropdownRender}
          onPopupVisibleChange={onPopupVisibleChange}
        />
        <Button onClick={handelToException}>异常分布分析</Button>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <LineChart
            modelCode={modelCode}
            title='24小时'
            api={api.exception.trend_day}
            type='day'
          />
        </Col>
        <Col span={12}>
          <PieChart modelCode={modelCode} title='24小时' api={api.exception.pie_day} />
        </Col>
        <Col span={12}>
          <LineChart modelCode={modelCode} title='1月' api={api.exception.trend_month} />
        </Col>
        <Col span={12}>
          <PieChart modelCode={modelCode} title='1月' api={api.exception.pie_month} />
        </Col>
      </Row>
    </div>
  )
}

export default Single
