import React, { useEffect, useState } from 'react'
import DefectPage from './index'
import request from '../../request/request'
import style from './index.module.css'
import api from '../../api'
import { Spin } from 'antd'
import no_relation from '../../assets/blank_no_relation.png'
import classnames from 'classnames'

const Empty = () => {
  return (
    <div className={classnames([style.container, style.background])}>
      <img src={no_relation} alt='' />
      <span>您当前未关联到任何型号，无法查看缺陷信息。</span>
      <span>请联系管理员进行关联；或先新建型号进行关联，再查看对应缺陷。</span>
    </div>
  )
}

const Loading = () => {
  return (
    <div className={classnames([style.container, style.background])}>
      <Spin />
    </div>
  )
}

const CheckPage = () => {
  const [hasModel, setHasModel] = useState(false)
  const [loading, setLoading] = useState(true)
  const queryModel = () => {
    request
      .get(api.common.select_series_model_tree)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setHasModel(true)
        } else {
          setHasModel(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(queryModel, [])
  return <>{loading ? <Loading /> : hasModel ? <DefectPage /> : <Empty />}</>
}

export default CheckPage
