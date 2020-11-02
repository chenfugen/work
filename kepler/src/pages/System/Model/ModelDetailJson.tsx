import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import JsonView from '../../../components/JsonView'
import CardContainer from '../../../components/CardContainer'
import State from '../../../components/State'
import request from '../../../request/request'
import api from '../../../api'
import { PageHeader, Descriptions, Button } from 'antd'
import { formatTime, createDownloadElement } from '../../../utils/utils'

const pahseColor: any = {
  research: 'blue',
  research_complete: 'green'
}

const ModelDetailJson = () => {
  const { modelId } = useParams<any>()
  const [detail, setDetail] = useState<any>({})
  const [json, setJson] = useState('')

  useEffect(() => {
    let params = {
      modelId: modelId
    }
    request.get(api.system.model_detail_params_json, params).then((res) => {
      let str = ''
      try {
        str = JSON.stringify(res.data, null, 2)
      } catch (err) {}
      setJson(str)
    })
  }, [modelId])
  useEffect(() => {
    let params = {
      id: modelId
    }
    request.get(api.system.model_model_detail, params).then((res) => {
      setDetail(res.data)
    })
  }, [modelId])
  const exportJson = () => {
    const file = new Blob([json], { type: 'application/json' })
    let url = URL.createObjectURL(file)
    createDownloadElement(url, `${detail.name}_${detail.code}.json`)
    URL.revokeObjectURL(url)
  }
  return (
    <>
      <PageHeader
        className='model-detail-header'
        onBack={() => window.history.back()}
        title={(detail.name || '') + '/属性配置'}
      />
      <CardContainer>
        <div className='gray-container'>
          <div className='part-one'>
            <h3 style={{ fontWeight: 'bold' }}>{detail.name}</h3>
            <State color={pahseColor[detail.phase]}>{detail.phaseName}</State>
          </div>
          <div className='line'></div>
          <div className='part-one'>
            <Descriptions column={1}>
              <Descriptions.Item label='型号编码'>
                <span>{detail.code}</span>
              </Descriptions.Item>
              <Descriptions.Item label='系列名称'>
                <span>{detail.seriesName}</span>
              </Descriptions.Item>
              <Descriptions.Item label='通讯方式' className='no-padding'>
                <span>{detail.communicationMethodName}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className='line'></div>
          <div className='part-one'>
            <Descriptions column={1}>
              <Descriptions.Item label='创建时间'>
                <span>{formatTime(detail.createTime)}</span>
              </Descriptions.Item>
              <Descriptions.Item label='最近更新时间'>
                <span>{formatTime(detail.updateTime)}</span>
              </Descriptions.Item>
              <Descriptions.Item label='设备数目' className='no-padding'>
                <span>{detail.num}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <Button style={{ marginBottom: '12px' }} onClick={exportJson} type='primary'>
          导出
        </Button>
        <div>
          <JsonView json={json} />
        </div>
      </CardContainer>
    </>
  )
}

export default ModelDetailJson
