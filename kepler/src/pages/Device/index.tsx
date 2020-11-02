import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Cascader, Table, Button, Modal, message } from 'antd'
import request from '../../request/request'
import api from '../../api'
import Top from './Top'
import CardContainer from '../../components/CardContainer'
import FormForSearch from '../../components/FormForSearch'
import State from '../../components/State'
import { formatTime, downloadByOpenWindow } from '../../utils/utils'
import DeviceEdit from './DeviceEdit'
import DeviceEditCommand from './DeviceCommand'
import DeviceCount from './DeviceCount'
import { useHistory } from 'react-router-dom'
import { useQuery } from '../../hooks/common'
import exportBtnStyle from './css/ExportBtn.module.css'
import style from './css/index.module.css'
interface options {
  code: string
  name: string
  children?: Array<options>
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
const initalParams = {
  pageSize: 10,
  pageNum: 1
}

const initalPage = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total: number) {
    return `共 ${total} 条`
  }
}
const jsonArr = [
  {
    type: 'input',
    filed: 'code',
    placeholder: '请输入唯一码'
  },
  {
    type: 'select',
    filed: 'online',
    placeholder: '在离线',
    options: [
      {
        code: 'online',
        name: '在线'
      },
      {
        code: 'offline',
        name: '离线'
      }
    ]
  },
  {
    type: 'select',
    filed: 'status',
    placeholder: '异常状态',
    options: [
      {
        code: 'normal',
        name: '正常'
      },
      {
        code: 'fault',
        name: '异常'
      }
    ]
  },
  {
    type: 'datepicker',
    filed: 'lastOnlineTime',
    placeholder: '时间',
    picker: 'date',
    props: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: {
        format: 'HH:mm'
      },
      placeholder: ['最后上线时间', '最后上线时间']
    }
  }
]
// 检验保存在localStorage中选择的型号是否还存在
const hasMatch = (path: Array<string>, tree: Array<any>): Boolean => {
  let first = tree.filter((el) => el.id === path[0])
  if (first.length) {
    let second = first[0]
    let model = second.children.filter((el: any) => el.id === path[1])
    if (model.length) {
      return true
    }
  }
  return false
}

const DeviceCenter = () => {
  let history = useHistory()
  let query = useQuery()
  const searchRef = useRef<any>(null)
  const [visible, setVisible] = useState(false)
  const [commandVisible, setCommandVisible] = useState(false)
  const [count, setCount] = useState({})
  const [commands, setCommands] = useState([])
  const [cascaderWidth, setCascaderWidth] = useState('121px')
  const [pagination, setPagination] = useState<any>(initalPage)
  const [selectValue, setSelectValue] = useState<Array<number | string>>([])
  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'model':
        setPagination(initalPage)
        setSelectValue(action.payload)
        return {
          modelId: action.payload[1],
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
  const [options, setOptions] = useState<Array<options>>([])
  const [model, setModel] = useState<any>({})
  const [data, setData] = useState<Array<any>>([])
  const [deviceDetail, setDeviceDetail] = useState<any>('')
  const [belongAccount, setBelongAccount] = useState<any>([])
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const queryDeviceDetail = (id: string) => {
    let params = {
      id: id
    }
    return request.get(api.device.device_update, params).then((res) => {
      setDeviceDetail(res.data)
    })
  }
  const queryBelong = () => {
    return request.get(api.common.select_account).then((res) => {
      setBelongAccount([...expendAccountSelect, ...res.data])
    })
  }
  const queryModel = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setOptions(res.data)
      let device_select_model: any = ''
      if (query && query.select) {
        device_select_model = query.select
        localStorage.setItem('device_select_model', JSON.stringify(query.select))
      } else {
        try {
          device_select_model = JSON.parse(localStorage.getItem('device_select_model') || '')
        } catch (err) {}
        if (device_select_model && Array.isArray(device_select_model)) {
          if (!hasMatch(device_select_model, res.data)) {
            localStorage.removeItem('device_select_model')
            if (res.data && res.data.length) {
              device_select_model = [res.data[0].id, res.data[0].children[0].id]
            }
          }
        } else {
          localStorage.removeItem('device_select_model')
          if (res.data && res.data.length) {
            device_select_model = [res.data[0].id, res.data[0].children[0].id]
          }
        }
      }
      dispatch({
        type: 'model',
        payload: device_select_model
      })
    })
  }
  const queryModelDetail = () => {
    if (selectValue[1]) {
      let params = {
        id: selectValue[1]
      }
      request.get(api.system.model_model_detail, params).then((res) => {
        setModel(res.data)
      })
    }
  }
  const queryModelDevice = () => {
    if (selectValue[1]) {
      let queryParams = {
        // modelId: selectValue[1],
        ...params
      }
      setTableLoading(true)
      request
        .get(api.device.device_list, queryParams)
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
  const queryCount = () => {
    if (selectValue[1]) {
      let queryParams = {
        ...params
      }
      request.get(api.device.device_count, queryParams).then((res) => {
        setCount(res.data)
      })
    }
  }
  useEffect(queryModel, [])
  useEffect(queryModelDetail, [selectValue])
  useEffect(queryModelDevice, [params])
  useEffect(queryCount, [params])
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.reset()
    }
  }, [selectValue])
  const selectChange = (value: any) => {
    dispatch({
      type: 'model',
      payload: value
    })
    setModel(value)
    localStorage.setItem('device_select_model', JSON.stringify(value))
  }
  const search = (params: any) => {
    if (params.lastOnlineTime) {
      params.lastOnlineTime = [
        params.lastOnlineTime[0].format('YYYY-MM-DD HH:mm:ss'),
        params.lastOnlineTime[1].format('YYYY-MM-DD HH:mm:ss')
      ]
    }
    dispatch({
      type: 'params',
      payload: params
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
  const handleCommand = (val: any, row: any) => {
    queryCommands(row.id).then(() => {
      setDeviceDetail(row)
      setCommandVisible(true)
    })
  }
  const handleDelete = (val: any, row: any) => {
    Modal.confirm({
      content: `确认删除 ${row.code}?`,
      centered: true,
      onOk(close) {
        let params = {
          ids: [row.id]
        }
        return request
          .post(api.device.device_delete, params)
          .then((res) => {
            dispatch({
              type: 'page',
              payload: {
                ...pagination,
                current: 1
              }
            })
            queryModelDetail()
            message.success('删除成功')
          })
          .finally(() => {
            close()
          })
      }
    })
  }
  const handleEdit = (val: any, row: any) => {
    Promise.all([queryBelong(), queryDeviceDetail(row.id)]).then(() => {
      setVisible(true)
    })
    // setCurrentRow(row)
  }
  const handleDetail = (val: any, row: any) => {
    history.push(`/device/detail/${encodeURIComponent(row.code)}`)
  }
  const handlePageChange = (page: any) => {
    dispatch({
      type: 'page',
      payload: page
    })
  }
  // 导出设备
  const exportDevice = () => {
    let queryParams = {
      // modelId: selectValue[1],
      ...params,
      token: localStorage.getItem('login_token')
    }
    downloadByOpenWindow(api.device.device_export, queryParams)
  }
  const columns = [
    {
      title: '唯一码',
      dataIndex: 'code'
    },
    {
      title: '在线状态',
      dataIndex: 'online',
      render(val: string, row: any) {
        const color = val === 'online' ? 'blue' : 'gary'
        const textColor = val === 'offline' ? '#999' : ''
        return (
          <State style={{ color: textColor, margin: 0 }} color={color}>
            {row.onlineName}
          </State>
        )
      }
    },
    {
      title: '异常状态',
      dataIndex: 'status',
      render(val: string, row: any) {
        const color = val === 'normal' ? 'green' : 'red'
        return (
          <State color={color} style={{ margin: 0 }}>
            {row.statusName}
          </State>
        )
      }
    },
    {
      title: '最后上线时间',
      dataIndex: 'lastOnlineTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '离线时间',
      dataIndex: 'offlineTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '关联用户',
      dataIndex: 'accountName'
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render(text: any, record: any) {
        return (
          <>
            <Button type='text' onClick={(e) => handleCommand(e, record)} size='small'>
              指令下发
            </Button>
            <Button type='text' onClick={(e) => handleEdit(e, record)} size='small'>
              编辑
            </Button>
            <Button type='text' onClick={(e) => handleDetail(e, record)} size='small'>
              详情
            </Button>
            <Button type='text' onClick={(e) => handleDelete(e, record)} size='small'>
              删除
            </Button>
          </>
        )
      }
    }
  ]
  const dropdownRender = (menus: any) => {
    let width = cascaderWidth
    return (
      <div>
        <div className={style.cascaderContainer}>
          <span className={style.series} style={{ width }}>
            选择系列
          </span>
          <span className={style.model}>选择型号</span>
        </div>
        {menus}
      </div>
    )
  }
  const getWidth = (times: number) => {
    if (times === 0) return
    setTimeout(() => {
      let dom = document.querySelector('.ant-cascader-menus.model_cascader  .ant-cascader-menu')
      if (dom) {
        let width = window.getComputedStyle(dom).width
        setCascaderWidth(width)
      } else {
        getWidth(times - 1)
      }
    }, 100)
  }
  const onPopupVisibleChange = (value: boolean) => {
    if (value) {
      getWidth(3)
    }
  }
  return (
    <>
      <Cascader
        popupClassName='model_cascader'
        allowClear={false}
        style={{ marginBottom: '16px' }}
        options={options}
        fieldNames={{ label: 'name', value: 'id' }}
        value={selectValue}
        onChange={selectChange}
        displayRender={(label: any) => <span title={label.join('/')}>{label.join('/')}</span>}
        dropdownRender={dropdownRender}
        onPopupVisibleChange={onPopupVisibleChange}
      />
      <CardContainer>
        <Top
          detail={model}
          queryDeviceCount={queryCount}
          queryModelDetail={queryModelDetail}
          queryDevice={queryModelDevice}
        />
        <FormForSearch jsonArr={jsonArr} search={search} ref={searchRef} />
        <div style={{ position: 'relative', height: '40px' }}>
          <DeviceCount {...count} />
          <Button
            style={{ marginBottom: '8px' }}
            type='primary'
            onClick={exportDevice}
            className={exportBtnStyle.exportBtn}>
            导出
          </Button>
        </div>
        <Table
          // scroll={{ scrollToFirstRowOnChange: true, y: 600 }}
          pagination={pagination}
          columns={columns}
          dataSource={data}
          size='middle'
          loading={tableLoading}
          rowKey='id'
          onChange={handlePageChange}
        />
      </CardContainer>
      {visible && (
        <DeviceEdit
          detail={deviceDetail}
          belongAccount={belongAccount}
          visible={visible}
          setVisible={setVisible}
          row={{ modelId: deviceDetail.modelId, modelName: deviceDetail.modelName }}
          queryDevice={queryModelDevice}
          queryDeviceCount={queryCount}
        />
      )}
      {commandVisible && (
        <DeviceEditCommand
          commands={commands}
          visible={commandVisible}
          setVisible={setCommandVisible}
          {...{ code: deviceDetail.code, modelCode: deviceDetail.modelCode }}
          queryDevice={queryModelDevice}
        />
      )}
    </>
  )
}

export default DeviceCenter
