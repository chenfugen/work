import React from 'react'
import style from './index.module.css'
const RowItem = (props: any) => {
  return (
    <div className={style.rowItem}>
      <div className={style.label}>{props.title}:</div>
      <div className={style.content}>{props.children}</div>
    </div>
  )
}

export default RowItem
