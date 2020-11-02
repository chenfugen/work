import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Timeline, Modal, Select, Image, Empty } from 'antd'
import { PaperClipOutlined } from '@ant-design/icons'
import CardContainer from '../../components/CardContainer'
import './index.less'
import { formatDisplayTime, formatTime } from '../../utils/utils'
import { useHistory, useParams } from 'react-router-dom'
import DefectDispose from './model'
import request from '../../request/request'
import api from '../../api'

const initalPage = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total: number) {
    return `共 ${total} 条`
  }
}

interface Detail {
  assignedAdmin: string
  attachment: any
  deviceCode: []
  creator: string
  seriesName: string
  id: string
  modelCode: string
  priority: string
  status: string
  topic: string
  createTime: string
}

const DefectDetail = () => {
  let history = useHistory()
  let { id, modelCode } = useParams()
  const [data, setDate] = useState<any>([])
  const [detail, setDetail] = useState<any>({})
  const [process, setProcess] = useState<any>([])
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [isShowModal, setIsShowModal] = useState<boolean>(false)

  const handleDetail = (val: any, row: any) => {
    history.push('/device/detail/' + row.deviceCode + '/exception/' + row.id)
  }

  const showModal = () => {
    setIsShowModal(true)
  }

  const handleEdit = () => {
    history.push(`/defects/edit/` + id + '/' + modelCode)
  }
  const defectDetail = () => {
    let params = {
      id,
      modelCode
    }
    request.get(api.flaw.flaw_detail, params).then((res) => {
      setDetail(res.data)
    })
  }
  const getErrorList = () => {
    let params = {
      id,
      modelCode
    }
    request.get(api.flaw.flaw_alarm_list, params).then((res) => {
      setTableLoading(false)
      setDate(res.data)
    })
  }
  const getDefect_process = () => {
    let params = {
      id,
      modelCode
    }
    request.get(api.flaw.flaw_process, params).then((res) => {
      setProcess(res.data)
    })
  }

  useEffect(defectDetail, [id, modelCode])
  useEffect(getErrorList, [id, modelCode])
  useEffect(getDefect_process, [id, modelCode])
  const columns = [
    {
      title: '设备SN',
      dataIndex: 'deviceCode'
    },
    {
      title: '属性名称',
      dataIndex: 'propertyName'
    },
    {
      title: '标识符',
      dataIndex: 'propertyCode'
    },
    {
      title: '单位',
      dataIndex: 'propertyUnit'
    },
    {
      title: '触发异常时间',
      dataIndex: 'startTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '接触异常时间',
      dataIndex: 'endTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '异常持续时间',
      dataIndex: 'alarmTime',
      render(time: number) {
        return formatDisplayTime(time)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 230,
      render(text: any, record: any) {
        return (
          <>
            <Button type='text' onClick={(e) => handleDetail(e, record)} size='small'>
              详情
            </Button>
          </>
        )
      }
    }
  ]
  return (
    <div className='defectDetail'>
      <CardContainer>
        <div className='header'>
          <div className='tag'>
            <span
              className={[
                'anchor',
                detail.status === 'WAIT'
                  ? 'wait'
                  : detail.status === 'FINISH'
                  ? 'finish'
                  : detail.status === 'DELAY'
                  ? 'dblay'
                  : 'close'
              ].join(' ')}>
              {' '}
            </span>
            <strong>
              {detail.status === 'WAIT'
                ? '待处理'
                : detail.status === 'FINISH'
                ? '已处理'
                : detail.status === 'DELAY'
                ? '暂不处理'
                : '已关闭'}
            </strong>
          </div>
          <span className='fault'>{detail.topic}</span>
          <Button
            style={{ display: detail.status === 'CLOSE' ? 'none' : 'block' }}
            type='primary'
            size='large'
            onClick={handleEdit}>
            编辑
          </Button>
          <Button type='primary' size='large' onClick={showModal}>
            {detail.status === 'CLOSE' ? '重新开启' : '处理'}
          </Button>
        </div>
        <div className='content'>
          <div className='details'>
            <p className='navigation'>
              <span className='strip'></span>
              <span className='subhead'>详细信息</span>
            </p>
            <div className='detailBox'>
              <p className='describe'>{detail.des}</p>
              <h4 style={{ display: detail.attachment == false ? 'none' : 'block' }}>附件：</h4>
              <ul
                style={{ display: detail.attachment == false ? 'none' : 'block' }}
                className='attachmentLsit'>
                {(detail.attachment || []).map((item: any, index: number) => {
                  if (
                    ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
                      item.name.split('.')[1]
                    ) !== -1
                  ) {
                    return (
                      <li key={index}>
                        <Image
                          width={150}
                          alt={item.name}
                          src={api.file.file_read + '?id=' + item.id}
                        />
                      </li>
                    )
                  } else if (['mp4', 'rmvb', 'avi', 'ts'].indexOf(item.name.split('.')[1]) !== -1) {
                    return (
                      <li key={index}>
                        <video
                          src={api.file.file_read + '?id=' + item.id}
                          width='400'
                          height='240'
                          controls>
                          您的浏览器不支持 video 标签。
                        </video>
                      </li>
                    )
                  } else {
                    return (
                      <li key={index}>
                        <PaperClipOutlined />
                        <a href={api.file.file_read + '?id=' + item.id}> {item.name}</a>
                      </li>
                    )
                  }
                })}
              </ul>
              <div style={{ display: data.length == 0 ? 'none' : 'block' }}>
                <h4>关联异常</h4>
                <Table
                  columns={columns}
                  dataSource={data}
                  size='middle'
                  loading={tableLoading}
                  rowKey='id'
                />
              </div>
            </div>
            <p className='navigation'>
              <span className='strip'></span>
              <span className='subhead'>处理过程</span>
            </p>
            <div className='processes'>
              <Timeline>
                {process.map((item: any, index: number) => {
                  return (
                    <Timeline.Item
                      key={index}
                      color={
                        item.status === 'WAIT'
                          ? 'red'
                          : item.status === 'FINISH'
                          ? 'green'
                          : item.status === 'DELAY'
                          ? undefined
                          : 'gray'
                      }>
                      <p>
                        {formatTime(item.createTime) || '--'}{' '}
                        <span className='user'>{item.creatorName}</span>
                      </p>
                      <p>
                        <span className='label'>状态变更：</span>
                        <span className='value'>
                          <span
                            className={[
                              'anchor',
                              item.status === 'WAIT'
                                ? 'wait'
                                : item.status === 'FINISH'
                                ? 'finish'
                                : item.status === 'DELAY'
                                ? 'dblay'
                                : 'close'
                            ].join(' ')}>
                            {' '}
                          </span>
                          <span className='status'>
                            {' '}
                            {item.status === 'WAIT'
                              ? '待处理'
                              : item.status === 'FINISH'
                              ? '已处理'
                              : item.status === 'DELAY'
                              ? '暂不处理'
                              : '已关闭'}
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className='label'>说明：</span>
                        <span className='value'>
                          {' ' + (item.explanation || '--')}
                          <span className='attachmentLsit'>
                            {(item.attachment || []).map((file: any, index: number) => {
                              return (
                                <span className='files' key={index}>
                                  <PaperClipOutlined />
                                  <a href={api.file.file_read + '?id=' + file.id}> {file.name}</a>
                                </span>
                              )
                            })}
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className='label'>指派给：</span>
                        <span className='value'>{item.assignedAdminName} </span>
                      </p>
                    </Timeline.Item>
                  )
                })}
              </Timeline>
              <Empty
                style={{ display: process.length == 0 ? 'block' : 'none' }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </div>
          <div className='info'>
            <p className='navigation'>
              <span className='strip'> </span>
              <span className='subhead'>基本信息</span>
            </p>
            <ul className='infoList'>
              <li>
                <span className='label'>缺陷编号：</span>
                <span className='value'>{detail.id}</span>
              </li>
              <li>
                <span className='label'>设备型号：</span>
                <span className='value'>{detail.modelName}</span>
              </li>
              <li>
                <span className='label'>创建人：</span>
                <span className='value'>{detail.creatorName}</span>
              </li>
              <li>
                <span className='label'>创建时间：</span>
                <span className='value'>{formatTime(detail.createTime)}</span>
              </li>
              <li>
                <span className='label'>优先级：</span>
                <span className='value'>
                  {detail.priority === 'low' ? '低' : detail.priority === 'middle' ? '中' : '高'}
                </span>
              </li>
              <li>
                <span className='label'>
                  {detail.status == 'WAIT' || detail.status == 'DELAY' ? '当前指派：' : '修复人：'}
                </span>
                <span className='value'>
                  {detail.status == 'WAIT' || detail.status == 'DELAY'
                    ? detail.assignedAdminName
                    : detail.repairAdminName}
                </span>
              </li>
              <li>
                <span className='label'>关联设备：</span>
                <span className='value'>
                  {(detail.deviceCode || []).map((item: string, index: number) => {
                    return <p key={index}>{item}</p>
                  })}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContainer>
      {isShowModal && (
        <DefectDispose
          visible={isShowModal}
          setVisible={setIsShowModal}
          detail={detail}
          updateDetail={defectDetail}
          updateProcess={getDefect_process}>
          {' '}
        </DefectDispose>
      )}
    </div>
  )
}

export default DefectDetail
