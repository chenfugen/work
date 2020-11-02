import React, { useState, useEffect } from 'react'
import { Modal, Form, Tree } from 'antd'
import FormLabel from '../../../components/FormLabel'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
const RoleEdit = (props: any) => {
  const [visible, setVisible] = useState(props.visible)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const onExpand = (expandedKeys: any) => {
    console.log('onExpand', expandedKeys)
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  const onCheck = (checkedKeys: any) => {
    console.log('onCheck', checkedKeys)
    setCheckedKeys(checkedKeys)
  }

  const onSelect = (selectedKeys: any, info: any) => {
    console.log('onSelect', info)
    setSelectedKeys(selectedKeys)
  }
  useEffect(() => {
    if (props.treeData) {
      let queue = [...props.treeData]
      let arr = []
      let level = 0
      while (queue.length) {
        let size = queue.length
        for (let i = 0; i < size; i++) {
          let node = queue.shift()
          // 第一层的菜单默认选中
          if (level === 0 && node.accessType === 'menu') {
            arr.push(node.id)
          }
          if (node.isPermission === 'Y' && node.children.length === 0) {
            arr.push(node.id)
          }
          for (let i = 0; i < node.children.length; i++) {
            queue.push(node.children[i])
          }
        }
        level++
      }
      setCheckedKeys(arr)
    }
  }, [props.treeData])
  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  const SelfNode = (nodeData: any) => {
    return <span key={nodeData.id}>{nodeData.name}</span>
  }
  return (
    <Modal
      visible={visible}
      title='角色详情'
      onCancel={onCancel}
      onOk={onCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}>
      {visible && (
        <Form {...formLayout} preserve={false} autoComplete='off'>
          <Form.Item label={<FormLabel label='角色名称' />}>
            <span>{props.detail.name}</span>
          </Form.Item>
          {/* <Form.Item label={<FormLabel label='角色状态' />}>
            <span>{props.detail.statusName}</span>
          </Form.Item> */}
          <Form.Item label={<FormLabel label='备注' />}>
            <span>{props.detail.description}</span>
          </Form.Item>
          <Form.Item label={<FormLabel label='角色权限' />}>
            <Tree
              treeData={props.treeData}
              checkable
              disabled
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
