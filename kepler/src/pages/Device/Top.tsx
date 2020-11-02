import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Space, message } from 'antd'
import { formatTime } from '../../utils/utils'
import State from '../../components/State'
import DeviceEdit from './DeviceEdit'
import DeviceImport from './DeviceImport'
import request from '../../request/request'
import api from '../../api'

const pahseColor: any = {
  research: 'blue',
  research_complete: 'green'
}

const expendAccountSelect = [
  {
    code: '',
    name: '无',
    native: true
  },
  {
    code: 'outer',
    name: '外部人员',
    native: true
  }
]

const Top = (props: any) => {
  const [visible, setVisible] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [belongAccount, setBelongAccount] = useState<any>([])
  const [importVisible, setImportVisible] = useState(false)
  const addDevice = () => {
    queryBelong().then(() => {
      setVisible(true)
    })
  }
  const queryBelong = () => {
    return request.get(api.common.select_account).then((res) => {
      setBelongAccount([...expendAccountSelect, ...res.data])
    })
  }
  useEffect(() => {
    if (props.detail) {
      setDetail(props.detail)
    }
  }, [props.detail])
  return (
    <>
      <div className='gray-container'>
        <div className='part-one'>
          <h3 style={{ fontWeight: 'bold' }}>{detail.name}</h3>
          <State color={pahseColor[detail.phase]}>{detail.phaseName}</State>
          <Descriptions column={1}>
            <Descriptions.Item label='型号编码' className='no-padding'>
              <span>{detail.code}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className='line'></div>
        <div className='part-one'>
          <Descriptions column={1}>
            <Descriptions.Item label='通讯方式'>
              <span>{detail.communicationMethodName}</span>
            </Descriptions.Item>
            <Descriptions.Item label='创建时间'>
              <span>{formatTime(detail.createTime)}</span>
            </Descriptions.Item>
            <Descriptions.Item label='最近更新时间' className='no-padding'>
              <span>{formatTime(detail.updateTime)}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div className='part-one'></div>
        <div className='leave-part'>
          <Space direction='vertical'>
            <Button onClick={addDevice} type='primary'>
              添加设备
            </Button>
            <Button onClick={() => setImportVisible(true)}>设备导入</Button>
          </Space>
        </div>
      </div>
      {visible && (
        <DeviceEdit
          belongAccount={belongAccount}
          visible={visible}
          detail=''
          queryModelDetail={props.queryModelDetail}
          setVisible={setVisible}
          row={{ modelId: detail.id, modelName: detail.name }}
          queryDevice={props.queryDevice}
          queryDeviceCount={props.queryDeviceCount}
        />
      )}
      {importVisible && (
        <DeviceImport
          visible={importVisible}
          setVisible={setImportVisible}
          {...{ modelId: detail.id }}
          queryDevice={props.queryDevice}
          queryDeviceCount={props.queryDeviceCount}
        />
      )}
    </>
  )
}

export default Top
