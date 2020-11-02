import React from 'react'
import { ReactComponent as Logo } from '../../assets/top_bar_logo_bg.svg'
import { ReactComponent as TextLogo } from '../../assets/common_logo_white.svg'
import './index.less'

const MenuLogo = () => {
  return (
    <div className='header-logo'>
      <Logo title='' />
      <TextLogo className='header-text-logo' title='' />
    </div>
  )
}

export default MenuLogo
