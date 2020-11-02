import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const FormLabel = (props: any) => {
  return (
    <span>
      {props.label}
      {props.title && (
        <>
          &nbsp;
          <Tooltip title={props.title}>
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      )}
    </span>
  )
}

export default FormLabel
