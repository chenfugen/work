import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Upload, Input } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import { UploadOutlined } from '@ant-design/icons'
import { formatTime } from '../../../utils/utils'
import style from './css/ParamsTable.module.css'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const ScriptTable = (props: any) => {
  const [data, setData] = useState([])
  const [total, seTtotal] = useState(0)
  const [visible, setVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const queryScript = () => {
    let params = {
      modelId: props.id
    }
    setTableLoading(true)
    request
      .get(api.system.model_detail_script, params)
      .then((res) => {
        setData(res.data)
        seTtotal(res.data.length)
      })
      .finally(() => {
        setTableLoading(false)
      })
  }
  useEffect(queryScript, [])
  const columns = [
    {
      title: '创建时间',
      dataIndex: 'uploadTime',
      width: 200,
      render(time: number) {
        return formatTime(time)
      }
    },
    {
      title: '解析脚本',
      dataIndex: 'scriptName',
      render(name: string, row: any) {
        if (row.script) {
          return (
            <a href={row.script} download={name}>
              {name}
            </a>
          )
        } else {
          return name
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'scriptRemark'
    }
  ]
  const uploadScript = () => {
    setVisible(true)
  }
  const handleOk = () => {
    form.submit()
  }
  const onCancel = () => {
    setVisible(false)
  }
  const onFinish = (values: any) => {
    let formdata = new FormData()
    for (const key in values) {
      if (Array.isArray(values[key])) {
        values[key] = values[key][0]
      }
      formdata.append(key, values[key] || '')
    }
    formdata.append('modelId', props.id)
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    setConfirmLoading(true)
    request
      .post(api.system.model_detail_script_add, formdata, config)
      .then(() => {
        queryScript()
        props.queryDetail()
        setVisible(false)
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }
  const beforeUpload = (file: any) => {
    console.log(file)
    // setFile(file)
    return false
  }
  const normFile = (e: any) => {
    console.log('file', e)
    if (e.file.status === 'removed') {
      return []
    }
    return [e.file]
  }
  return (
    <>
      {props.role.editRole ? (
        <Button type='primary' onClick={uploadScript} style={{ marginBottom: '16px' }}>
          上传解析脚本
        </Button>
      ) : null}
      <Table
        loading={tableLoading}
        rowKey='id'
        pagination={false}
        dataSource={data}
        columns={columns}
        size='middle'></Table>
      <div className={style.total}>共 {total} 条</div>
      <Modal
        visible={visible}
        title='上传解析脚本'
        onCancel={onCancel}
        onOk={handleOk}
        maskClosable={false}
        confirmLoading={confirmLoading}
        destroyOnClose>
        <Form
          {...formLayout}
          autoComplete='off'
          onFinish={onFinish}
          form={form}
          scrollToFirstError
          preserve={false}>
          <Form.Item
            name='script'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            extra='仅支持 jar 格式文件'
            rules={[{ required: true }]}
            label='解析脚本'>
            <Upload accept='.jar' beforeUpload={beforeUpload}>
              <Button>
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label='备注' name='scriptRemark'>
            <Input.TextArea maxLength={100} rows={3} allowClear placeholder='备注(限制100字内)' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ScriptTable
