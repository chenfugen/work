import React from 'react'
import emptyImgUrl from '../../../assets/blank_no_chart.png'
import style from './css/Empty.module.css'

const Empty = () => {
  return (
    <div className={style.empty}>
      <img src={emptyImgUrl} alt='' />
      <span className={style.emptyTips}>请在左侧选择数据进行分析</span>
    </div>
  )
}

export default Empty
