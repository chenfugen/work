import { Layout } from 'antd'
import React from 'react'
import CommonMenu from '../components/CommonMenu'
import MenuLogo from '../components/MenuLogo'
import UserInfo from '../components/UserInfo'
import style from './Header.module.css'
import Download from '../components/Download'
const { Header } = Layout

const CommonHeader = () => {
  return (
    <Header className={style.commonHeader}>
      <MenuLogo />
      <CommonMenu />
      <UserInfo />
      <Download />
    </Header>
  )
}

export default CommonHeader
