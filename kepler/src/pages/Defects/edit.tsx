import React, { useState, useEffect, useReducer } from 'react'
import { Form, Select, Input, Button, Upload, Divider, Table, message, Modal } from 'antd'
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import './index.less'
import CardContainer from '../../components/CardContainer'
import FormForSearch from '../../components/FormForSearch'
import { formatTime, formatDisplayTime } from '../../utils/utils'
import { useHistory, useParams } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'
const { confirm } = Modal
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 7 }
}

const jsonArr = [
  {
    type: 'input',
    filed: 'deviceCode',
    placeholder: '请输入设备SN'
  },
  {
    type: 'select',
    filed: 'param',
    placeholder: '请选择属性',
    query: '',
    label: { value: 'param', name: 'name' }
  },
  {
    type: 'datepicker',
    filed: 'triggerAlarmTime[]',
    placeholder: '触发异常',
    picker: 'date',
    props: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: {
        format: 'HH:mm'
      },
      placeholder: ['触发异常开始时间', '触发异常结束时间']
    }
  }
]

const initalParams = {
  pageSize: 10000,
  pageNum: 1
}

const deletefiles: any = []
const DefectEdit = () => {
  let history = useHistory()
  let { id, modelCode } = useParams()
  const activeName = id == 0 ? '创建缺陷' : '编辑缺陷'
  const model = JSON.parse(
    localStorage.getItem('selectOption') ||
      '{code: "sy01", id: "d58fa79d496f483c83f2bd472937c1e1",name: "净水器"}'
  )
  jsonArr[1].query = api.common.select_property + '?modelId=' + model.id
  const [form] = Form.useForm()
  const [account, setAccount] = useState<any>([])
  const [attachmentList, setAttachmentList] = useState<any>([])
  const [files, setFiles] = useState<any>([])
  const [deviceList, setDeviceList] = useState<any>([])
  const [detail, setDetail] = useState<any>({})
  const [data, setDate] = useState<any>([])
  const [tableLoading, setTableLoading] = useState<boolean>(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [removeFiles, setRemoveFiles] = useState<any>([])

  const paramsReducer = (state: any, action: any) => {
    switch (action.type) {
      case 'page':
        return {
          ...state
        }
      case 'params':
        return {
          ...state,
          ...action.payload,
          pageNum: 1,
          pageSize: 10000
        }
      default:
        throw new Error()
    }
  }
  //保存
  const save = (url: string, formData: any) => {
    request
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.success) {
          let msg = id == 0 ? '创建成功' : '编辑成功'
          message.success(msg)
        } else {
          message.warning(res.msg)
        }
      })
      .finally(() => {
        if (id == 0) {
          history.push('/defects')
        } else {
          history.goBack()
        }
      })
  }

  //删除
  const onDelete = () => {
    request
      .post(api.flaw.flaw_delete, {
        id: id,
        fileIds: removeFiles.toString(),
        modelCode: modelCode
      })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
        }
      })
  }
  const onFinish = (values: any) => {
    const formData = new FormData()
    let apiUrl: string
    if (id == 0) {
      apiUrl = api.flaw.flaw_add
    } else {
      formData.append('id', id)
      apiUrl = api.flaw.flaw_update
    }

    formData.append('modelCode', modelCode)
    formData.append('topic', values.topic)
    formData.append('describe', values.describe)
    formData.append('priority', values.priority)
    if (values.assignedAdmin) {
      formData.append('assignedAdmin', values.assignedAdmin)
    }
    if (values.deviceCodeList) {
      formData.append('deviceCodeList[]', values.deviceCodeList.toString())
    }
    formData.append('alarmIdList[]', selectedRowKeys.length > 0 ? selectedRowKeys.toString() : '0')
    files.forEach((file: any) => {
      formData.append('attachmentList', file.originFileObj)
    })
    if (removeFiles.length > 0) {
      confirm({
        title: '提示',
        content: '确定要删除相应描述文件吗？',
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          Promise.all([onDelete(), save(apiUrl, formData)]).then(() => {
            console.log()
          })
        },
        onCancel() {
          getFile(detail)
          setRemoveFiles([])
        }
      })
    } else {
      save(apiUrl, formData)
    }
  }

  const handleChange = (info: any) => {
    let fileList = [...info.fileList]
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-10)
    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url
      }
      return file
    })
    setFiles(fileList)
    setAttachmentList(fileList)
  }

  const upLoadProps = {
    onChange: handleChange,
    multiple: true,
    beforeUpload: (files: any) => {
      const isLimit = files.size / 1024 / 1024 < 100
      if (!isLimit) {
        message.error('上传文件大小不得大于100MB')
      }
      return false
    }
  }

  const deleteFile = (file: any) => {
    if (detail.attachment) {
      detail.attachment.map((item: any, index: number) => {
        if (item.id === file.id) {
          deletefiles.push(file.id)
        }
      })
      setRemoveFiles(deletefiles)
    }
  }

  const handleDetail = (val: any, row: any) => {
    history.push('/device/detail/' + row.deviceCode + '/exception/' + row.id)
  }
  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const search = (params: any) => {
    if (params['triggerAlarmTime[]']) {
      params['triggerAlarmTime[]'] = [
        formatTime(params['triggerAlarmTime[]'][0]._d),
        formatTime(params['triggerAlarmTime[]'][1]._d)
      ].toString()
    }
    dispatch({
      type: 'params',
      payload: params
    })
  }
  const getFile = (data: any) => {
    const arrs: Array<any> = []
    data.attachment.map((item: any, index: number) => {
      arrs[index] = {
        id: item.id,
        uid: index,
        name: item.name,
        url: api.file.file_read + '?id=' + item.id
      }
    })
    setAttachmentList(arrs)
  }

  const defectDetail = () => {
    if (id != 0) {
      let params = {
        id,
        modelCode
      }
      request.get(api.flaw.flaw_detail, params).then((res) => {
        setDetail(res.data)
        form.setFieldsValue({
          topic: res.data.topic,
          describe: res.data.des,
          priority: res.data.priority,
          assignedAdmin: res.data.assignedAdmin,
          deviceCodeList: res.data.deviceCode
        })
        getFile(res.data)
      })
    }
  }
  const getDeviceList = () => {
    let params = {
      modelId: model.id
    }
    request.get(api.common.select_device, params).then((res) => {
      setDeviceList(res.data)
    })
  }
  const queryAccount = () => {
    let params = {
      modelId: model.id
    }
    request.get(api.common.select_account_use, params).then((res) => {
      setAccount(res.data)
    })
  }
  const queryAlarm = () => {
    let queryParams = {
      code: modelCode,
      ...params
    }

    request.get(api.device.device_detail_exception_list, queryParams).then((res) => {
      setTableLoading(false)
      if (!res.data) {
        res.data = {
          list: [],
          total: 0
        }
      }
      setDate(res.data.list)
    })
  }
  const getErrorList = () => {
    let params = {
      id,
      modelCode
    }
    request.get(api.flaw.flaw_alarm_list, params).then((res) => {
      const selections: Array<any> = []
      res.data.map((item: any) => {
        selections.push(item.id)
      })
      setSelectedRowKeys(selections)
    })
  }

  const [params, dispatch] = useReducer(paramsReducer, initalParams)
  useEffect(getErrorList, [id, modelCode])
  useEffect(queryAccount, [model.id])
  useEffect(defectDetail, [id, modelCode])
  useEffect(getDeviceList, [model.id])
  useEffect(queryAlarm, [params])
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
      title: '解除异常时间',
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
    <div className='defectEdit'>
      <CardContainer>
        <p className='pageName'>{activeName}</p>
        <Form name='validate_other' form={form} {...formItemLayout} onFinish={onFinish}>
          <Form.Item label='型号' name='productModel'>
            <span className='ant-form-text'>{model.name}</span>
          </Form.Item>
          <Form.Item
            name='deviceCodeList'
            label='设备'
            rules={[{ required: false, message: '请选择对应的设备!' }]}>
            <Select placeholder='请选择设备' mode='multiple' allowClear>
              {deviceList.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.code}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name='topic'
            label='缺陷主题'
            rules={[
              {
                required: true,
                message: '请输入缺陷主题'
              }
            ]}>
            <Input maxLength={30} placeholder='请输入缺陷主题' />
          </Form.Item>
          <Form.Item
            name='describe'
            label='缺陷描述'
            rules={[
              {
                required: true,
                message: '请输入缺陷描述'
              }
            ]}>
            <Input.TextArea rows={4} placeholder='请输入缺陷描述' />
          </Form.Item>
          <Form.Item label=' ' colon={false}>
            <Upload {...upLoadProps} fileList={attachmentList} onRemove={deleteFile}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
              <span className='hint'>上传文件大小需小于100MB，总数量需小于10</span>
            </Upload>
          </Form.Item>
          <Form.Item
            name='priority'
            label='优先级'
            rules={[{ required: true, message: '请选择优先级!' }]}>
            <Select placeholder='请选择优先级'>
              <Option value='low'>低</Option>
              <Option value='middle'>中</Option>
              <Option value='high'>高</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='assignedAdmin'
            label='缺陷指派'
            rules={[{ required: false, message: '请选择指派人员!' }]}>
            <Select placeholder='请选择指派人员' allowClear>
              {account.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.code}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item className='submit' wrapperCol={{ span: 2, offset: 0 }}>
            <Button type='primary' htmlType='submit'>
              {activeName}
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <p className='pageName'>关联异常</p>
        <FormForSearch jsonArr={jsonArr} search={search} />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          size='middle'
          loading={tableLoading}
          rowKey='id'
        />
        <p className='marginBottom' />
      </CardContainer>
    </div>
  )
}

export default DefectEdit
