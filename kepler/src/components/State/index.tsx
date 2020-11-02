import React from 'react'
import './index.less'
import classNames from 'classnames'

const State = (props: any) => {
  return (
    <span
      style={props.style}
      className={classNames('state-container', [props.color ? props.color : ''])}>
      {props.children}
    </span>
  )
}

export default State
