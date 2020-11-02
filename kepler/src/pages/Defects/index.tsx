import React, { useState, useCallback, useEffect, useReducer, useRef } from 'react'
import { Button, Cascader, Table, Tabs, Checkbox } from 'antd'
import { PieChartOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'
import './index.less'
import FormForSearch from '../../components/FormForSearch'
import CardContainer from '../../components/CardContainer'
import { formatTime } from '../../utils/utils'
import style from './css/index.module.css'
const tabs = [
  {
    name: '待处理',
    value: 'WAIT'
  },
  {
    name: '已处理',
    value: 'FINISH'
  },
  {
    name: '暂不处理',
    value: 'DELAY'
  },
  {
    name: '已关闭',
    value: 'CLOSE'
  },
  {
    name: '全部',
    value: null
  }
]
const plainOptions = [
  { label: '我创建的', value: 1 },
  { label: '指派给我的', value: 2, disabled: false }
]

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
const jsonArr = [
  {
    type: 'input',
    filed: 'id',
    placeholder: '编号'
  },
  {
    type: 'input',
    filed: 'topic',
    placeholder: '主题'
  },
  {
    type: 'select',
    filed: 'deviceCode',
    placeholder: '关联设备',
    query: ''
  },
  {
    type: 'select',
    filed: 'priority',
    placeholder: '优先级',
    options: [
      {
        code: 'low',
        name: '低'
      },
      {
        code: 'middle',
        name: '中'
      },
      {
        code: 'high',
        name: '高'
      }
    ]
  },
  {
    type: 'select',
    filed: 'assignedAdmin',
    placeholder: '指派给',
    query: ''
  },
  {
    type: 'datepicker',
    filed: 'createTime',
    placeholder: '时间',
    picker: 'date',
    props: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: {
        format: 'HH:mm'
      },
      placeholder: ['创建开始时间', '创建结束时间']
    }
  }
]
//获取地址参数
const getQueryString = (name: string) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r !== null) return unescape(r[2])
  return null
}

const Defect = () => {
  let history = useHistory()
  const pchildref = useRef<any>(null)
  const [modelCode, setModelCode] = useState<any>('')
  const [searchList, setSearchList] = useState<any>(jsonArr)
  const [options, setOptions] = useState([])
  const [data, setDate] = useState<any>([])
  const [cascaderWidth, setCascaderWidth] = useState('121px')
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>(initalPage)
  const [selectCount, setSelectCount] = useState(0)
  const [selectValue, setSelectValue] = useState<Array<number | string>>([])
  const [planOption, setPlanOption] = useState<any>(plainOptions)
  const [checkList, setCheckList] = useState<Array<number | string>>([])

  let assignedAdmin = null
  let tabSelect = 0
  if (window.location.search) {
    assignedAdmin =
      getQueryString('assignedAdmin') == 'undefined' ? null : getQueryString('assignedAdmin')
    const status = getQueryString('status')
    tabSelect =
      status == null || status == 'WAIT' ? 0 : status == 'FINISH' ? 1 : status == 'DELAY' ? 2 : 3
  }
  const paramsReducer = (state: any, action: any) => {
    setPagination(initalPage)
    switch (action.type) {
      case 'model':
        setSelectValue([action.payload[0], action.payload[1]])
        setModelCode(action.payload[1])
        jsonArr[2].query = api.common.select_device + '?modelId=' + action.payload[2]
        jsonArr[4].query = api.common.select_account_use + '?modelId=' + action.payload[2]
        setSearchList(jsonArr)
        return {
          modelCode: action.payload[1],
          status: getQueryString('status') || 'WAIT',
          assignedAdmin:
            getQueryString('assignedAdmin') == 'undefined' ? null : getQueryString('assignedAdmin'),
          ...initalParams
        }
      case 'tabs':
        return {
          modelCode: modelCode,
          status: action.payload.value,
          ...initalParams
        }
      case 'page':
        setPagination(action.payload)
        return {
          ...state,
          pageSize: action.payload.pageSize,
          pageNum: action.payload.current
        }
      case 'check':
        if (action.payload.assignedAdmin) {
          setPlanOption([
            { label: '我创建的', value: 1 },
            { label: '指派给我的', value: 2, disabled: true }
          ])
          action.payload.assignedToMe = false
          setCheckList([])
        } else {
          setPlanOption([
            { label: '我创建的', value: 1 },
            { label: '指派给我的', value: 2, disabled: false }
          ])
        }
        return {
          ...state,
          ...action.payload,
          pageNum: 1
        }
      case 'params':
        return {
          ...state,
          ...action.payload,
          pageNum: 1
        }
      default:
        throw new Error()
    }
  }

  const queryModel = () => {
    request.get(api.common.select_series_model_tree).then((res) => {
      setOptions(res.data)
      setSelectCount(tabSelect)
      if (res.data && res.data.length) {
        let arr: Array<any> = []
        if (localStorage.getItem('options') && localStorage.getItem('selectOption')) {
          let option = localStorage.getItem('options') || ''
          arr = JSON.parse(option)
        } else {
          arr = [res.data[0].code, res.data[0].children[0].code, res.data[0].children[0].id]
          localStorage.setItem('selectOption', JSON.stringify(res.data[0].children[0]))
          localStorage.setItem('options', JSON.stringify(arr))
        }
        dispatch({
          type: 'model',
          payload: arr
        })
      }
    })
  }
  const getDefects = () => {
    if (selectValue[1]) {
      setTableLoading(true)
      let queryParams = {
        ...params,
        modelCode: modelCode
      }
      request
        .get(api.flaw.flaw_list, queryParams)
        .then((res) => {
          setDate(res.data.list)
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

  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  useEffect(queryModel, [])
  useEffect(getDefects, [params, modelCode])
  const handleDetail = (val: any, row: any) => {
    history.push(`/defects/detail/` + row.id + '/' + modelCode)
  }
  const handleEdit = () => {
    window.open('/defects/edit/' + 0 + '/' + modelCode, '_blank')
    //history.push('/defects/edit/' + 0 + '/' + modelCode)
  }

  const selectChange = (value: any, options: any) => {
    let arr = value
    arr.push(options[1].id)
    localStorage.setItem('options', JSON.stringify(arr))
    localStorage.setItem('selectOption', JSON.stringify(options[1]))
    pchildref.current.reset()
    setSelectCount(0)
    setCheckList([])
    dispatch({
      type: 'model',
      payload: arr
    })
  }

  const changeTab = (index: number, item: any) => {
    pchildref.current.reset()
    setCheckList([])
    dispatch({
      type: 'tabs',
      payload: item
    })
    setSelectCount(index)
  }
  const search = (params: any) => {
    if (params.createTime) {
      params.startTime = formatTime(params.createTime[0]._d)
      params.endTime = formatTime(params.createTime[1]._d)
    } else {
      params.startTime = null
      params.endTime = null
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
  const handleChart = () => {
    //history.push(`/defects/chart`)
    window.open(`/defects/chart`, '_blank')
  }

  const onChange = (checkedValue: any) => {
    setCheckList(checkedValue)
    let parm = {
      iCreate: false,
      assignedToMe: false
    }
    checkedValue.map((i: number) => {
      if (i == 1) {
        parm.iCreate = true
      }
      if (i == 2) {
        parm.assignedToMe = true
      }
    })
    dispatch({
      type: 'check',
      payload: parm
    })
  }
  //设备下拉框
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
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      width: '150',
      className: 'code'
    },
    {
      title: '主题',
      dataIndex: 'topic'
    },
    {
      title: '关联设备',
      dataIndex: 'deviceCodeList',
      render(val: []) {
        let data = val.length > 3 ? val.slice(0, 3).toString() + '...' : val.toString()
        return data
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      className: selectCount > 3 ? 'show' : 'notshow',
      render(val: string) {
        const color =
          val === 'WAIT'
            ? 'wait'
            : val === 'FINISH'
            ? 'finish'
            : val === 'DELAY'
            ? 'dblay'
            : 'close'
        return (
          <span>
            <span className={['anchor', color].join(' ')}></span>
            <span>
              {' '}
              {val === 'WAIT'
                ? '待处理'
                : val === 'FINISH'
                ? '已处理'
                : val === 'DELAY'
                ? '暂不处理'
                : '已关闭'}
            </span>
          </span>
        )
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render(val: string) {
        return val === 'low' ? '低' : val === 'middle' ? '中' : '高'
      }
    },
    {
      title: '指派给',
      dataIndex: 'assignedAdminName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(text: any, record: any) {
        return (
          <>
            <Button type='text' onClick={(e) => handleDetail(e, record)} size='small'>
              详情{' '}
            </Button>
          </>
        )
      }
    }
  ]
  return (
    <div className='defect'>
      <Cascader
        style={{ marginBottom: '16px' }}
        allowClear={false}
        options={options}
        fieldNames={{ label: 'name', value: 'code', children: 'children' }}
        value={selectValue}
        autoFocus={true}
        onChange={selectChange}
        displayRender={(label: any) => <span title={label.join('/')}>{label.join('/')}</span>}
        dropdownRender={dropdownRender}
        onPopupVisibleChange={onPopupVisibleChange}
      />
      <Button
        type='primary'
        className='statistics'
        icon={<PieChartOutlined />}
        size='large'
        onClick={handleChart}>
        缺陷统计
      </Button>
      <ul className='tbs'>
        {tabs.map((item, index) => {
          return (
            <li
              key={index}
              className={selectCount === index ? 'active' : undefined}
              onClick={() => changeTab(index, item)}>
              <span>{item.name}</span>
              <span
                className='divider'
                style={{
                  display:
                    selectCount === index || index === 0 || selectCount === index - 1
                      ? 'none'
                      : 'inline-block'
                }}></span>
            </li>
          )
        })}
      </ul>
      <CardContainer>
        <FormForSearch
          jsonArr={searchList}
          search={search}
          assignedAdmin={assignedAdmin}
          ref={pchildref}
        />
        <Checkbox.Group
          className='marginBottom'
          value={checkList}
          options={planOption}
          onChange={onChange}
        />
        <Button type='primary' className='floatLeft' onClick={handleEdit}>
          创建缺陷
        </Button>
        <Table
          pagination={pagination}
          columns={columns}
          dataSource={data}
          size='middle'
          loading={tableLoading}
          rowKey='id'
          onChange={handlePageChange}
        />
      </CardContainer>
    </div>
  )
}

export default Defect
