import { Layout } from 'antd'
import React from 'react'
import CommonHeader from './Header'
import './BasicLayout.less'
import { Switch, Route } from 'react-router-dom'
const { Content, Footer } = Layout

const BasicLayout = (props: any) => {
  return (
    <Layout style={{ backgroundColor: '#EFF1F5' }}>
      <CommonHeader></CommonHeader>
      <Content className='main-container'>
        <Switch>
          {props.routes.map((route: any, i: number) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Route path='*'>not found</Route>
        </Switch>
      </Content>
      <Footer className='main-footer'>Copyright © 2020 HadLinks. All rights reserved.</Footer>
    </Layout>
  )
}

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}

export default BasicLayout
