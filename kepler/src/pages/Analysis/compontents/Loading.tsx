import React from 'react'
import style from './css/Empty.module.css'
import { Spin } from 'antd'

const Loading = () => {
  return (
    <div className={style.empty}>
      <Spin size='large' />
      <span className={style.emptyTips}>正在生成图表，请稍候…</span>
    </div>
  )
}

export default Loading
