import React, { useState, useEffect } from 'react'
import curve_nor from '../../../assets/analyse_curve_chart_nor.png'
import curve_sel from '../../../assets/analyse_curve_chart_sel.png'
import area_nor from '../../../assets/analyse_area_chart_nor.png'
import area_sel from '../../../assets/analyse_area_chart_sel.png'
import bar_nor from '../../../assets/analyse_bar_chart_nor.png'
import bar_sel from '../../../assets/analyse_bar_chart_sel.png'
import dot_nor from '../../../assets/analyse_dot_chart_nor.png'
import dot_sel from '../../../assets/analyse_dot_chart_sel.png'
import line_nor from '../../../assets/analyse_line_chart_nor.png'
import line_sel from '../../../assets/analyse_line_chart_sel.png'
import table_nor from '../../../assets/analyse_table_nor.png'
import table_sel from '../../../assets/analyse_table_sel.png'
import style from './css/ChartButtonGroup.module.css'
import classnames from 'classnames'
import { ChartTypes } from '../../../config/Enum'
const iconTypes: any = {
  time: [
    {
      type: ChartTypes.CURVE,
      name: '曲线图',
      sel: curve_sel,
      nor: curve_nor
    },
    {
      type: ChartTypes.LINE,
      name: '折线图',
      sel: line_sel,
      nor: line_nor
    },
    {
      type: ChartTypes.TABLE,
      name: '表格数据',
      sel: table_sel,
      nor: table_nor
    }
  ],
  frequency: [
    {
      type: ChartTypes.BAR,
      name: '柱状图',
      sel: bar_sel,
      nor: bar_nor
    },
    {
      type: ChartTypes.TABLE,
      name: '表格数据',
      sel: table_sel,
      nor: table_nor
    }
  ],
  scatter: [
    {
      type: ChartTypes.DOT,
      name: '散点图',
      sel: dot_sel,
      nor: dot_nor
    },
    {
      type: ChartTypes.TABLE,
      name: '表格数据',
      sel: table_sel,
      nor: table_nor
    }
  ]
}

const ChartButtonGroup = (props: any) => {
  const [icons, setIcons] = useState([])
  const [active, setActive] = useState(props.defalutActive)
  const iconClick = (e: any) => {
    e.persist()
    const type = e.target.dataset.type
    setActive(type)
    props.typeChange(type)
  }
  useEffect(() => {
    if (props.chartType) {
      setIcons(iconTypes[props.chartType])
    }
  }, [props.chartType])
  return (
    <div onClick={iconClick} className={style.ChartButtonGroup}>
      {icons.map((icon: any) => {
        return (
          <div
            data-type={icon.type}
            title={icon.name}
            className={classnames(style.ChartButton, [active === icon.type ? style.active : ''])}
            key={icon.type}>
            <img src={active === icon.type ? icon.sel : icon.nor} alt='' data-type={icon.type} />
          </div>
        )
      })}
    </div>
  )
}

export default ChartButtonGroup
