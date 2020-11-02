import React, { useEffect, useState, useReducer } from 'react'
import { Button, Table, message } from 'antd'
import request from '../../request/request'
import api from '../../api'
import { formatTime } from '../../utils/utils'
import FormForSearch from '../../components/FormForSearch'
import moment from 'moment'
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
  pageNum: 1,
  triggerAlarmTime: [
    moment().hours(0).minutes(0).seconds(0).format('YYYY-MM-DD HH:mm:ss'),
    moment().format('YYYY-MM-DD HH:mm:ss')
  ]
}

const initColumns = [
  {
    title: '上报时间',
    dataIndex: 'uploadTime',
    render(time: number) {
      return formatTime(time, 'YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: 'loading',
    dataIndex: 'loading'
  }
]

const RawRecord = (props: any) => {
  const [columns, setColums] = useState(initColumns)
  const [data, setData] = useState([])
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
  const queryOlineRecord = () => {
    if (params.code && params.deviceCode) {
      let queryParams = {
        ...params
      }
      setTableLoading(true)
      request
        .get(api.device.device_detail_raw_list, queryParams)
        .then((res) => {
          res.data.list.forEach((el: any, index: number) => {
            el._index = index
          })
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
  }, [props])
  useEffect(() => {
    if (props.modelId) {
      console.log('modelID', props.modelId)
      let params = {
        modelId: props.modelId
      }
      request.get(api.common.select_property, params).then((res) => {
        let newColums = [
          initColumns[0],
          ...res.data.map((item: any) => {
            return {
              title: item.name,
              dataIndex: item.param
            }
          })
        ]
        setColums(newColums)
      })
    }
  }, [props.modelId])
  useEffect(queryOlineRecord, [params])
  const handleExport = () => {
    let queryParams = {
      ...params
    }
    request.get(api.device.device_detail_raw_export, queryParams).then((res) => {
      createMovtion('export_movtion_start_raw', 'export_movtion_end')
      message.success('正在导出, 请到右上角导出列表查看')
    })
  }
  const search = (params: any) => {
    if (params.triggerAlarmTime) {
      // 使用moment克隆一个时间copy,防止篡改原来时间
      let before = moment(params.triggerAlarmTime[0])
      let after = moment(params.triggerAlarmTime[1])
      if (before.isBefore(after.add(-3, 'months'))) {
        return message.warning('暂不支持查询时间跨度超过3个月的数据，请缩短时间范围')
      }
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
      type: 'datepicker',
      filed: 'triggerAlarmTime',
      picker: 'date',
      initialValues: [moment().add(0, 'days').hours(0).minutes(0).seconds(0), moment()],
      props: {
        format: 'YYYY-MM-DD HH:mm',
        showTime: {
          format: 'HH:mm'
        }
        // defaultValue: [
        //   moment().add(0, 'days').hours(0).minutes(0).seconds(0),
        //   moment()
        // ]
      }
    }
  ]

  return (
    <>
      <div style={{ position: 'relative' }}>
        <FormForSearch jsonArr={formJson} search={search} />
        <Button
          type='primary'
          onClick={handleExport}
          className={style.exportBtn}
          id='export_movtion_start_raw'>
          导出
        </Button>
      </div>
      <Table
        loading={tableLoading}
        rowKey='_index'
        dataSource={data}
        columns={columns}
        size='middle'
        onChange={handlePageChange}
        pagination={pagination}
      />
    </>
  )
}

export default RawRecord
