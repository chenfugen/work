import React, { useEffect, useState } from 'react'
import { PageHeader, Tabs, Descriptions, Button } from 'antd'
import ParamsTable from './ParamsTable'
import ScriptTable from './ScriptTable'
import AccountTable from './AccountTable'
import ExceptionTable from './ExceptionTable'
import CommandTable from './CommandTable'
import CardContainer from '../../../components/CardContainer'
import State from '../../../components/State'
import './ModelDetail.less'
import { useParams } from 'react-router-dom'
import request from '../../../request/request'
import api from '../../../api'
import { formatTime } from '../../../utils/utils'
import ModelEdit from './ModelEdit'
import { Link } from 'react-router-dom'
import qs from 'qs'
import { useRole } from './hooks'

const { TabPane } = Tabs

const pahseColor: any = {
  research: 'blue',
  research_complete: 'green'
}

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

const ModelDetail = () => {
  const role = useRole('/system/model')
  const paramsRole = useRole('_/model/params')
  const commandRole = useRole('_/model/command')
  const accountRole = useRole('_/model/account')
  const exceptionRole = useRole('_/model/exception')
  const scriptRole = useRole('_/model/script')
  const [needShowTab, setNeedShowTab] = useState(true)
  const [detail, setDetail] = useState<any>({})
  const [modelDetail, setModelDetail] = useState<any>('')
  const [visible, setVisible] = useState(false)
  const [phases, setPhases] = useState([])
  const [activeKey, setActiveKey] = useState('4')
  let { id } = useParams<any>()
  const queryPhases = () => {
    return request.get(api.common.select_phase).then((res) => {
      setPhases(res.data)
    })
  }
  const queryDetail = () => {
    let params = {
      id
    }
    request.get(api.system.model_model_detail, params).then((res) => {
      setDetail(res.data)
    })
  }
  useEffect(() => {
    let arr = [
      paramsRole.searchRole,
      paramsRole.editRole,
      commandRole.searchRole,
      commandRole.editRole,
      accountRole.searchRole,
      accountRole.editRole,
      exceptionRole.searchRole,
      exceptionRole.editRole,
      scriptRole.searchRole,
      scriptRole.editRole
    ].filter(Boolean)
    setNeedShowTab(arr.length !== 0)
  }, [paramsRole, commandRole, accountRole, exceptionRole, scriptRole])
  const queryModelDetail = (id: string) => {
    let params = {
      id: id
    }
    return request.get(api.system.model_model_detail, params).then((res) => {
      setModelDetail(res.data)
    })
  }
  useEffect(queryDetail, [id])
  const editModel = () => {
    Promise.all([queryPhases(), queryModelDetail(detail.id)]).then(() => {
      setVisible(true)
    })
  }
  return (
    <>
      <PageHeader
        className='model-detail-header'
        onBack={() => window.history.back()}
        title='产品型号详情'
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
                <Link
                  style={{ color: '#537ae6' }}
                  to={{
                    pathname: '/device',
                    search: qs.stringify({
                      select: [detail.seriesId, detail.id]
                    })
                  }}>
                  {detail.num}
                </Link>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className='leave-part'>
            {role.editRole ? (
              <Button type='primary' onClick={editModel}>
                编辑
              </Button>
            ) : null}
          </div>
        </div>
        {needShowTab ? (
          <div className='tab-container'>
            <Tabs type='card' onChange={(key) => setActiveKey(key)}>
              {paramsRole.searchRole || paramsRole.editRole ? (
                <TabPane tab='属性配置' key='1'>
                  <ParamsTable id={id} queryDetail={() => queryDetail()} role={paramsRole} />
                </TabPane>
              ) : null}
              {commandRole.searchRole || commandRole.editRole ? (
                <TabPane tab='指令配置' key='2'>
                  <CommandTable id={id} queryDetail={() => queryDetail()} role={commandRole} />
                </TabPane>
              ) : null}
              {accountRole.searchRole || accountRole.editRole ? (
                <TabPane tab='相关人员' key='3'>
                  <AccountTable id={id} role={accountRole} />
                </TabPane>
              ) : null}
              {exceptionRole.searchRole || exceptionRole.editRole ? (
                <TabPane tab='异常配置' key='4'>
                  <ExceptionTable
                    role={exceptionRole}
                    id={id}
                    active={activeKey === '4'}
                    queryDetail={() => queryDetail()}
                  />
                </TabPane>
              ) : null}
              {scriptRole.searchRole || scriptRole.editRole ? (
                <TabPane tab='脚本配置' key='5'>
                  <ScriptTable id={id} queryDetail={() => queryDetail()} role={scriptRole} />
                </TabPane>
              ) : null}
            </Tabs>
          </div>
        ) : null}
      </CardContainer>
      {visible && (
        <ModelEdit
          visible={visible}
          setVisible={setVisible}
          {...{ seriesId: detail.seriesId, seriesName: detail.seriesName }}
          detail={modelDetail}
          phases={phases}
          queryModels={() => queryDetail()}
        />
      )}
    </>
  )
}

export default ModelDetail
