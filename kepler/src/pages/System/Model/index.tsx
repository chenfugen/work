import React, { useState, useEffect } from 'react'
import Series from './Series'
import { Breadcrumb } from 'antd'
import ModelCard from './ModelCard'
import request from '../../../request/request'
import api from '../../../api'
import './index.less'
import { useRole } from './hooks'
const hasSeriesId = (id: string, arr: Array<any>) => {
  return arr.some((el) => el.id === id)
}

const Model = () => {
  const role = useRole()
  const [series, setSeries] = useState([])
  const [seriesLoading, setSeriesLoading] = useState(false)
  const [models, setModels] = useState([])
  const [modelsLoading, setModelsLoading] = useState(false)
  const [seriesId, setSeriesId] = useState('')
  const [seriesName, setSeriesName] = useState('')
  console.log(role)
  const querySeries = (id?: string) => {
    setSeriesLoading(true)
    request
      .get(api.system.model_series_list)
      .then((res) => {
        setSeries(res.data)
        // 保存访问过的系列，下次进入页面时跳到该系列
        let seriesId = localStorage.getItem('model_select') || ''
        if (res.data.length) {
          let name = res.data[0].name
          // 如果系列未被删除，传入的id为空的话使用本地保存的系列id
          if (hasSeriesId(seriesId, res.data) && !id) {
            id = seriesId
          }
          if (id) {
            let item = res.data.filter((el: any) => el.id === id)[0]
            if (item) {
              name = item.name
            }
          }
          queryModels(id || res.data[0].id, name)
        }
      })
      .finally(() => {
        setSeriesLoading(false)
      })
  }
  const queryModels = (id: string, name: string, queryParams?: any) => {
    setModelsLoading(true)
    let params = {
      seriesId: id,
      ...queryParams
    }
    request
      .get(api.system.model_model_list, params)
      .then((res) => {
        setModels(res.data)
      })
      .finally(() => {
        setModelsLoading(false)
        if (seriesId !== id) {
          setSeriesId(id)
          setSeriesName(name)
        }
      })
  }
  useEffect(querySeries, [])
  return (
    <>
      <Breadcrumb style={{ marginBottom: '8px' }}>
        <Breadcrumb.Item>系统管理</Breadcrumb.Item>
        <Breadcrumb.Item>产品型号</Breadcrumb.Item>
      </Breadcrumb>
      <div className='model-home'>
        <Series
          role={role}
          selectId={seriesId}
          series={series}
          querySeries={querySeries}
          queryModels={queryModels}
          loading={seriesLoading}
        />
        <ModelCard
          role={role}
          models={models}
          queryModels={queryModels}
          loading={modelsLoading}
          seriesId={seriesId}
          seriesName={seriesName}
        />
      </div>
    </>
  )
}

export default Model
