import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message, Radio, Tree } from 'antd'
import request from '../../../request/request'
import api from '../../../api'
import FormLabel from '../../../components/FormLabel'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const RoleEdit = (props: any) => {
  const [visible, setVisible] = useState(props.visible)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [checkStrictly, setCheckStrictly] = useState(false)
  const [title, setTitle] = useState('新增角色')
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [halfCheck, setHalfCheck] = useState<string[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)
  const [form] = Form.useForm()
  useEffect(() => {
    if (props.detail) {
      setTitle('编辑角色')
      form.setFieldsValue(props.detail)
    }
  }, [props.detail, form])
  const onFinish = (values: any) => {
    console.log(values)
    let params = {
      ...values,
      menuIds: [...checkedKeys, ...halfCheckedKeys, ...halfCheck]
    }
    if (props.detail) {
      params.id = props.detail.id
    }
    let qapi = props.detail ? api.system.role_update : api.system.role_add
    setConfirmLoading(true)
    request
      .post(qapi, params)
      .then(() => {
        message.success(props.detail ? '修改成功' : '创建成功')
        props.queryRole()
      })
      .finally(() => {
        setConfirmLoading(false)
        onCancel()
      })
  }
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  // 权限
  const onExpand = (expandedKeys: any) => {
    console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  const onCheck = (checkedKeys: any, e: any) => {
    console.log('onCheck', checkedKeys)
    console.log('onCheck e', e)
    setCheckedKeys(checkedKeys)
    setHalfCheckedKeys(e.halfCheckedKeys)
    setHalfCheck([])
  }

  const onSelect = (selectedKeys: any, info: any) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeys)
  }
  useEffect(() => {
    if (props.treeData) {
      let queue = [...props.treeData]
      let arr = []
      let halfCheck = []
      let level = 0
      while (queue.length) {
        let size = queue.length
        for (let i = 0; i < size; i++) {
          let node = queue.shift()
          // 第一层的菜单默认选中
          if (level === 0 && node.accessType === 'menu') {
            arr.push(node.id)
          } else if (node.isPermission === 'Y') {
            if (node.children.length === 0) {
              arr.push(node.id)
            } else {
              // 编辑时没有动过权限则半选菜单无法获取到
              halfCheck.push(node.id)
            }
          }
          for (let i = 0; i < node.children.length; i++) {
            queue.push(node.children[i])
          }
        }
        level++
      }
      setCheckedKeys(arr)
      setHalfCheck(halfCheck)
      setTimeout(() => {
        setCheckStrictly(false)
      }, 1000)
    }
  }, [props.treeData])
  const SelfNode = (nodeData: any) => {
    return <span key={nodeData.id}>{nodeData.name}</span>
  }
  return (
    <Modal
      visible={visible}
      title={title}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      destroyOnClose={true}>
      {visible && (
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ status: 'Y' }}
          {...formLayout}
          preserve={false}
          autoComplete='off'>
          <Form.Item
            label={<FormLabel label='角色名称' />}
            name='name'
            rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input allowClear maxLength={30} placeholder='请输入角色名称' />
          </Form.Item>
          {/* <Form.Item
            label={<FormLabel label='角色状态' />}
            name='status'
            rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value='Y'>启用</Radio>
              <Radio value='N'>禁用</Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item label={<FormLabel label='备注' />} name='description'>
            <Input.TextArea
              rows={3}
              allowClear
              maxLength={100}
              placeholder='请输入备注(限制100字符)'
            />
          </Form.Item>
          <Form.Item label={<FormLabel label='角色权限' />}>
            <Tree
              defaultExpandAll={true}
              style={{ maxHeight: '350px', overflow: 'auto' }}
              treeData={props.treeData}
              checkable
              checkStrictly={checkStrictly}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              titleRender={(nodeData) => SelfNode(nodeData)}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default RoleEdit
