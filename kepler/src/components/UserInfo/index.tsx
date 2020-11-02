import React, { useEffect, useState } from 'react'
import { Dropdown, Menu } from 'antd'
import style from './index.module.css'
import { useHistory } from 'react-router-dom'
import request from '../../request/request'
import api from '../../api'
import { useDispatch } from 'react-redux'
import UserInfoEdit from './UserInfoEdit'
import PasswordEdit from './PasswordEdit'

const UserInfo = () => {
  let history = useHistory()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const queryUserInfo = () => {
    request.get(api.system.account_userInfo).then((res) => {
      setUserInfo(res.data)
      dispatch({ type: 'user', payload: res.data })
    })
  }
  useEffect(queryUserInfo, [])
  const handleClick = (props: any) => {
    switch (props.key) {
      case 'logout':
        history.push('/')
        localStorage.removeItem('selectOption')
        localStorage.removeItem('options')
        break
      case 'info':
        setVisible(true)
        break
      case 'password':
        setPasswordVisible(true)
        break
    }
  }
  const menu = () => {
    return (
      <Menu onClick={handleClick}>
        <Menu.Item key='info'>个人信息</Menu.Item>
        <Menu.Item key='password'>修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'>退出登录</Menu.Item>
      </Menu>
    )
  }
  return (
    <>
      <Dropdown overlay={menu} placement='bottomCenter'>
        <span className={style.user}>{userInfo.name}</span>
      </Dropdown>
      {visible && (
        <UserInfoEdit
          detail={userInfo}
          visible={visible}
          setVisible={setVisible}
          queryUserInfo={queryUserInfo}
        />
      )}
      {passwordVisible && (
        <PasswordEdit visible={passwordVisible} setVisible={setPasswordVisible} />
      )}
    </>
  )
}

export default UserInfo
