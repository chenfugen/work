import React, { useState } from 'react'
import { Modal, Form, message, Upload, Button, Space, Table } from 'antd'
import request from '../../request/request'
import api from '../../api'
import FormLabel from '../../components/FormLabel'
import { UploadOutlined } from '@ant-design/icons'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const DeviceImport = (props: any) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  const [file, setFile] = useState('')
  const onFinish = (values: any) => {
    if (!file) return message.warning('请选择文件')
    let formData = new FormData()
    formData.append('modelId', props.modelId)
    formData.append('file', file)
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    setConfirmLoading(true)
    request
      .post(api.device.device_import, formData, config)
      .then((res) => {
        let fail = res.data.fail
        let success = res.data.success
        let arr = []
        for (let i = 0; i < fail.length; i++) {
          arr.push({
            device: fail[i].device,
            result: 'fail',
            reason: fail[i].reason
          })
        }
        for (let i = 0; i < success.length; i++) {
          arr.push({
            device: success[i],
            result: 'success',
            reason: ''
          })
        }
        Modal.info({
          keyboard: false,
          maskClosable: false,
          okText: '确定',
          icon: null,
          title: '设备导入结果',
          content: (
            <Table
              bordered
              rowKey='device'
              dataSource={arr}
              size='middle'
              pagination={false}
              columns={columns}></Table>
          ),
          onCancel: (close) => {
            props.queryDevice()
            props.queryDeviceCount()
            setConfirmLoading(false)
            onCancel()
            close()
          },
          onOk: (close) => {
            props.queryDevice()
            props.queryDeviceCount()
            setConfirmLoading(false)
            onCancel()
            close()
          }
        })
      })
      .catch(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  const beforeUpload = (file: any) => {
    console.log(file)
    setFile(file)
    return false
  }
  const onRemove = (file: any) => {
    setFile('')
  }
  const columns = [
    {
      title: '唯一码',
      dataIndex: 'device'
    },
    {
      title: '导入结果',
      dataIndex: 'result',
      render(val: string) {
        let color = val === 'fail' ? 'red' : 'green'
        let text = val === 'fail' ? '失败' : '成功'
        return <span style={{ color: color }}>{text}</span>
      }
    },
    {
      title: '描述',
      dataIndex: 'reason'
    }
  ]
  return (
    <Modal
      title='导入设备'
      visible={visible}
      confirmLoading={confirmLoading}
      destroyOnClose
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}>
      <Form
        name='device-import'
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item label={<FormLabel label='模板' />} style={{ marginBottom: '8px' }}>
          <a
            href={`/api/web/things/template/export?token=${localStorage.getItem('login_token')}`}
            style={{ fontSize: '12px' }}>
            导入模板
          </a>
        </Form.Item>
        <Form.Item label={<FormLabel label='附件上传' />} extra='仅支持 xlsx，xls 格式'>
          <Space>
            <Upload
              openFileDialogOnClick={!file}
              onRemove={onRemove}
              beforeUpload={beforeUpload}
              disabled={confirmLoading}
              accept='.xlsx, .xls'>
              <Button icon={<UploadOutlined />} size='middle'>
                上传文件
              </Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
      {}
    </Modal>
  )
}

export default DeviceImport
