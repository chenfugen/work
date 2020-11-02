import React from 'react'
import style from './DeviceCount.module.css'

const DeviceCount = ({ all = 0, online = 0, alarm = 0 }) => {
  return (
    <div className={style.deviceCountContainer}>
      <span className={style.deviceCountTitle}>当前查询条件下:</span>
      <span className={style.deviceCountGrayBox}>
        设备总数 <span className={style.blue}>{all}</span> 台
      </span>
      <span className={style.deviceCountGrayBox}>
        在线 <span className={style.blue}>{online}</span> 台
      </span>
      <span className={style.deviceCountGrayBox}>
        异常 <span className={style.red}>{alarm}</span> 台
      </span>
    </div>
  )
}

export default DeviceCount
