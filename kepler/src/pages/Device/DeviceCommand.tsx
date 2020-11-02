import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, Input, Row, Col, message, Dropdown, Menu, Tag, Alert } from 'antd'
import request from '../../request/request'
import FormLabel from '../../components/FormLabel'
import api from '../../api'
import style from './DeviceCommand.module.css'
import { DownOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import {
  createMqttClient,
  subscribeCommand,
  onlineCommand,
  createSetCommand
} from '../../utils/mqttClient'
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
}

const DeviceCommands = (props: any) => {
  let mqttClient = useRef<any>(null)
  const [form] = Form.useForm()
  const [deviceOnline, setDeviceOnline] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(props.visible)
  useEffect(() => {
    if (mqttClient.current === null) {
      mqttClient.current = createMqttClient()
      mqttClient.current.on('connect', function () {
        mqttClient.current.subscribe(onlineCommand(props.modelCode, props.code))
        mqttClient.current.subscribe(subscribeCommand(props.modelCode, props.code))
        console.log(
          onlineCommand(props.modelCode, props.code),
          subscribeCommand(props.modelCode, props.code)
        )
      })
      mqttClient.current.on('message', function (topic: string, message: any) {
        let payload
        try {
          payload = JSON.parse(message.toString())
        } catch (err) {
          payload = {}
          message.error('参数响应错误')
        }
        console.log(topic, payload)
        if (payload.cmd === 'online') {
          if (payload.params && payload.params.online) {
            setDeviceOnline(true)
          } else {
            setDeviceOnline(false)
          }
        }
      })
    }
  }, [])
  const onFinish = (values: any) => {
    let command = values.command
    try {
      command = JSON.parse(command)
    } catch (err) {
      message.error('请输入json格式指令')
      return
    }
    if (typeof command !== 'object' || Array.isArray(command)) {
      message.error('请输入正确格式指令')
      return
    }
    setConfirmLoading(true)
    mqttClient.current.publish(
      createSetCommand(props.modelCode, props.code),
      JSON.stringify(command)
    )
    message.success('下发成功')
    setConfirmLoading(false)
  }
  const onCancel = () => {
    let allow = true
    if (deviceOnline) {
      allow = window.confirm('确认断开与mqtt服务器的连接？')
    }
    if (allow) {
      mqttClient.current.end()
      setVisible(false)
      props.setVisible(false)
    }
  }
  const CommandCard = (command: any) => {
    const handleMenuClick = (e: any) => {
      if (!deviceOnline) return
      let value = e.key
      let params = {
        cmd: 'set',
        params: {
          [command.param]: value || ''
        }
      }
      mqttClient.current.publish(
        createSetCommand(props.modelCode, props.code),
        JSON.stringify(params)
      )
      console.log(params)
      message.success('指令已下发')
    }
    const menu = (obj: any) => {
      let keys = Object.keys(obj)
      return (
        <Menu onClick={handleMenuClick}>
          {keys.map((key: any) => {
            return <Menu.Item key={key}>{obj[key]}</Menu.Item>
          })}
        </Menu>
      )
    }
    return (
      <Col span={8}>
        <div className={style.commandContainer}>
          {command.commands && Object.keys(command.commands).length > 0 ? (
            <Dropdown overlay={menu(command.commands)} disabled={!deviceOnline}>
              <span
                className={classnames([style.commandInner, deviceOnline ? '' : style.disabled])}>
                {command.name}
                <DownOutlined className={style.absoluteIcon} />
              </span>
            </Dropdown>
          ) : (
            <span
              className={classnames([style.commandInner, deviceOnline ? '' : style.disabled])}
              onClick={handleMenuClick}>
              {command.name}
            </span>
          )}
        </div>
      </Col>
    )
  }
  const title = (
    <div>
      <span>指令下发 - {props.code} </span>
      {deviceOnline ? <Tag color='#87d068'>在线</Tag> : <Tag color='#d1d1d1'>离线</Tag>}
    </div>
  )
  return (
    <Modal
      wrapClassName='device-edit'
      title={title}
      visible={visible}
      maskClosable={false}
      confirmLoading={confirmLoading}
      destroyOnClose
      okButtonProps={{ disabled: !deviceOnline }}
      onCancel={onCancel}
      onOk={() => form.submit()}>
      {!deviceOnline ? (
        <Alert style={{ marginBottom: '16px' }} message='离线设备不支持指令下发' type='warning' />
      ) : null}
      {props.commands.length ? (
        <span style={{ display: 'block', marginBottom: '16px' }}>快捷指令(点击下发)</span>
      ) : null}
      <Row gutter={[16, 16]}>
        {props.commands.map((command: any) => {
          return <CommandCard {...command} key={command.param} />
        })}
      </Row>
      <Form
        name='commands'
        scrollToFirstError
        onFinish={onFinish}
        layout='vertical'
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item label={<FormLabel label='自定义指令' title='json格式指令' />} name='command'>
          <Input.TextArea
            disabled={!deviceOnline}
            allowClear
            placeholder='{"cmd": "set","params":{"open":1}}'
            rows={5}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DeviceCommands
