import React, { useImperativeHandle, forwardRef, useCallback, useEffect, useRef } from 'react'
import { Form, Input, Button, Space, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import CommonSelect from './Select'
import './index.less'

const { RangePicker } = DatePicker

const FormForSearch = forwardRef((props: any, ref) => {
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.resetFields()
    }
  }))

  useEffect(() => {
    if (props.assignedAdmin) {
      form.setFieldsValue({
        assignedAdmin: props.assignedAdmin
      })
    }
  }, [props.assignedAdmin])

  const onFinish = (values: any) => {
    props.search(values)
  }
  const onValuesChange = (val: any) => {
    console.log(val)
  }

  return (
    <Form
      name='search-form'
      form={form}
      onFinish={onFinish}
      layout='inline'
      onValuesChange={onValuesChange}
      className='search-form'>
      {props.jsonArr.map((el: any) => {
        if (el.type === 'select') {
          return (
            <Form.Item name={el.filed} key={el.filed}>
              <CommonSelect {...el} allowClear />
            </Form.Item>
          )
        } else if (el.type === 'input') {
          return (
            <Form.Item name={el.filed} key={el.filed}>
              <Input autoComplete='off' placeholder={el.placeholder} allowClear />
            </Form.Item>
          )
        } else if (el.type === 'datepicker') {
          return (
            <Form.Item name={el.filed} key={el.filed} initialValue={el.initialValues}>
              <RangePicker picker={el.picker} allowClear {...el.props} />
            </Form.Item>
          )
        }
        return null
      })}
      <Form.Item>
        <Space>
          <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
            查询
          </Button>
          <Button htmlType='submit' onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
})

export default FormForSearch
