import React, { useEffect, useState } from 'react'
import { PageHeader, Tabs, Descriptions, Space, Button } from 'antd'
import CardContainer from '../../components/CardContainer'
import State from '../../components/State'
import './DeviceDetail.less'
import { useParams, useHistory } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'
import { formatTime } from '../../utils/utils'
import ExceptionRecord from './ExceptionRecord'
import RawRecord from './RawRecord'
import DeviceEditCommand from './DeviceCommand'
import OlineRecord from './OlineRecord'
import qs from 'qs'

const { TabPane } = Tabs

interface Detail {
  code: string
  name: string
  deviceCount: string
  seriesName: string
  id: string
  method: string
  createTime: string
  lastUpdateTime: string
}

const DeviceDetail = () => {
  const [detail, setDetail] = useState<any>({})
  const [commandVisible, setCommandVisible] = useState(false)
  const [commands, setCommands] = useState([])
  let { code } = useParams<any>()
  let history = useHistory()
  const queryDetail = () => {
    let params = {
      code: code
    }
    request.get(api.device.device_detail, params).then((res) => {
      setDetail(res.data)
    })
  }
  const queryCommands = (id: string) => {
    let params = {
      id
    }
    return request.get(api.device.device_command, params).then((res) => {
      setCommands(res.data)
    })
  }
  const handleCommand = () => {
    queryCommands(detail.id).then(() => {
      setCommandVisible(true)
    })
  }
  const toSingle = () => {
    let query = {
      modelId: detail.modelId,
      deviceCode: detail.code,
      modelCode: detail.modelCode
    }
    history.push(`/analysis/single?${qs.stringify(query)}`)
  }
  const toMultiple = () => {
    let query = {
      modelId: detail.modelId,
      deviceCode: detail.code,
      modelCode: detail.modelCode
    }
    history.push(`/analysis/multiple?${qs.stringify(query)}`)
  }
  useEffect(queryDetail, [code])
  return (
    <div className='device-detail'>
      <PageHeader
        className='model-detail-header'
        onBack={() => window.history.back()}
        title='设备详情'
      />
      <CardContainer>
        <div className='gray-container'>
          <div className='part-one'>
            <h3 className='device-detail-title'>{detail.code}</h3>
            <Descriptions column={1}>
              <Descriptions.Item>
                <Space>
                  <State
                    style={{ color: detail.online === 'online' ? '' : '#999' }}
                    color={detail.online === 'online' ? 'blue' : 'gray'}>
                    {detail.onlineName}
                  </State>
                  <State color={detail.status === 'normal' ? 'green' : 'red'}>
                    {detail.statusName}
                  </State>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label='型号名称'>
                <span>{detail.modelName}</span>
              </Descriptions.Item>
              <Descriptions.Item label='型号编码'>
                <span>{detail.modelCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label='系列名称' className='no-padding'>
                <span>{detail.seriesName}</span>
              </Descriptions.Item>
            </Descriptions>
            <div></div>
          </div>
          <div className='line'></div>
          <div className='part-one'>
            <h3 className='device-detail-title'>基础信息</h3>
            <Descriptions column={1}>
              <Descriptions.Item label='唯一码'>
                <span>{detail.code}</span>
              </Descriptions.Item>
              <Descriptions.Item label='IP地址'>
                <span>{detail.ip}</span>
              </Descriptions.Item>
              <Descriptions.Item label='设备添加时间'>
                <span>{formatTime(detail.createTime)}</span>
              </Descriptions.Item>
              <Descriptions.Item label='最后上线时间' className='no-padding'>
                <span>{formatTime(detail.lastOnlineTime)}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className='line'></div>
          <div className='part-one'>
            <h3 className='device-detail-title'>用户信息</h3>
            {detail.accountName ? (
              <Descriptions column={1}>
                <Descriptions.Item label='关联用户'>
                  <span>{detail.accountName}</span>
                </Descriptions.Item>
                <Descriptions.Item label='手机'>
                  <span>{detail.phone}</span>
                </Descriptions.Item>
                <Descriptions.Item label='邮箱' className='no-padding'>
                  <span>{detail.email}</span>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <div className='no-user'>无所属用户</div>
            )}
          </div>
          <div className='leave-part'>
            <Space direction='vertical'>
              <Button onClick={toSingle}>一维分析</Button>
              <Button onClick={toMultiple}>多维分析</Button>
              <Button type='primary' onClick={handleCommand}>
                指令下发
              </Button>
            </Space>
          </div>
        </div>
        <div className='tab-container'>
          <Tabs defaultActiveKey='1' type='card'>
            <TabPane tab='异常记录' key='1'>
              <ExceptionRecord
                modelId={detail.modelId}
                deviceCode={detail.code}
                code={detail.modelCode}></ExceptionRecord>
            </TabPane>
            <TabPane tab='上下线记录' key='2'>
              <OlineRecord deviceCode={detail.code} code={detail.modelCode} />
            </TabPane>
            <TabPane tab='原始数据' key='3'>
              <RawRecord
                modelId={detail.modelId}
                deviceCode={detail.code}
                code={detail.modelCode}
              />
            </TabPane>
          </Tabs>
        </div>
      </CardContainer>
      {commandVisible && (
        <DeviceEditCommand
          detail={detail}
          commands={commands}
          visible={commandVisible}
          setVisible={setCommandVisible}
          {...{ code: detail.code, modelCode: detail.modelCode }}
          queryDevice={queryDetail}
        />
      )}
    </div>
  )
}

export default DeviceDetail
