import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd'
import { PaperClipOutlined, UploadOutlined } from '@ant-design/icons'
import './index.less'
import { useParams } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'

const { Option } = Select
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const defaultFileList = [
  {
    uid: '',
    name: '',
    status: '',
    url: ''
  }
]
const DefectDispose = (props: any) => {
  const detail = props.detail
  let { id, modelCode } = useParams()
  const modelName = detail.status === 'CLOSE' ? '重新开启' : '处理缺陷'
  const modelId = JSON.parse(localStorage.getItem('options') || '')[2]
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(props.visible)
  const [activeName, setActiveName] = useState(modelName)
  const [attachmentList, setAttachmentList] = useState<any>([])
  const [files, setFiles] = useState<any>([])
  const [account, setAccount] = useState<any>([])
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState({
    assignedAdmin: '',
    status: '',
    explanation: '',
    attachmentList: []
  })

  const handleCancel = (e: any) => {
    setVisible(false)
    props.setVisible(false)
  }

  const onFinish = (values: any) => {
    setConfirmLoading(true)
    const formData = new FormData()
    formData.append('modelCode', modelCode)
    formData.append('id', id)
    formData.append('assignedAdmin', values.assignedAdmin)
    formData.append('status', values.status || 'WAIT')
    formData.append('explanation', values.explanation)
    files.forEach((file: any) => {
      formData.append('attachmentList', file.originFileObj)
    })
    request
      .post(api.flaw.flaw_handle, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.success) {
          message.success('处理成功')
          props.updateDetail()
          props.updateProcess()
          props.setVisible(false)
        } else {
          message.warning(res.msg)
        }
      })
      .finally(() => {
        setConfirmLoading(false)
      })
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
    defaultFileList: [],
    beforeUpload: (files: any) => {
      const isLimit = files.size / 1024 / 1024 < 100
      if (!isLimit) {
        message.error('上传文件大小不得大于100MB')
      }
      return false
    }
  }
  const queryAccount = () => {
    let params = {
      modelId: modelId
    }
    request.get(api.common.select_account_use, params).then((res) => {
      setAccount(res.data)
    })
  }
  useEffect(queryAccount, [modelId])
  return (
    <div className='defectDispose'>
      <Modal
        title={activeName}
        visible={visible}
        centered
        confirmLoading={confirmLoading}
        destroyOnClose
        onOk={() => form.submit()}
        onCancel={handleCancel}>
        <Form
          {...formLayout}
          form={form}
          initialValues={initialValues}
          name='control-hooks'
          onFinish={onFinish}
          preserve={false}
          autoComplete='off'>
          {detail.status === 'CLOSE' ? (
            <Form.Item label='变更状态'>
              <span className='anchor red'></span>
              <span className='status'> 待处理</span>
            </Form.Item>
          ) : (
            <Form.Item
              name='status'
              label='变更状态'
              rules={[{ required: true, message: '请选择状态!' }]}>
              <Select placeholder='请选择状态'>
                <Option value='WAIT' style={{ display: detail.status === 'WAIT' ? 'none' : '' }}>
                  待处理
                </Option>
                <Option
                  value='FINISH'
                  style={{ display: detail.status === 'FINISH' ? 'none' : '' }}>
                  已处理
                </Option>
                <Option value='DELAY' style={{ display: detail.status === 'DELAY' ? 'none' : '' }}>
                  暂不处理
                </Option>
                <Option value='CLOSE' style={{ display: detail.status === 'CLOSE' ? 'none' : '' }}>
                  已关闭
                </Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item label='说明' valuePropName='file'>
            <Form.Item
              name='explanation'
              rules={[
                {
                  required: false,
                  message: '请输入说明'
                }
              ]}>
              <Input.TextArea rows={4} placeholder='请输入说明' />
            </Form.Item>
            <p className='marginBottom' />
            <Upload {...upLoadProps} fileList={attachmentList}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
              <span className='hint'>上传文件大小需小于100MB，总数量需小于10</span>
            </Upload>
          </Form.Item>
          <Form.Item
            name='assignedAdmin'
            label='缺陷指派'
            rules={[{ required: false, message: '请选择指派人员!' }]}>
            <Select placeholder='请选择指派人员'>
              {account.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.code}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default DefectDispose
