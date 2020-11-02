import React, { useEffect, useState, useReducer } from 'react'
import { Button, Table, message } from 'antd'
import request from '../../request/request'
import api from '../../api'
import { formatTime, formatDisplayTime } from '../../utils/utils'
import FormForSearch from '../../components/FormForSearch'
import { useRouteMatch, useHistory, Link } from 'react-router-dom'
import style from './css/ExportBtn.module.css'
import { createMovtion } from '../../components/Download/Movtion'

const initalPage = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total: number) {
    return `共 ${total} 条`
  }
}

const initalParams = {
  pageSize: 10,
  pageNum: 1
}

const ExceptionRecord = (props: any) => {
  let { url } = useRouteMatch()
  let history = useHistory()
  const [data, setData] = useState([])
  const [exportLoading, setExportLoading] = useState(false)
  const [pagination, setPagination] = useState<any>(initalPage)
  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'model':
        setPagination(initalPage)
        return {
          code: action.payload.code,
          deviceCode: action.payload.deviceCode,
          ...initalParams
        }
      case 'page':
        setPagination(action.payload)
        return {
          ...state,
          pageSize: action.payload.pageSize,
          pageNum: action.payload.current
        }
      case 'params':
        setPagination({
          current: 1,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: pagination.showTotal
        })
        return {
          ...state,
          ...action.payload,
          pageNum: 1
        }
      default:
        throw new Error()
    }
  }
  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const queryExceptionRecord = () => {
    if (params.code && params.deviceCode) {
      let queryParams = {
        ...params
      }
      setTableLoading(true)
      request
        .get(api.device.device_detail_exception_list, queryParams)
        .then((res) => {
          setData(res.data.list)
          setPagination({
            ...pagination,
            total: res.data.total
          })
        })
        .finally(() => {
          setTableLoading(false)
        })
    }
  }
  useEffect(() => {
    if (props.code && props.deviceCode) {
      dispatch({
        type: 'model',
        payload: {
          code: props.code,
          deviceCode: props.deviceCode
        }
      })
    }
  }, [props.code, props.deviceCode])
  useEffect(queryExceptionRecord, [params])
  const handleExport = () => {
    let queryParams = {
      ...params
    }
    setExportLoading(true)
    // setTimeout(() => {
    //   createMovtion('export_movtion_start', 'export_movtion_end')
    //   message.success('正在导出, 请到右上角导出列表查看')
    //   setExportLoading(false)
    // }, 2000);
    request
      .get(api.device.device_detail_exception_export, queryParams)
      .then((res) => {
        createMovtion('export_movtion_start', 'export_movtion_end')
        message.success('正在导出, 请到右上角导出列表查看')
      })
      .finally(() => {
        setExportLoading(false)
      })
  }
  const handleDetail = (e: any, row: any) => {
    // window.open(`${url}/exception/${row.id}`, '_blank')
    history.push(`${url}/exception/${row.id}`)
  }
  const search = (params: any) => {
    if (params.triggerAlarmTime) {
      params.triggerAlarmTime = [
        params.triggerAlarmTime[0].format('YYYY-MM-DD HH:mm:ss'),
        params.triggerAlarmTime[1].format('YYYY-MM-DD HH:mm:ss')
      ]
    }
    dispatch({
      type: 'params',
      payload: params
    })
  }
  const handlePageChange = (page: any) => {
    dispatch({
      type: 'page',
      payload: page
    })
  }
  const formJson = [
    {
      type: 'select',
      filed: 'param',
      query: api.common.select_property + `?modelId=${props.modelId}`,
      placeholder: '属性',
      label: {
        value: 'param',
        name: 'name'
      }
    },
    {
      type: 'datepicker',
      filed: 'triggerAlarmTime',
      picker: 'date',
      props: {
        format: 'YYYY-MM-DD HH:mm',
        showTime: {
          format: 'HH:mm'
        },
        placeholder: ['触发异常时间', '触发异常时间']
      }
    },
    {
      type: 'input',
      filed: 'flaw',
      placeholder: '输入缺陷编码或标题'
    }
  ]
  const columns = [
    {
      title: '属性标识符',
      dataIndex: 'propertyCode'
    },
    {
      title: '属性名称',
      dataIndex: 'propertyName'
    },
    {
      title: '单位',
      dataIndex: 'propertyUnit'
    },
    {
      title: '关联缺陷',
      dataIndex: 'flawDtos',
      render(flawDtos: Array<any>) {
        return (
          <>
            {flawDtos.map((flaw: any, index: number) => {
              return (
                <span key={flaw.id}>
                  <Link
                    style={{ color: '#537ae6' }}
                    to={{
                      pathname: `/defects/detail/${flaw.id}/${props.code}`
                    }}>
                    {flaw.id}
                  </Link>
                  {index === flawDtos.length - 1 ? '' : ', '}
                </span>
              )
            })}
          </>
        )
      }
    },
    {
      title: '触发异常时间',
      dataIndex: 'startTime',
      render(time: number) {
        return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '解除异常时间',
      dataIndex: 'endTime',
      render(time: number) {
        return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
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
      dataIndex: 'action',
      render(_: any, row: any) {
        return (
          <>
            <Button type='text' onClick={(e) => handleDetail(e, row)} size='small'>
              详情
            </Button>
          </>
        )
      }
    }
  ]
  return (
    <>
      <div style={{ position: 'relative' }}>
        {!!props.modelId && <FormForSearch jsonArr={formJson} search={search} />}
        <Button
          id='export_movtion_start'
          loading={exportLoading}
          type='primary'
          onClick={handleExport}
          style={{ marginBottom: '8px' }}
          className={style.exportBtn}>
          导出
        </Button>
      </div>
      <Table
        loading={tableLoading}
        rowKey='id'
        dataSource={data}
        columns={columns}
        size='middle'
        onChange={handlePageChange}
        pagination={pagination}
      />
    </>
  )
}

export default ExceptionRecord
