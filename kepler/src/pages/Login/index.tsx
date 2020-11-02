import React, { useState } from 'react'
import style from './index.module.css'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request from '../../request/request'
import api from '../../api'
import { useHistory } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/common_logo.svg'

const Login = () => {
  const [loading, setLoading] = useState(false)
  let history = useHistory()
  const onFinish = (values: any) => {
    let params = {
      ...values,
      code: ''
    }
    setLoading(true)
    request
      .post(api.common.login, params)
      .then((res) => {
        localStorage.setItem('login_token', res.data)
        history.push('/device')
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className={style.loginPage}>
      <Logo className={style.logo} />
      <div className={style.name}>物联网研发与测试协作平台</div>
      <Form
        name='normal_login'
        className={style.loginForm}
        initialValues={{ remember: true }}
        autoComplete='off'
        onFinish={onFinish}>
        <Form.Item name='account' rules={[{ required: true, message: '请输入账号!' }]}>
          <Input
            size='large'
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='账号'
          />
        </Form.Item>
        <Form.Item name='pwd' rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password
            size='large'
            prefix={<LockOutlined className='site-form-item-icon' />}
            placeholder='密码'
          />
        </Form.Item>
        <Form.Item>
          <Button
            size='large'
            type='primary'
            htmlType='submit'
            className={style.loginBtn}
            loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
