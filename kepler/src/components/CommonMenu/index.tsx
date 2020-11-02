import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import style from './index.module.css'
import { useDispatch } from 'react-redux'
import request from '../../request/request'
import api from '../../api'
interface MenuDto {
  name: string
  url: string
  children?: Array<any>
  accessType: String
  operationType: String
  state: String
}

const menu = [
  '/device',
  '/analysis/single',
  '/analysis/multiple',
  '/analysis/contrast',
  '/analysis/exception',
  '/defects',
  '/system/model',
  '/system/role',
  '/system/account',
  '/system/log'
]

const CommonMenu = () => {
  let location = useLocation()
  let history = useHistory()
  const dispatch = useDispatch()
  const [systemMenu, setSystemMenu] = useState<any>({})
  const handleMenuClick = function (e: any) {
    history.push(e.key)
  }
  const getMatchMenu = (path: string | undefined): string => {
    if (!path) return ''
    for (let i = 0; i < menu.length; i++) {
      let match = path.match(menu[i])
      if (match) {
        if (match.index === 0) {
          return menu[i]
        }
      }
    }
    return ''
  }
  const queryMenuInfo = () => {
    request.get(api.common.menu_list).then((res) => {
      dispatch({ type: 'menu', payload: res.data })
      for (let i = 0; i < res.data.length; i++) {
        if (
          res.data[i].accessType === 'module' &&
          res.data[i].url === 'system' &&
          res.data[i].isPermission === 'Y'
        ) {
          setSystemMenu(res.data[i])
          break
        }
      }
    })
  }
  useEffect(queryMenuInfo, [])
  return (
    <Menu
      className={style.commonMenu}
      theme='dark'
      onClick={handleMenuClick}
      mode='horizontal'
      selectedKeys={[getMatchMenu(location.pathname)]}>
      <Menu.Item key='/device'>设备中心</Menu.Item>
      <Menu.Item key='/analysis/single'>一维分析</Menu.Item>
      <Menu.Item key='/analysis/multiple'>多维分析</Menu.Item>
      <Menu.Item key='/analysis/contrast'>对比分析</Menu.Item>
      <Menu.Item key='/analysis/exception'>异常分析</Menu.Item>
      <Menu.Item key='/defects'>缺陷跟踪</Menu.Item>
      {systemMenu.children && (
        <Menu.SubMenu key='3' title={<span>系统管理</span>}>
          {!!systemMenu.children &&
            systemMenu.children.map((menu: any) => {
              if (menu.isPermission === 'Y') {
                return <Menu.Item key={menu.url}>{menu.name}</Menu.Item>
              }
              return null
            })}
          {process.env.NODE_ENV === 'development' && (
            <Menu.Item key='/system/menu'>菜单管理</Menu.Item>
          )}
        </Menu.SubMenu>
      )}
    </Menu>
  )
}

export default CommonMenu
