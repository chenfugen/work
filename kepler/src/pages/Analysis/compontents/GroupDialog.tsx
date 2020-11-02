import React, { useState, useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import FormLabel from '../../../components/FormLabel'
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

const GroupDialog = (props: any) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(props.visible)
  useEffect(() => {
    if (props.groupInfo.groupInterval) {
      form.setFieldsValue({ groupInterval: props.groupInfo.groupInterval })
    }
  }, [props.groupInfo, form])
  const onFinish = (values: any) => {
    console.log(values)
    props.setGroupInfo(values)
    onCancel()
  }

  const onCancel = () => {
    setVisible(false)
    props.setVisible(false)
  }
  return (
    <Modal
      wrapClassName='group-edit'
      title='设置组距'
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      destroyOnClose
      onOk={() => form.submit()}>
      <Form
        name='group'
        scrollToFirstError
        onFinish={onFinish}
        form={form}
        {...formLayout}
        preserve={false}
        autoComplete='off'>
        <Form.Item
          name='groupInterval'
          label={
            <FormLabel
              label='组距'
              title='组距是每组的最高数值与最低数值之间的距离。组距越小，组数越多，合理的组距可获得直观的频率分布图。'
            />
          }>
          <Input type='number' placeholder='请输入组距' allowClear />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default GroupDialog
