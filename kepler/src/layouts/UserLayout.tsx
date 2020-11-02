import React from 'react'
import { Layout } from 'antd'
import Login from '../pages/Login'
import './UserLayout.less'
const UserLayout = () => {
  return (
    <Layout>
      <Layout.Content className='user-container'>
        <Login />
      </Layout.Content>
    </Layout>
  )
}

export default UserLayout
